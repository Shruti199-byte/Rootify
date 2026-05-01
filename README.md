# 🌱 Rootify — Volunteer & NGO Connection Platform

Rootify is a full-stack web application designed to connect volunteers with NGOs. It enables users to discover organizations, apply for opportunities, communicate in real-time, and track their social impact through a personalized dashboard.



## 🔗 Live Demo

- 🌐 Frontend: https://rootify-frontend.onrender.com  
- ⚙️ Backend API: https://rootify-backend.onrender.com  

---

## ⚠️ Usage Note

Some features such as **Community Feed, Chat, and Dashboard** require authentication.

To explore full functionality:
1. Sign up using the **Sign Up** option  
2. Log in to your account  
3. Access features like chat, applications, and community feed  

> ⏳ Note: Initial loading may take a few seconds as the backend server wakes up (free hosting).



## 💡 Problem Statement

There is no centralized platform where individuals can easily find and engage with NGOs. At the same time, NGOs struggle to reach suitable and committed volunteers.

Rootify addresses this gap by providing a unified platform for NGO discovery, communication, and volunteer engagement.



## 🚀 Features

- 🔐 User Registration & Login (JWT Authentication)
- 👤 User Profile Management
- 🏢 NGO Registration & Listing
- 🔍 NGO Discovery (Search & Filters)
- 📌 Volunteer Opportunities & Applications
- 📰 Community Feed (Posts & Interaction)
- 💬 Real-time Chat using WebSockets
- 📊 Dashboard for tracking applications
- 📁 Basic Volunteer Portfolio Tracking



## 🛠️ Tech Stack

| Layer       | Technology                     |
|------------|--------------------------------|
| Frontend   | React (Vite), Tailwind CSS     |
| Backend    | FastAPI (Python)               |
| ORM        | SQLAlchemy                     |
| Database   | SQLite                         |
| Auth       | JWT (bcrypt, python-jose)      |
| Realtime   | WebSockets                     |
| Deployment | Render                         |



## 🏗️ System Architecture

Rootify follows a **three-tier architecture**:

- **Frontend (React):** Handles UI and user interactions  
- **Backend (FastAPI):** Manages APIs, authentication, and business logic  
- **Database (SQLite):** Stores application data via SQLAlchemy ORM  



## 🔄 System Flow

1. User interacts with the frontend  
2. Frontend sends API requests to backend  
3. Backend processes logic and interacts with database  
4. Response is returned in JSON format  
5. WebSockets enable real-time chat functionality  



## 🧪 Testing

- Manual UI testing  
- API testing using FastAPI Swagger Docs  
- Verified:
  - Authentication flow  
  - CRUD operations  
  - Real-time chat functionality  



## 📊 Results

The system successfully supports:

- Secure user authentication  
- NGO discovery and volunteer applications  
- Community interaction  
- Real-time messaging  

FastAPI ensures efficient performance and fast response times.



## 🚀 Deployment

The application is deployed on **Render**:

- 🌐 Frontend → Static Site on Render  
- ⚙️ Backend → FastAPI Web Service on Render  
- 🗄️ Database → SQLite (development setup)  



## ⚠️ Challenges Faced

- Integrating frontend with backend APIs  
- Managing JWT authentication and protected routes  
- Implementing real-time chat using WebSockets  
- Handling application state and data flow  



## 🎯 Conclusion

Rootify is a complete full-stack solution for connecting volunteers with NGOs. It demonstrates practical implementation of modern web technologies, real-time communication, and deployment on cloud infrastructure.



## 🔮 Future Scope

- NGO verification system  
- Improved search and filtering  
- Email notifications  
- Admin dashboard  
- Enhanced UI/UX and responsiveness  
