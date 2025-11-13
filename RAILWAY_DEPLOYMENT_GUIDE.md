# 🚂 Complete Railway Deployment Guide for SecureChat

This is a **step-by-step guide** for deploying your SecureChat application to Railway. Perfect for first-time deployment!

## 📋 What You'll Need

1. A **GitHub account** (free)
2. A **Railway account** (free tier with $5 credit/month)
3. Your code pushed to GitHub
4. About 15-20 minutes

---

## Step 1: Push Your Code to GitHub

If you haven't already, you need to get your code on GitHub:

### 1.1 Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right → **"New repository"**
3. Name it (e.g., `secure-whisper`)
4. Choose **Public** or **Private**
5. **Don't** initialize with README (you already have one)
6. Click **"Create repository"**

### 1.2 Push Your Code

Open PowerShell in your project folder and run:

```powershell
# If you haven't initialized git yet:
git init

# Add all files
git add .

# Commit your code
git commit -m "Initial commit"

# Add your GitHub repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Note:** If you get authentication errors, GitHub now requires a Personal Access Token instead of passwords. You can create one at: Settings → Developer settings → Personal access tokens → Tokens (classic)

---

## Step 2: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login"**
3. Sign up with your **GitHub account** (recommended - makes deployment easier)
4. Authorize Railway to access your GitHub repositories

---

## Step 3: Create a New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository (`secure-whisper` or whatever you named it)
4. Railway will create a new project and start detecting your services

---

## Step 4: Add MongoDB Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"Add MongoDB"**
4. Railway will automatically create and configure MongoDB
5. **Important:** Note the database name - it will be something like `railway` or `mingleup`

The MongoDB connection string will be automatically available as an environment variable.

---

## Step 5: Deploy the Backend

### 5.1 Create Backend Service

1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"** (or **"Empty Service"** if you want to configure manually)
3. If using GitHub Repo, select your repository again
4. Railway will auto-detect it as a Node.js service

### 5.2 Configure Backend Settings

1. Click on your backend service
2. Go to **"Settings"** tab
3. Configure the following:

   **Root Directory:**
   - Set to: `server`

   **Build Command:**
   - Leave empty (Railway auto-detects `npm install`)

   **Start Command:**
   - Set to: `npm start`

   **Watch Paths:**
   - Leave default (Railway watches the root directory)

### 5.3 Set Backend Environment Variables

1. Still in the backend service, go to **"Variables"** tab
2. Click **"New Variable"** and add each of these:

   **JWT_SECRET:**
   - Generate a secure random string
   - You can use: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   - Or run: `cd server && node generate-keys.js`

   **ENCRYPTION_KEY:**
   - Must be exactly 32 bytes
   - Generate using: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   - Or run: `cd server && node generate-keys.js`

   **PORT:**
   - Railway automatically sets this, but you can add: `PORT` = `4000` (optional)

   **MONGODB_URI:**
   - Railway automatically provides this!
   - Click **"Add Reference"** → Select your MongoDB service → Choose `MONGO_URL` or `DATABASE_URL`
   - Railway will automatically inject the connection string

### 5.4 Generate Keys (If Needed)

If you need to generate keys, run this in PowerShell:

```powershell
cd server
node generate-keys.js
```

Copy the generated values to your Railway environment variables.

### 5.5 Deploy Backend

1. Railway will automatically start deploying when you push to GitHub
2. Or click **"Deploy"** in the service
3. Wait for deployment to complete (2-5 minutes)
4. Once deployed, Railway will show you a URL like: `https://securechat-backend-production.up.railway.app`
5. **Copy this URL** - you'll need it for the frontend!

### 5.6 Test Backend

1. Click on your backend service
2. Go to **"Settings"** → **"Domains"**
3. Copy the Railway-provided domain
4. Test in browser: `https://your-backend-url.railway.app/api/health`
5. You should see: `{"ok": true}`

---

## Step 6: Deploy the Frontend

### 6.1 Create Frontend Service

1. In your Railway project, click **"+ New"**
2. Select **"GitHub Repo"**
3. Select your repository again
4. Railway will create a new service

### 6.2 Configure Frontend Settings

1. Click on your frontend service
2. Go to **"Settings"** tab
3. Configure:

   **Root Directory:**
   - Leave as `.` (root) or set to: `/` (frontend is in root)

   **Build Command:**
   - Set to: `npm install && npm run build`

   **Start Command:**
   - Set to: `npx serve -s dist -l $PORT`
   - Railway automatically sets `$PORT`, but you can also use: `npx serve -s dist -l 10000`

   **Watch Paths:**
   - Leave default

### 6.3 Set Frontend Environment Variables

1. Go to **"Variables"** tab in your frontend service
2. Click **"New Variable"**

   **VITE_API_URL:**
   - Value: Your backend URL from Step 5.5
   - Format: `https://securechat-backend-production.up.railway.app`
   - **Important:** Use `https://` (not `http://`)

### 6.4 Deploy Frontend

1. Railway will automatically deploy when you push changes
2. Or trigger a manual deploy
3. Wait for deployment (3-5 minutes for first build)
4. Once deployed, Railway will provide a URL

### 6.5 Get Frontend URL

1. Click on your frontend service
2. Go to **"Settings"** → **"Domains"**
3. Railway provides a domain like: `https://securechat-frontend-production.up.railway.app`
4. **This is your app URL!** 🎉

---

## Step 7: Test Your Deployment

### 7.1 Test Backend

1. Open: `https://your-backend-url.railway.app/api/health`
2. Should return: `{"ok": true}`

### 7.2 Test Frontend

1. Open your frontend URL in a browser
2. You should see your SecureChat app
3. Try registering a new account
4. Try logging in

### 7.3 Test Real-Time Features

1. Open your app in two different browser windows (or incognito mode)
2. Create two accounts
3. Add one as a friend to the other
4. Send a message - it should appear in real-time!

---

## Step 8: Custom Domain (Optional)

Want to use your own domain?

1. Click on your service (frontend or backend)
2. Go to **"Settings"** → **"Domains"**
3. Click **"Custom Domain"**
4. Enter your domain
5. Follow Railway's DNS instructions
6. Railway provides free SSL certificates automatically!

---

## Step 9: Troubleshooting

### ❌ Frontend shows "Cannot connect to API"

**Solution:**
- Check that `VITE_API_URL` is set correctly in frontend environment variables
- Make sure it starts with `https://` (not `http://`)
- Verify your backend URL is correct (check backend service → Settings → Domains)
- Redeploy the frontend after changing the variable

### ❌ Backend shows "MongoDB connection error"

**Solution:**
- Check that `MONGODB_URI` is set in backend environment variables
- Verify the MongoDB service is running (should show "Active")
- The connection string should be auto-set via Railway's variable reference
- Check the variable name - Railway might use `MONGO_URL` or `DATABASE_URL`

### ❌ Build fails

**Solution:**
- Check build logs in Railway dashboard (click on service → "Deployments" → View logs)
- Make sure all dependencies are in `package.json`
- Verify Node.js version (Railway uses Node 18+ by default)
- Check that Root Directory is set correctly (`server` for backend, `.` for frontend)

### ❌ WebSocket connection fails

**Solution:**
- Make sure you're using `https://` URLs (Railway provides SSL automatically)
- WebSockets should automatically use `wss://` (secure WebSocket)
- Check browser console for specific error messages
- Verify backend is running and accessible

### ❌ Service keeps restarting

**Solution:**
- Check the **"Deployments"** tab → Click on latest deployment → View logs
- Look for error messages
- Common issues:
  - Missing environment variables
  - Port conflicts (Railway sets PORT automatically)
  - Build errors

### ❌ "Service not found" or 404 errors

**Solution:**
- Verify your service is deployed (check "Deployments" tab)
- Make sure the service shows "Active" status
- Check that you're using the correct Railway-provided domain
- Try redeploying the service

---

## Step 10: Railway-Specific Tips

### Automatic Deployments

- Railway automatically deploys when you push to GitHub (if connected)
- You can disable this in Settings → Source → Auto Deploy

### Environment Variables

- Railway automatically provides `PORT` - your app should use `process.env.PORT`
- Database connection strings are auto-provided when you reference them
- You can use Railway's variable reference feature to link services

### Monitoring

- Check **"Metrics"** tab to see CPU, Memory, and Network usage
- View **"Logs"** in real-time
- Check **"Deployments"** for deployment history

### Free Tier Limits

- $5 credit per month (free)
- Services may sleep after inactivity (but wake up on first request)
- Build minutes are included in the credit
- For production, consider upgrading to paid plan

---

## 📝 Quick Reference

### Your Service URLs

After deployment, you'll have:
- **Backend:** `https://your-backend-name-production.up.railway.app`
- **Frontend:** `https://your-frontend-name-production.up.railway.app`
- **Database:** Managed automatically (connection string in environment variables)

### Environment Variables Summary

**Backend Service:**
- `JWT_SECRET` - Random secret for authentication (generate with `node generate-keys.js`)
- `ENCRYPTION_KEY` - 32-byte key for message encryption (generate with `node generate-keys.js`)
- `PORT` - Auto-set by Railway (your code uses `process.env.PORT`)
- `MONGODB_URI` or `MONGO_URL` - Auto-provided by Railway (reference from MongoDB service)

**Frontend Service:**
- `VITE_API_URL` - Your backend URL (set manually: `https://your-backend-url.railway.app`)

### Railway Project Structure

Your Railway project should have:
```
Your Project
├── MongoDB Database (service)
├── Backend Service (server/)
└── Frontend Service (root/)
```

---

## 🎉 You're Done!

Your app should now be live on Railway! Share your frontend URL with others to test it out.

### Next Steps

- ✅ Monitor your services in Railway dashboard
- ✅ Check logs if something isn't working
- ✅ Set up custom domains if needed
- ✅ Consider upgrading if you need more resources
- ✅ Enable automatic deployments from GitHub

### Railway Advantages

- ✅ Simple, intuitive interface
- ✅ Automatic SSL certificates
- ✅ Easy environment variable management
- ✅ One-click database setup
- ✅ Great free tier to start
- ✅ Excellent documentation

---

## 🆘 Need Help?

1. Check Railway's [documentation](https://docs.railway.app)
2. Check your service logs in Railway dashboard
3. Verify all environment variables are set correctly
4. Make sure your code is pushed to GitHub
5. Check Railway's [Discord community](https://discord.gg/railway) for help

---

## 🔒 Security Reminders

- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Use strong, randomly generated secrets in production
- ✅ Your `ENCRYPTION_KEY` must be exactly 32 bytes
- ✅ HTTPS is automatically enabled by Railway
- ✅ Railway provides secure environment variable storage

Good luck with your deployment! 🚂🚀

