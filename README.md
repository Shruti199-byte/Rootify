 Rootify — Volunteer & NGO Connection Platform

Rootify is a full-stack web application that connects volunteers with NGOs. The platform enables users to discover organizations, apply for opportunities, communicate in real-time, and track their contributions through a personalized dashboard.

 Problem Statement

There is no centralized platform where individuals can easily find and engage with NGOs. At the same time, NGOs struggle to reach the right volunteers.

Rootify solves this problem by providing a single platform for NGO discovery, communication, and volunteer engagement.

 Tech Stack
Layer	Technology
Frontend	React (Vite) + Tailwind CSS
Backend	FastAPI + SQLAlchemy
Database	SQLite
Auth	JWT (bcrypt + python-jose)
Chat	WebSockets (FastAPI)
 Features
User Registration & Login (JWT Authentication)
User Profile Management
NGO Registration & Listing
NGO Discovery (Search & Filters)
Volunteer Opportunities & Applications
Community Feed (Posts & Interaction)
Real-time Chat using WebSockets
Dashboard for tracking applications
Basic Volunteer Portfolio Tracking
System Architecture

The application follows a three-tier architecture:

Frontend (React) – Handles UI and user interaction
Backend (FastAPI) – Manages APIs, authentication, and business logic
Database (SQLite) – Stores application data using SQLAlchemy ORM
 System Flow
User interacts with the frontend
Frontend sends API requests to backend
Backend processes requests and interacts with database
Response is returned as JSON
WebSockets enable real-time chat functionality
 Testing
Manual UI testing
API testing using FastAPI Swagger docs
Verified authentication, CRUD operations, and chat functionality
 Results

The system successfully supports:

User authentication
NGO discovery and applications
Community interaction
Real-time messaging

FastAPI ensures fast response time and efficient performance.

Deployment

The application is deployed using Render:

Frontend → Hosted on Render
Backend → FastAPI deployed on Render
Database → SQLite (development setup)
Challenges Faced
Integrating frontend with backend APIs
Managing JWT authentication
Implementing real-time chat using WebSockets
Handling application state and data flow
Conclusion

Rootify demonstrates a complete full-stack solution for connecting volunteers with NGOs. The system is modular, efficient, and built using modern technologies.
