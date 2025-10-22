# CampusConnect – AI-Powered College Enquiry Chatbot for IARE

## 🎓 Overview
CampusConnect is an AI-powered chatbot specifically designed for **IARE (Institute of Aeronautical Engineering), Hyderabad**. It provides instant, accurate answers about IARE's admissions, courses, fees, placements, campus facilities, and more using the Groq AI API.

## 🧩 Tech Stack
- **Frontend**: React + TailwindCSS + Framer Motion
- **Backend**: Spring Boot (Java, Maven)
- **Database**: MySQL (via XAMPP)
- **Authentication**: JWT + Refresh Tokens
- **AI**: Groq API
- **Charts**: Recharts
- **Email**: Gmail SMTP

## 📁 Project Structure
```
CampusConnect/
├── frontend/          # React application
├── backend/           # Spring Boot application
├── database/          # MySQL schema and seed data
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 17+
- Maven 3.8+
- XAMPP (MySQL)
- Groq API Key (free trial)
- Gmail account for SMTP

### 1. Database Setup
1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Import `database/schema.sql`
4. Import `database/seed_data.sql`

### 2. Backend Setup
```bash
cd backend
# Update application.properties with your database credentials
mvn clean install
mvn spring-boot:run
```
Backend will run on http://localhost:8080

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on http://localhost:5173

### 4. Environment Configuration

#### Backend (backend/src/main/resources/application.properties)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/campusconnect
spring.datasource.username=root
spring.datasource.password=

# JWT
jwt.secret=your-secret-key-here-min-256-bits
jwt.expiration=86400000
jwt.refresh.expiration=604800000

# Groq API
groq.api.key=your-groq-api-key
groq.api.url=https://api.groq.com/openai/v1/chat/completions
groq.model=mixtral-8x7b-32768

# Email
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📚 Features

### Student Features
- 🤖 AI-powered chatbot with natural language understanding
- 💬 Multi-turn conversation with context retention
- 📊 Personal dashboard with query history
- 🔍 Smart search and filtering
- 🌓 Dark/Light mode
- 📱 Fully responsive design
- 🎤 Voice-to-text input
- 📁 File upload for contextual queries

### Admin Features
- 📈 Analytics dashboard with charts
- 👥 User management
- 💡 FAQ management
- 🎓 Course and department management
- 🎯 Query categorization and insights
- 📧 Support ticket system
- 📊 Export reports (CSV)
- ⚙️ System configuration

## 🔒 Security Features
- JWT-based authentication
- Refresh token rotation
- Password encryption (BCrypt)
- CORS protection
- SQL injection prevention
- XSS protection
- GDPR compliance (data export/delete)

## 📖 API Documentation
Once the backend is running, access Swagger UI at:
http://localhost:8080/swagger-ui.html

## 🎨 Design System
- **Primary Color**: Customizable (default: Blue)
- **Font**: Inter
- **Spacing**: 4px base unit
- **Border Radius**: 2xl (16px)
- **Shadows**: Soft, layered
- **Animations**: Smooth, 200-300ms transitions

## 🧪 Testing
```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
```

## 📦 Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
mvn clean package
java -jar target/campusconnect-0.0.1-SNAPSHOT.jar
```

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure XAMPP MySQL is running
- Check database credentials in application.properties
- Verify database name is 'campusconnect'

### Groq API Errors
- Verify API key is valid
- Check API rate limits
- Ensure internet connectivity

### CORS Errors
- Update CORS configuration in SecurityConfig.java
- Verify frontend URL matches allowed origins

## 📄 License
MIT License - Educational Project

## 👥 Support
For issues and questions, contact your college IT support team.

---
Built with ❤️ for modern college campuses
