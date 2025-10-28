# Deploy SecureChat to Render.com - Step by Step

## Quick Deploy (Easiest Method)

### 1. Push to GitHub (if not already)

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Render

#### Step 1: Create Render Account
- Go to https://render.com
- Sign up with GitHub
- Complete verification

#### Step 2: Create New Blueprint
1. Click **"New +"** button in dashboard
2. Select **"Blueprint"**
3. Click **"Connect GitHub account"** if not connected
4. Search and select your repository
5. Render will automatically detect `render.yaml`

#### Step 3: Review Configuration
Render will show:
- ✅ Backend Service (securechat-backend)
- ✅ Frontend Service (securechat-frontend) 
- ✅ MongoDB Database (securechat-db)

Click **"Apply"** to create all services

#### Step 4: Wait for Deployment
- Backend deploys first (~3-5 minutes)
- Database creates automatically
- Frontend deploys last (~2-3 minutes)
- Total time: ~5-8 minutes

### 3. Access Your App

After deployment:
- **Frontend URL**: `https://securechat-frontend.onrender.com`
- **Backend URL**: `https://securechat-backend.onrender.com`

## Manual Deployment (Alternative)

If Blueprint doesn't work, deploy services manually:

### Backend Service
1. **New** → **Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Name**: `securechat-backend`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: `Node`
4. **Environment Variables**:
   - `JWT_SECRET`: (auto-generated)
   - `ENCRYPTION_KEY`: (auto-generated)
   - `PORT`: `4000`
5. **Add Database** → Create MongoDB
   - Name: `securechat-db`
6. Add env var:
   - `MONGODB_URI`: (from MongoDB connection string)

### Frontend Service
1. **New** → **Static Site** (or Web Service)
2. Connect your GitHub repo
3. Settings:
   - **Name**: `securechat-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: `https://securechat-backend.onrender.com`

## Environment Variables Setup

### Backend (`server/index.js`)
These are auto-configured by `render.yaml`:
- `JWT_SECRET` - Auto-generated
- `ENCRYPTION_KEY` - Auto-generated  
- `PORT` - Set to 4000
- `MONGODB_URI` - From database connection

### Frontend
Set in Render dashboard:
- `VITE_API_URL` - Your backend URL

## Post-Deployment Checklist

✅ Backend health check works: `https://your-backend.onrender.com/api/health`
✅ Frontend loads without errors
✅ User can register/login
✅ WebSocket connections work (check browser console)
✅ Messages send and receive in real-time

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Verify Node version (needs 18+)
- Check npm install succeeds

### Backend Not Connecting
- Verify MONGODB_URI is set correctly
- Check MongoDB is running (free tier might spin down)
- Check backend logs for connection errors

### Frontend CORS Issues
- Backend CORS is already configured
- Verify VITE_API_URL points to correct backend
- Check network tab in browser DevTools

### WebSocket Not Working
- Render free tier supports WebSockets
- Check browser console for connection errors
- Verify WS URL uses `wss://` (secure)

### Port Issues
- Backend uses PORT env variable (auto-set by Render)
- Don't hardcode port numbers

## Free Tier Limitations

⚠️ **Important for Free Tier**:
- Services spin down after 15 minutes of inactivity
- Takes ~30 seconds to wake up
- WebSocket connections reset on spin-down
- Consider upgrading for production use

## Next Steps After Deployment

1. Test all features:
   - User registration
   - Login
   - Add friends
   - Send messages
   - Real-time updates
   - Clear chat

2. Optional improvements:
   - Add custom domain
   - Set up monitoring
   - Configure auto-scaling
   - Add error tracking

3. Share your app:
   - Deploy URL: `https://securechat-frontend.onrender.com`
   - Test with friends
   - Get feedback

## Support

- Render Dashboard: https://dashboard.render.com
- Render Docs: https://render.com/docs
- Check logs in Render dashboard for errors

