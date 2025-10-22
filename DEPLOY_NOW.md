# 🚀 ONE-CLICK DEPLOYMENT GUIDE

## 📋 What You'll Deploy

✅ **Frontend** (React) → Vercel  
✅ **Backend** (Spring Boot) → Railway  
✅ **Database** (MySQL) → Railway  

**Total Time:** 15-20 minutes  
**Cost:** FREE (using free tiers)

---

## 🎯 STEP-BY-STEP DEPLOYMENT

### PART 1: Push to GitHub (5 minutes)

#### 1. Open PowerShell in `d:\CHATBOT`

```powershell
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: IARE CampusConnect Chatbot"
```

#### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `iare-campusconnect`
3. Description: `AI Chatbot for IARE College`
4. Choose: **Private**
5. **DON'T** check "Add README"
6. Click **Create Repository**

#### 3. Push to GitHub

```powershell
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/iare-campusconnect.git

# Push
git branch -M main
git push -u origin main
```

✅ **Checkpoint:** Your code is now on GitHub!

---

### PART 2: Deploy Backend + Database on Railway (7 minutes)

#### 1. Sign Up for Railway

1. Go to https://railway.app
2. Click **"Login with GitHub"**
3. Authorize Railway to access your GitHub

#### 2. Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **`iare-campusconnect`** repository
4. Click **"Deploy Now"**

#### 3. Add MySQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"Add MySQL"**
3. Railway will create a MySQL database
4. Wait for it to deploy (30 seconds)

#### 4. Configure Backend Service

1. Click on your **backend service** (the one that was auto-created)
2. Go to **"Settings"** tab
3. Scroll to **"Root Directory"**
4. Set to: `backend`
5. Click **"Save"**

#### 5. Set Environment Variables

1. Click on **backend service** → **"Variables"** tab
2. Click **"+ New Variable"** and add these:

```bash
# Database Connection (Railway auto-fills these)
SPRING_DATASOURCE_URL=jdbc:mysql://${{MySQL.MYSQL_PRIVATE_URL}}/${{MySQL.MYSQL_DATABASE}}
SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQL_USER}}
SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQL_PASSWORD}}

# JWT Secret (generate a random 256-bit key)
JWT_SECRET=your-super-secret-jwt-key-min-256-bits-change-this-now

# Groq API Key (get from https://console.groq.com)
GROQ_API_KEY=gsk_your_groq_api_key_here

# Server Port
SERVER_PORT=8080
```

**To get Groq API Key:**
- Go to https://console.groq.com
- Sign up (free)
- Go to API Keys
- Create new key
- Copy and paste above

#### 6. Deploy Backend

1. Click **"Deploy"** button
2. Wait 2-3 minutes for build
3. Check **"Deployments"** tab for status
4. Once deployed, click **"Settings"** → **"Networking"**
5. Click **"Generate Domain"**
6. **Copy your backend URL** (e.g., `https://your-app.railway.app`)

✅ **Checkpoint:** Backend is live! Test it: `https://your-app.railway.app/api/auth/test`

---

### PART 3: Deploy Frontend on Vercel (5 minutes)

#### 1. Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

#### 2. Import Project

1. Click **"Add New..."** → **"Project"**
2. Find **`iare-campusconnect`** repository
3. Click **"Import"**

#### 3. Configure Build Settings

1. **Framework Preset:** Vite
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Install Command:** `npm install`

#### 4. Set Environment Variable

1. Click **"Environment Variables"**
2. Add variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.railway.app/api` (use your Railway URL from Part 2)
3. Click **"Add"**

#### 5. Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Once done, you'll get a URL like: `https://iare-campusconnect.vercel.app`

✅ **Checkpoint:** Frontend is live!

---

### PART 4: Update CORS Settings (2 minutes)

Your backend needs to allow requests from your Vercel frontend.

#### Option A: Update via Railway Dashboard

1. Go to Railway → Your Backend Service → **Variables**
2. Add new variable:
   - **Key:** `CORS_ALLOWED_ORIGINS`
   - **Value:** `https://your-app.vercel.app,http://localhost:5173`
3. Redeploy backend

#### Option B: Update Code (Recommended)

1. Open `backend/src/main/java/com/campusconnect/config/SecurityConfig.java`
2. Find the `corsConfigurationSource()` method
3. Update allowed origins:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "http://localhost:5173",
    "https://your-app.vercel.app"  // Add your Vercel URL
));
```

4. Commit and push:
```powershell
git add .
git commit -m "Update CORS for production"
git push
```

Railway will auto-redeploy!

---

## 🎉 YOU'RE LIVE!

### Your Live URLs:

- **Frontend:** `https://your-app.vercel.app`
- **Backend API:** `https://your-app.railway.app/api`
- **Database:** Managed by Railway

### Test Your Deployment:

1. Visit your Vercel URL
2. Click **"Sign Up"**
3. Create an account
4. Start chatting about IARE!

---

## 📊 Import Database Data (Optional)

If you have existing data in your local MySQL:

### 1. Export from Local MySQL

Using phpMyAdmin:
1. Select `campusconnect_db` database
2. Click **"Export"** tab
3. Choose **"Quick"** export
4. Format: **SQL**
5. Click **"Go"**
6. Save the `.sql` file

### 2. Import to Railway MySQL

1. Go to Railway → MySQL Database
2. Click **"Data"** tab
3. Click **"Connect"**
4. Use the provided credentials with MySQL client:

```bash
mysql -h your-railway-host -u root -p your-database < campusconnect_backup.sql
```

Or use a GUI tool like MySQL Workbench with Railway credentials.

---

## 🔄 Auto-Deployment Setup

Now whenever you push to GitHub:

```powershell
git add .
git commit -m "Your changes"
git push
```

- ✅ Railway auto-deploys backend
- ✅ Vercel auto-deploys frontend
- ✅ Changes go live in 2-3 minutes!

---

## 🆘 Troubleshooting

### Backend won't start on Railway

**Check logs:**
1. Railway → Backend Service → **"Deployments"**
2. Click latest deployment → **"View Logs"**

**Common issues:**
- Missing environment variables
- Database connection failed
- Build errors

**Fix:**
- Verify all environment variables are set
- Check MySQL is running
- Review build logs

### Frontend can't connect to backend

**Check:**
1. VITE_API_URL is correct in Vercel
2. CORS is configured in backend
3. Backend is running (visit backend URL)

**Fix:**
1. Vercel → Project → **"Settings"** → **"Environment Variables"**
2. Update `VITE_API_URL`
3. Redeploy frontend

### Database connection errors

**Check:**
1. Railway → MySQL → **"Variables"**
2. Verify connection string
3. Check database is running

**Fix:**
- Restart MySQL service
- Verify credentials
- Check network settings

---

## 📈 Monitor Your Deployment

### Railway Dashboard:
- View logs
- Check resource usage
- Monitor database

### Vercel Dashboard:
- View deployment logs
- Check analytics
- Monitor performance

---

## 💰 Cost Breakdown

### Free Tier Limits:

**Railway:**
- $5 free credit/month
- 500 hours execution
- 1GB RAM
- 1GB storage
- **Perfect for student projects!**

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Custom domains
- **Completely free for personal projects!**

### When You Exceed Free Tier:

- Railway: ~$5-10/month
- Vercel: Still free for most use cases

---

## 🎯 Next Steps

1. ✅ Share your live URL with IARE students
2. ✅ Add custom domain (optional)
3. ✅ Monitor usage and performance
4. ✅ Keep updating with new features

---

## 🔐 Security Checklist

Before going live:

- [x] Environment variables set (not hardcoded)
- [x] CORS configured properly
- [x] HTTPS enabled (automatic on Vercel/Railway)
- [x] Database password is strong
- [x] JWT secret is secure
- [x] API keys are not exposed

---

## 📞 Support

**Railway Issues:**
- https://railway.app/help

**Vercel Issues:**
- https://vercel.com/support

**GitHub Issues:**
- https://github.com/YOUR_USERNAME/iare-campusconnect/issues

---

## 🎊 Congratulations!

Your IARE CampusConnect chatbot is now **LIVE** and accessible to students worldwide! 🌍

**Share your URL and help IARE students get instant answers!** 🚀
