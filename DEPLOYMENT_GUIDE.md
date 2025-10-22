# 🚀 CampusConnect Deployment Guide

## 📋 Table of Contents
1. [Database Information](#database-information)
2. [Pushing to GitHub](#pushing-to-github)
3. [Deployment Options](#deployment-options)
4. [Step-by-Step Deployment](#step-by-step-deployment)

---

## 🗄️ Database Information

### What You're Using:
- **Database System**: MySQL 8.0+
- **Management Tool**: phpMyAdmin (web interface)
- **Connection**: Spring Boot connects directly to MySQL via JDBC

### Current Local Setup:
```
MySQL Server (localhost:3306)
├── Database: campusconnect_db
├── Tables: users, chat_sessions, messages, etc.
└── Accessed via: phpMyAdmin (http://localhost/phpmyadmin)
```

**Important**: phpMyAdmin is NOT the database - it's just a tool to view/manage MySQL!

---

## 📤 Pushing to GitHub

### Step 1: Create `.gitignore` File

Create a file named `.gitignore` in the root directory (`d:\CHATBOT\.gitignore`):

```gitignore
# Backend
backend/target/
backend/.mvn/
backend/mvnw
backend/mvnw.cmd
backend/.idea/
backend/*.iml
backend/.settings/
backend/.classpath
backend/.project

# Frontend
frontend/node_modules/
frontend/dist/
frontend/build/
frontend/.vite/

# Environment Files (IMPORTANT - Don't commit secrets!)
backend/src/main/resources/application.properties
frontend/.env
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/
```

### Step 2: Create Environment Template Files

**Backend Template** (`backend/src/main/resources/application.properties.example`):
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/campusconnect_db
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD

# JWT Configuration
jwt.secret=YOUR_JWT_SECRET_KEY_HERE
jwt.expiration=86400000
jwt.refresh.expiration=604800000

# Groq API Configuration
groq.api.key=YOUR_GROQ_API_KEY_HERE
groq.api.url=https://api.groq.com/openai/v1/chat/completions
groq.model=llama-3.3-70b-versatile
groq.temperature=0.7
groq.max.tokens=1024

# Email Configuration (Optional)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
```

**Frontend Template** (`frontend/.env.example`):
```env
VITE_API_URL=http://localhost:8081/api
```

### Step 3: Initialize Git Repository

Open PowerShell in `d:\CHATBOT`:

```powershell
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: CampusConnect AI Chatbot"
```

### Step 4: Create GitHub Repository

1. Go to https://github.com
2. Click "New Repository"
3. Name: `campusconnect-chatbot` (or your choice)
4. Description: "AI-Powered College Enquiry Chatbot for IARE"
5. Choose: **Private** (recommended) or Public
6. **Don't** initialize with README (you already have files)
7. Click "Create Repository"

### Step 5: Push to GitHub

```powershell
# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/campusconnect-chatbot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 6: Verify

- Go to your GitHub repository
- Check that files are uploaded
- **Verify** that `application.properties` and `.env` are NOT visible (they should be ignored)

---

## 🌐 Deployment Options

### Option 1: Railway (Recommended - Easiest)

**Pros:**
- Free tier available
- Includes MySQL database
- Easy deployment
- Auto-deploys from GitHub

**Steps:**
1. Sign up at https://railway.app
2. Create new project
3. Add MySQL database
4. Deploy backend from GitHub
5. Deploy frontend to Vercel/Netlify
6. Update environment variables

### Option 2: Render + PlanetScale

**Backend:** Render (https://render.com)
**Database:** PlanetScale (https://planetscale.com)
**Frontend:** Vercel (https://vercel.com)

### Option 3: Full AWS/Azure (Advanced)

For production-grade deployment with more control.

---

## 📝 Step-by-Step Deployment (Railway + Vercel)

### Part 1: Deploy Database & Backend (Railway)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `campusconnect-chatbot` repository

3. **Add MySQL Database**
   - Click "+ New"
   - Select "Database" → "MySQL"
   - Railway will create a MySQL instance

4. **Configure Backend Service**
   - Click "+ New" → "GitHub Repo"
   - Select your repository
   - Root directory: `/backend`
   - Build command: `mvn clean package -DskipTests`
   - Start command: `java -jar target/campusconnect-backend-1.0.0.jar`

5. **Set Environment Variables**
   Click on backend service → Variables → Add:
   ```
   SPRING_DATASOURCE_URL=jdbc:mysql://${{MySQL.MYSQL_HOST}}:${{MySQL.MYSQL_PORT}}/${{MySQL.MYSQL_DATABASE}}
   SPRING_DATASOURCE_USERNAME=${{MySQL.MYSQL_USER}}
   SPRING_DATASOURCE_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   GROQ_API_KEY=your-groq-api-key
   ```

6. **Deploy**
   - Railway will auto-deploy
   - Get your backend URL (e.g., `https://your-app.railway.app`)

### Part 2: Deploy Frontend (Vercel)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework: Vite
   - Root Directory: `frontend`

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Get your frontend URL (e.g., `https://your-app.vercel.app`)

### Part 3: Update CORS Settings

Update your backend `SecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173",
        "https://your-app.vercel.app"  // Add your Vercel URL
    ));
    // ... rest of config
}
```

Commit and push changes - Railway will auto-deploy!

---

## 🔒 Security Checklist

Before deploying:

- [ ] Remove all hardcoded API keys
- [ ] Use environment variables for secrets
- [ ] Add `.gitignore` to exclude sensitive files
- [ ] Change default JWT secret
- [ ] Enable HTTPS only in production
- [ ] Set strong database passwords
- [ ] Review CORS settings
- [ ] Enable rate limiting (optional)

---

## 📊 Database Migration

### Export from Local MySQL:

```sql
-- Using phpMyAdmin:
1. Select 'campusconnect_db' database
2. Click 'Export' tab
3. Choose 'Quick' export method
4. Format: SQL
5. Click 'Go'

-- Or using command line:
mysqldump -u root -p campusconnect_db > campusconnect_backup.sql
```

### Import to Production (Railway):

1. Get Railway MySQL credentials from dashboard
2. Use Railway's MySQL client or:
```bash
mysql -h your-railway-host -u root -p your-database < campusconnect_backup.sql
```

---

## 🔄 Continuous Deployment

Once set up:

1. Make changes locally
2. Commit: `git add . && git commit -m "Your message"`
3. Push: `git push origin main`
4. Railway & Vercel auto-deploy! ✨

---

## 🆘 Troubleshooting

### Backend won't start:
- Check environment variables
- Verify database connection
- Check Railway logs

### Frontend can't connect:
- Verify VITE_API_URL is correct
- Check CORS settings
- Ensure backend is running

### Database connection failed:
- Check credentials
- Verify database is running
- Check firewall/network settings

---

## 📞 Support

If you need help:
1. Check Railway/Vercel logs
2. Review error messages
3. Check GitHub Issues
4. Contact support on respective platforms

---

## 🎉 Success!

Your app is now live! Share your URL and let students explore IARE! 🚀
