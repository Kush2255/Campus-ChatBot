# 🚀 CampusConnect - Quick Start (5 Minutes)

## Prerequisites Check
- ✅ XAMPP installed
- ✅ Node.js installed
- ✅ Java 17+ installed
- ✅ Maven installed

## Step 1: Database (2 minutes)
1. Start XAMPP → Start MySQL
2. Open http://localhost/phpmyadmin
3. Click "SQL" tab
4. Copy-paste `database/schema.sql` → Click "Go"
5. Copy-paste `database/seed_data.sql` → Click "Go"

## Step 2: Get Groq API Key (1 minute)
1. Visit https://console.groq.com
2. Sign up/Login
3. Create API Key
4. Copy the key (starts with `gsk_`)

## Step 3: Configure Backend (1 minute)
Edit `backend/src/main/resources/application.properties`:
```properties
groq.api.key=YOUR_GROQ_API_KEY_HERE
```

## Step 4: Start Backend (30 seconds)
```bash
cd backend
mvn spring-boot:run
```
Wait for: "CampusConnect Backend Started Successfully!"

## Step 5: Start Frontend (30 seconds)
```bash
cd frontend
npm install
npm run dev
```

## Step 6: Access Application
Open browser: http://localhost:5173

**Login with:**
- Email: `admin@campusconnect.edu`
- Password: `admin123`

## ✅ Done!
Start chatting with the AI assistant!

---

**Need help?** See SETUP_GUIDE.md for detailed instructions.
