# Deploy SecureChat to Railway.com

## Why Railway?
✅ Full-stack deployment in one place
✅ Automatic HTTPS & domain
✅ Built-in MongoDB
✅ WebSocket support
✅ No Blueprint configuration issues

## Quick Deploy Steps

### 1. Push to GitHub (if not already)
```bash
git push origin main
```

### 2. Deploy on Railway

**Go to: https://railway.app**

1. **Sign up** with GitHub
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `rohandawg/secure--whisper`

### 3. Add MongoDB

1. In your Railway project, click **"+ New"**
2. Select **"Database"**
3. Choose **"MongoDB"**
4. Railway auto-creates the database

### 4. Configure Environment Variables

#### For Backend Service:
1. Click on the backend service
2. Go to **Variables** tab
3. Add these variables:
   ```
   JWT_SECRET=<generate-random-string>
   ENCRYPTION_KEY=<generate-32-byte-string>
   PORT=4000
   MONGODB_URI=<from-mongodb-service-connect-url>
   ```
4. Click **"Connect"** link next to MongoDB to get MONGODB_URI

#### For Frontend Service:
1. Click on the frontend service
2. Go to **Variables** tab
3. Add:
   ```
   VITE_API_URL=<your-backend-url>
   ```
   (Get backend URL from railway dashboard after deployment)

### 5. Generate Secrets

For JWT_SECRET: Use a secure random string (minimum 32 characters)
For ENCRYPTION_KEY: Must be exactly 32 bytes

Example (PowerShell):
```powershell
# Generate JWT_SECRET
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 40 | ForEach-Object {[char]$_})

# Generate ENCRYPTION_KEY (32 characters)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Or use: https://randomkeygen.com

### 6. Deploy

Railway will automatically:
- Detect both services
- Install dependencies
- Build the frontend
- Start both services
- Assign URLs

### 7. Access Your App

After deployment, get URLs from Railway dashboard:
- **Frontend**: `https://securechat-frontend-production.up.railway.app`
- **Backend**: `https://securechat-backend-production.up.railway.app`

## Troubleshooting

### Services Not Detected?
Railway uses the `railway.toml` file to configure services. This file is included.

### Build Fails?
- Check build logs in Railway
- Ensure all dependencies in package.json
- Verify build commands are correct

### WebSocket Not Working?
- Railway fully supports WebSockets
- Check that WebSocket URL uses `wss://` protocol
- Verify frontend is connecting to correct backend URL

## Railway Pricing

- **Free Tier**: $5 free credit monthly
- **Starter**: $20/month
- **Pro**: $100/month

Perfect for testing and small projects!

