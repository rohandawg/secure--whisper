# 🚀 Complete Deployment Guide for SecureChat

This is a **step-by-step guide** for deploying your SecureChat application to Render.com. Perfect for first-time deployment!

## 📋 What You'll Need

1. A **GitHub account** (free)
2. A **Render.com account** (free tier available)
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

## Step 2: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account (recommended) or email
4. Verify your email if needed

---

## Step 3: Deploy Using Blueprint (Easiest Method)

This method uses your `render.yaml` file to automatically set up everything!

### 3.1 Create a New Blueprint

1. In Render dashboard, click **"New +"** → **"Blueprint"**
2. Connect your GitHub account if you haven't already
3. Select your repository (`secure-whisper` or whatever you named it)
4. Click **"Apply"**

Render will automatically:
- ✅ Create a MongoDB database
- ✅ Create a backend web service
- ✅ Create a frontend web service
- ✅ Set up most environment variables

### 3.2 Wait for Initial Deployment

This takes about 5-10 minutes. You'll see:
- 🔵 Building... (yellow)
- 🟢 Live (green) when done

**Important:** The first deployment might fail because the frontend needs the backend URL. That's okay - we'll fix it next!

---

## Step 4: Configure Environment Variables

After the initial deployment, you need to set the frontend API URL.

### 4.1 Find Your Backend URL

1. In Render dashboard, click on **"securechat-backend"** service
2. Look at the top - you'll see a URL like: `https://securechat-backend-xxxx.onrender.com`
3. **Copy this URL** - you'll need it!

### 4.2 Set Frontend Environment Variable

1. In Render dashboard, click on **"securechat-frontend"** service
2. Go to **"Environment"** tab (left sidebar)
3. Click **"Add Environment Variable"**
4. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://securechat-backend-xxxx.onrender.com` (use your actual backend URL)
5. Click **"Save Changes"**
6. Render will automatically redeploy

### 4.3 Verify Backend Environment Variables

Check that your backend has these variables set (they should be auto-generated):

1. Click on **"securechat-backend"** service
2. Go to **"Environment"** tab
3. Verify you have:
   - ✅ `JWT_SECRET` (auto-generated)
   - ✅ `ENCRYPTION_KEY` (auto-generated)
   - ✅ `PORT` = `4000`
   - ✅ `MONGODB_URI` (auto-connected from database)

If any are missing, add them manually.

---

## Step 5: Generate Encryption Key (If Needed)

If `ENCRYPTION_KEY` wasn't auto-generated, you need a 32-byte key. Here's how:

### Option A: Using Node.js (PowerShell)

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use it as your `ENCRYPTION_KEY`.

### Option B: Using Online Generator

1. Go to [randomkeygen.com](https://randomkeygen.com)
2. Use a "CodeIgniter Encryption Keys" - copy a 32-character key
3. If it's shorter than 32 characters, pad it with characters to make it exactly 32 bytes

**Important:** The key must be exactly 32 bytes (32 characters for simple ASCII).

---

## Step 6: Test Your Deployment

### 6.1 Check Backend Health

1. Open your backend URL in a browser: `https://securechat-backend-xxxx.onrender.com/api/health`
2. You should see: `{"ok": true}`

### 6.2 Check Frontend

1. Open your frontend URL (from the frontend service page)
2. You should see your app loading
3. Try registering a new account
4. Try logging in

### 6.3 Test Real-Time Features

1. Open your app in two different browser windows (or incognito mode)
2. Create two accounts
3. Add one as a friend to the other
4. Send a message - it should appear in real-time!

---

## Step 7: Troubleshooting

### ❌ Frontend shows "Cannot connect to API"

**Solution:**
- Check that `VITE_API_URL` is set correctly in frontend environment variables
- Make sure it starts with `https://` (not `http://`)
- Redeploy the frontend after changing the variable

### ❌ Backend shows "MongoDB connection error"

**Solution:**
- Check that `MONGODB_URI` is set in backend environment variables
- Verify the database service is running (should show "Available")
- The connection string should be auto-set from the database

### ❌ WebSocket connection fails

**Solution:**
- Make sure you're using `https://` URLs (Render provides SSL automatically)
- WebSockets should automatically use `wss://` (secure WebSocket)
- Check browser console for specific error messages

### ❌ Services keep restarting

**Solution:**
- Check the **"Logs"** tab in Render dashboard
- Look for error messages
- Common issues:
  - Missing environment variables
  - Port conflicts (should be 4000 for backend, 10000 for frontend)
  - Build errors (check build logs)

### ❌ Build fails

**Solution:**
- Check build logs in Render dashboard
- Make sure all dependencies are in `package.json`
- Verify Node.js version (Render uses Node 18+ by default)

---

## Step 8: Custom Domain (Optional)

Want to use your own domain?

1. In Render dashboard, click your service
2. Go to **"Settings"** tab
3. Scroll to **"Custom Domains"**
4. Add your domain
5. Follow Render's DNS instructions

---

## 📝 Quick Reference

### Your Service URLs

After deployment, you'll have:
- **Backend:** `https://securechat-backend-xxxx.onrender.com`
- **Frontend:** `https://securechat-frontend-xxxx.onrender.com`
- **Database:** Managed automatically (no direct access needed)

### Environment Variables Summary

**Backend:**
- `JWT_SECRET` - Random secret for authentication
- `ENCRYPTION_KEY` - 32-byte key for message encryption
- `PORT` - 4000
- `MONGODB_URI` - Auto-set from database

**Frontend:**
- `VITE_API_URL` - Your backend URL (must be set manually)

---

## 🎉 You're Done!

Your app should now be live! Share your frontend URL with others to test it out.

### Next Steps

- ✅ Monitor your services in Render dashboard
- ✅ Check logs if something isn't working
- ✅ Consider upgrading from free tier if you need more resources
- ✅ Set up automatic deployments (enabled by default when connected to GitHub)

### Free Tier Limitations

Render's free tier has some limitations:
- Services spin down after 15 minutes of inactivity (first request will be slow)
- Limited build minutes per month
- For production use, consider upgrading

---

## 🆘 Need Help?

1. Check Render's [documentation](https://render.com/docs)
2. Check your service logs in Render dashboard
3. Verify all environment variables are set correctly
4. Make sure your code is pushed to GitHub

---

## 🔒 Security Reminders

- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Use strong, randomly generated secrets in production
- ✅ Your `ENCRYPTION_KEY` must be exactly 32 bytes
- ✅ HTTPS is automatically enabled by Render

Good luck with your deployment! 🚀

