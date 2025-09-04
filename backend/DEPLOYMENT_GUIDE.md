# 🚀 DevTinder Backend - Render.com Deployment Guide

## 📋 Prerequisites

- ✅ Backend working locally
- ✅ MongoDB Atlas database ready
- ✅ Render.com account
- ✅ Git repository (optional but recommended)

## 🔧 Step 1: Prepare Your Backend

### 1.1 Verify Backend Structure
```
backend/
├── .env                    # Local environment
├── .env.production        # Production environment
├── package.json           # Dependencies
├── src/                   # Source code
│   ├── start.js          # Server entry point
│   ├── app.js            # Express app
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   └── middlewares/      # Auth middleware
└── uploads/              # Photo uploads
```

### 1.2 Update Environment Variables
**IMPORTANT**: Change these values before deployment!

```bash
# .env.production
JWT_SECRET=YOUR_SUPER_SECURE_RANDOM_STRING_HERE
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

## 🌐 Step 2: Deploy to Render.com

### 2.1 Create New Web Service

1. **Go to [Render.com](https://render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your repository** (GitHub, GitLab, etc.)
4. **Or use "Deploy from existing code"**

### 2.2 Service Configuration

**Basic Settings:**
- **Name**: `devtinder-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` or `master`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `backend` (if deploying from root repo)

### 2.3 Environment Variables

**Add these in Render Dashboard:**

| Key | Value | Description |
|-----|--------|-------------|
| `JWT_SECRET` | `your_super_secure_jwt_secret` | Random string for JWT signing |
| `MONGODB_URI` | `mongodb+srv://...` | Your MongoDB connection string |
| `PORT` | `10000` | Render will set this automatically |
| `NODE_ENV` | `production` | Production environment |
| `FRONTEND_URL` | `https://yourdomain.com` | Your frontend URL |

### 2.4 Advanced Settings

**Health Check Path**: `/health`
**Auto-Deploy**: Enable for automatic updates

## 🔐 Step 3: Security Configuration

### 3.1 JWT Secret
**Generate a secure JWT secret:**
```bash
# In terminal
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3.2 MongoDB Atlas
1. **Whitelist Render IPs** in MongoDB Atlas
2. **Use strong password** for database user
3. **Enable network access** for your application

### 3.3 CORS Configuration
Update `FRONTEND_URL` with your actual frontend domain

## 📱 Step 4: Test Deployment

### 4.1 Health Check
```bash
curl https://your-app-name.onrender.com/health
```

### 4.2 API Test
```bash
# Test login endpoint
curl -X POST https://your-app-name.onrender.com/login \
  -H "Content-Type: application/json" \
  -d '{"emailId":"test@example.com","password":"test123"}'
```

## 🚨 Common Issues & Solutions

### Issue 1: Build Fails
**Solution**: Check `package.json` has correct scripts
```json
{
  "scripts": {
    "start": "node src/start.js"
  }
}
```

### Issue 2: Port Error
**Solution**: Use `process.env.PORT` in your code
```javascript
const PORT = process.env.PORT || 3001;
```

### Issue 3: Database Connection Fails
**Solution**: 
1. Check MongoDB URI format
2. Verify credentials
3. Whitelist Render IPs in Atlas

### Issue 4: CORS Errors
**Solution**: Update `FRONTEND_URL` environment variable

## 🔄 Step 5: Continuous Deployment

### 5.1 Auto-Deploy
- Enable auto-deploy in Render
- Push to main branch triggers deployment

### 5.2 Manual Deploy
- Use "Manual Deploy" button in Render dashboard
- Useful for testing before auto-deploy

## 📊 Step 6: Monitoring

### 6.1 Logs
- View real-time logs in Render dashboard
- Monitor for errors and performance

### 6.2 Metrics
- Track response times
- Monitor resource usage

## 🎯 Final Checklist

- [ ] Backend works locally
- [ ] Environment variables set in Render
- [ ] MongoDB Atlas configured
- [ ] JWT secret updated
- [ ] CORS URL updated
- [ ] Health check passes
- [ ] API endpoints working
- [ ] Frontend can connect

## 🆘 Support

If you encounter issues:
1. Check Render logs
2. Verify environment variables
3. Test database connection
4. Check CORS configuration

**Your backend should now be successfully deployed on Render.com!** 🎉
