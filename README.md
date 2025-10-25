

# SecureChat (local dev)

This is a Vite + React frontend with a small Express + SQLite backend (in `server/`).

## Run locally (PowerShell)

Follow these commands in two separate terminals: one for the frontend and one for the backend.

1) Frontend (project root)

Install dependencies (run once):
```powershell
cd 'C:\Users\Rohan\OneDrive\Desktop\projects\secure-whisper-22'
npm install
```

Start the dev frontend (Vite):
```powershell
npm run dev
```

Vite typically serves at http://localhost:5173.

2) Backend (separate terminal)

Install backend deps and start:
```powershell
cd 'C:\Users\Rohan\OneDrive\Desktop\projects\secure-whisper-22\server'
npm install
npm start
```

By default the backend listens on http://localhost:4000.

3) Optional: set environment variables for the backend (PowerShell)

You can set a JWT secret and a 32-byte encryption key for AES-256-GCM before starting the backend:
```powershell
$env:JWT_SECRET = 'your_jwt_secret_here'
$env:ENCRYPTION_KEY = '32_byte_secret_key_here___________'
npm start
```

Or create a `server/.env` file with:
```
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_32_byte_key_here
PORT=4000
```

4) Quick health check (PowerShell)
```powershell
Invoke-RestMethod 'http://localhost:4000/api/health'
```

Expected response:
```json
{ "ok": true }
```

Notes
- Frontend posts auth requests to `http://localhost:4000/api/*` (see `src/pages/AuthPage.tsx`). Both servers must be running for full functionality.
- If you have issues starting the backend on Windows, use `npm start` (preferred) — the `dev` script uses a POSIX env assignment which may not work directly in PowerShell.
- If the backend fails to start, check `server/data.db` permissions and the console logs in the backend terminal.

If you'd like, I can add a short `README` run snippet or start both servers for you and debug any errors — tell me which you prefer.
