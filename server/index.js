import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { randomBytes, createCipheriv, createDecipheriv } from "crypto";
import { getDb } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
// ENCRYPTION_KEY must be 32 bytes for AES-256
const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || "dev_key_32_bytes_long_for_demo!!").padEnd(32).slice(0,32);

function encrypt(text) {
  const iv = randomBytes(12); // 96-bit for GCM
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY), iv, { authTagLength: 16 });
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    data: Buffer.concat([encrypted, tag]).toString("base64"),
    iv: iv.toString("base64")
  };
}

function decrypt(dataBase64, ivBase64) {
  const iv = Buffer.from(ivBase64, "base64");
  const combined = Buffer.from(dataBase64, "base64");
  const tag = combined.slice(combined.length - 16);
  const encrypted = combined.slice(0, combined.length - 16);
  const decipher = createDecipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY), iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

async function main() {
  const db = await getDb();

  // Run a safe migration: ensure `email` column exists on users table
  try {
    const info = await db.all(`PRAGMA table_info(users);`);
    const hasEmail = info.some((c) => c.name === "email");
    if (!hasEmail) {
      await db.run("ALTER TABLE users ADD COLUMN email TEXT;");
    }
  } catch (err) {
    // ignore migration errors for now
  }

  const app = express();
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());

  // Simple auth middleware
  function auth(req, res, next) {
    const authHeader = req.headers["authorization"] || "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ error: "Missing token" });
    try {
      const payload = jwt.verify(match[1], JWT_SECRET);
      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  }

  app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: "username and password required" });
    const hash = await bcrypt.hash(password, 10);
    try {
      const result = await db.run("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)", username, email || null, hash);
      const user = { id: result.lastID, username, email: email || null };
      const token = jwt.sign(user, JWT_SECRET);
      res.json({ user, token });
    } catch (err) {
      res.status(400).json({ error: "Username or email already exists" });
    }
  });

  app.post("/api/login", async (req, res) => {
    const { username, usernameOrEmail, password } = req.body || {};
    const identifier = usernameOrEmail || username;
    if (!identifier || !password) return res.status(400).json({ error: "username/email and password required" });
    const row = await db.get("SELECT * FROM users WHERE username = ? OR email = ?", identifier, identifier);
    if (!row) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, row.password_hash);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const user = { id: row.id, username: row.username, email: row.email };
    const token = jwt.sign(user, JWT_SECRET);
    res.json({ user, token });
  });

  // Send message (body: { chatId, content, encrypt: boolean })
  app.post("/api/messages", auth, async (req, res) => {
    const { chatId, content } = req.body || {};
    if (!chatId || !content) return res.status(400).json({ error: "chatId and content required" });
    // Server encrypts content at rest
    const { data, iv } = encrypt(content);
    const ts = Date.now();
    const result = await db.run(
      "INSERT INTO messages (chat_id, sender_id, content, iv, created_at) VALUES (?, ?, ?, ?, ?)",
      chatId,
      req.user.id,
      data,
      iv,
      ts
    );
    const message = {
      id: result.lastID,
      chat_id: chatId,
      sender_id: req.user.id,
      content: content, // return decrypted content in response
      created_at: ts
    };

    // Broadcast to WS clients subscribed to this chat
    broadcastToChat(chatId, { type: "message", message });

    res.json({ message });
  });

  app.get("/api/messages", auth, async (req, res) => {
    const chatId = req.query.chatId;
    if (!chatId) return res.status(400).json({ error: "chatId query required" });
    const rows = await db.all("SELECT * FROM messages WHERE chat_id = ? ORDER BY created_at ASC", chatId);
    const messages = rows.map(r => ({
      id: r.id,
      chat_id: r.chat_id,
      sender_id: r.sender_id,
      content: decrypt(r.content, r.iv),
      created_at: r.created_at
    }));
    res.json({ messages });
  });

  // Search for users by username
  app.get("/api/users/search", auth, async (req, res) => {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Search query required" });
    
    const user = await db.get(
      "SELECT id, username, email FROM users WHERE username = ? OR email = ?",
      query,
      query
    );
    
    if (!user || user.id === req.user.id) {
      return res.json({ user: null });
    }
    
    // Check if already friends
    const friendship = await db.get(
      "SELECT 1 FROM friends WHERE user_id = ? AND friend_id = ?",
      req.user.id,
      user.id
    );
    
    if (friendship) {
      return res.json({ user: null, error: "Already friends with this user" });
    }
    
    res.json({ user: { id: user.id, username: user.username } });
  });

  // Serve a simple health route
  app.get("/api/health", (req, res) => res.json({ ok: true }));

  // Add friend by username
  app.post("/api/friends/add", auth, async (req, res) => {
    const { username, identifier } = req.body || {};
    const ident = identifier || username;
    if (!ident) return res.status(400).json({ error: "username or email required" });
    const friend = await db.get("SELECT id, username, email FROM users WHERE username = ? OR email = ?", ident, ident);
    if (!friend) return res.status(404).json({ error: "User not found" });
    if (friend.id === req.user.id) return res.status(400).json({ error: "Cannot add yourself" });
    try {
      await db.run("INSERT INTO friends (user_id, friend_id) VALUES (?, ?)", req.user.id, friend.id);
      res.json({ friend: { id: friend.id, username: friend.username } });
    } catch (err) {
      res.status(400).json({ error: "Already friends or invalid" });
    }
  });

  // Get friends list
  app.get("/api/friends", auth, async (req, res) => {
    const rows = await db.all(
      `SELECT u.id, u.username
       FROM friends f
       JOIN users u ON u.id = f.friend_id
       WHERE f.user_id = ?`,
      req.user.id
    );
    res.json({ friends: rows });
  });

  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  // Map of ws -> subscribed chatIds (Set)
  const subs = new Map();

  function broadcastToChat(chatId, payload) {
    const msg = JSON.stringify(payload);
    for (const [ws, set] of subs.entries()) {
      if (set.has(chatId) && ws.readyState === ws.OPEN) ws.send(msg);
    }
  }

  wss.on("connection", (ws) => {
    subs.set(ws, new Set());
    ws.on("message", (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "subscribe" && msg.chatId) {
          subs.get(ws).add(msg.chatId);
          ws.send(JSON.stringify({ type: "subscribed", chatId: msg.chatId }));
        }
        if (msg.type === "unsubscribe" && msg.chatId) {
          subs.get(ws).delete(msg.chatId);
          ws.send(JSON.stringify({ type: "unsubscribed", chatId: msg.chatId }));
        }
      } catch (err) {
        // ignore
      }
    });
    ws.on("close", () => subs.delete(ws));
  });

  server.listen(PORT, () => {
    console.log(`Backend API + WS server listening on http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
