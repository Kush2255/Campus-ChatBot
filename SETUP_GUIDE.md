# CampusConnect - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Java JDK** (v17 or higher) - [Download](https://www.oracle.com/java/technologies/downloads/)
- **Maven** (v3.8 or higher) - [Download](https://maven.apache.org/download.cgi)
- **XAMPP** (for MySQL) - [Download](https://www.apachefriends.org/)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

## 🗄️ Step 1: Database Setup

### 1.1 Start MySQL Server

1. Open XAMPP Control Panel
2. Click **Start** for Apache and MySQL modules
3. Wait for both to show green status

### 1.2 Create Database

1. Open your browser and go to: `http://localhost/phpmyadmin`
2. Click on **SQL** tab
3. Copy and paste the contents of `database/schema.sql`
4. Click **Go** to execute
5. Then copy and paste the contents of `database/seed_data.sql`
6. Click **Go** to execute

**Default Admin Credentials:**
- Email: `admin@campusconnect.edu`
- Password: `admin123`

**Default User Credentials:**
- Email: `john.doe@example.com`
- Password: `user123`

## 🔑 Step 2: Get Groq API Key

1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy the generated API key (starts with `gsk_`)
6. Save it securely - you'll need it in Step 4

## 📧 Step 3: Configure Gmail SMTP (Optional)

For email functionality, you need a Gmail App Password:

1. Go to your Google Account settings
2. Enable **2-Step Verification**
3. Go to **Security** > **App passwords**
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Save it for Step 4

## ⚙️ Step 4: Backend Configuration

### 4.1 Configure Application Properties

1. Navigate to `backend/src/main/resources/application.properties`
2. Update the following settings:

```properties
# Database Configuration (if different from defaults)
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# JWT Secret (IMPORTANT: Change this in production!)
jwt.secret=your-very-long-secret-key-minimum-256-bits-change-in-production

# Groq API Configuration
groq.api.key=gsk_your_groq_api_key_here

# Email Configuration (Optional)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-16-char-app-password
```

### 4.2 Build and Run Backend

Open terminal in the `backend` directory:

```bash
# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

**Expected Output:**
```
🎓 CampusConnect Backend Started Successfully!
📍 Server running on: http://localhost:8080
```

**Verify Backend:**
Open browser and visit: `http://localhost:8080/api/auth/me` (should show 401 Unauthorized - this is correct)

## 🎨 Step 5: Frontend Setup

### 5.1 Install Dependencies

Open terminal in the `frontend` directory:

```bash
# Install all dependencies
npm install
```

### 5.2 Configure Environment

The `.env` file is already configured with:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

No changes needed unless you modified the backend port.

### 5.3 Run Frontend

```bash
# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## 🚀 Step 6: Access the Application

### Main Application
- **URL:** http://localhost:5173
- **Landing Page:** Beautiful marketing page with features
- **Login:** Click "Login" or "Get Started"

### Test Accounts

**Admin Account:**
- Email: `admin@campusconnect.edu`
- Password: `admin123`
- Access: Full admin panel at `/admin`

**User Account:**
- Email: `john.doe@example.com`
- Password: `user123`
- Access: Student dashboard and chat

### First Time Setup

1. Visit http://localhost:5173
2. Click **Get Started** or **Register**
3. Create a new account
4. Login with your credentials
5. Start chatting with the AI assistant!

## 🧪 Step 7: Test the AI Chatbot

1. Login to the application
2. Navigate to **Chat** page
3. Select a category (e.g., "Admissions")
4. Type a question like: "What are the admission requirements?"
5. The AI should respond with relevant information

**Note:** Make sure your Groq API key is correctly configured in `application.properties`

## 🔧 Troubleshooting

### Backend Issues

**Problem:** Port 8080 already in use
```bash
# Solution: Change port in application.properties
server.port=8081
# Also update frontend .env file
VITE_API_BASE_URL=http://localhost:8081/api
```

**Problem:** Database connection failed
- Ensure MySQL is running in XAMPP
- Check database name is `campusconnect`
- Verify username/password in application.properties

**Problem:** Groq API errors
- Verify API key is correct
- Check internet connection
- Ensure API key has not expired

### Frontend Issues

**Problem:** npm install fails
```bash
# Solution: Clear cache and retry
npm cache clean --force
npm install
```

**Problem:** Cannot connect to backend
- Ensure backend is running on port 8080
- Check CORS settings in SecurityConfig.java
- Verify .env file has correct API URL

**Problem:** White screen after login
- Check browser console for errors
- Clear browser cache
- Ensure all dependencies installed correctly

### Database Issues

**Problem:** Tables not created
- Re-run schema.sql in phpMyAdmin
- Check for SQL errors in phpMyAdmin
- Ensure MySQL version is 5.7+

**Problem:** Cannot login with default credentials
- Re-run seed_data.sql
- Password hash might be incorrect
- Try creating a new account via registration

## 📱 Features to Test

### User Features
- ✅ Registration and Login
- ✅ AI Chat with category selection
- ✅ Chat history and sessions
- ✅ Profile management
- ✅ Dark/Light mode toggle
- ✅ Responsive design (test on mobile)

### Admin Features
- ✅ Dashboard with analytics
- ✅ User management
- ✅ FAQ management
- ✅ System settings
- ✅ Groq API configuration

## 🔒 Security Notes

### For Production Deployment:

1. **Change JWT Secret:**
   - Generate a strong 256-bit secret
   - Update in application.properties

2. **Update Database Credentials:**
   - Use strong password for MySQL
   - Create dedicated database user

3. **Configure CORS:**
   - Update allowed origins in application.properties
   - Restrict to your domain only

4. **Enable HTTPS:**
   - Use SSL certificates
   - Configure Spring Boot for HTTPS

5. **Environment Variables:**
   - Never commit API keys to Git
   - Use environment variables for sensitive data

## 📊 Default Data

The seed data includes:
- 1 Super Admin account
- 3 Sample user accounts
- 20+ FAQs across all categories
- System settings

## 🆘 Getting Help

If you encounter issues:

1. Check the console logs (both frontend and backend)
2. Verify all prerequisites are installed
3. Ensure all configuration files are correct
4. Check the troubleshooting section above

## 🎉 Success Checklist

- [ ] MySQL running in XAMPP
- [ ] Database created with tables
- [ ] Groq API key configured
- [ ] Backend running on port 8080
- [ ] Frontend running on port 5173
- [ ] Can access landing page
- [ ] Can register new account
- [ ] Can login successfully
- [ ] Can chat with AI assistant
- [ ] Admin panel accessible

## 📝 Next Steps

After successful setup:

1. Customize the college information in FAQs
2. Update branding (logo, colors) in frontend
3. Configure email templates
4. Add more sample data
5. Test all features thoroughly
6. Deploy to production server

---

**Congratulations! 🎓 CampusConnect is now running successfully!**

For questions or support, refer to the README.md file.
