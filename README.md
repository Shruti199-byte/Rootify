# Rootify — Volunteer + NGO Network

A full-stack platform connecting volunteers with NGOs. Discover organizations, apply for opportunities, chat in real-time, and build your volunteer portfolio.

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Frontend | React (Vite) + Tailwind CSS        |
| Backend  | FastAPI + SQLAlchemy               |
| Database | MySQL 8.0                          |
| Auth     | JWT (bcrypt + python-jose)         |
| Chat     | WebSockets (FastAPI native)        |

## Features

- ✅ JWT Authentication (register/login)
- ✅ User profiles with interests & bio
- ✅ NGO registration & management
- ✅ Admin-controlled NGO verification
- ✅ NGO discovery with search, category & location filters
- ✅ Volunteer opportunities with applications
- ✅ Real-time WebSocket chat
- ✅ In-app notifications (DB-stored)
- ✅ Volunteer portfolio with hours tracking
- ✅ Community feed (posts)
- ✅ Ratings & reviews for NGOs
- ✅ Admin panel (stats, verification, role management)
- ✅ Pagination on all list endpoints
- ✅ Docker support

## Local Setup (macOS)

### Prerequisites

```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js, Python, MySQL
brew install node python mysql
```

### 1. Start MySQL

```bash
brew services start mysql

# Set root password (first time only)
mysql_secure_installation

# Create the database
mysql -u root -p < backend/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MySQL password

# Start the server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 4. Access the Application

| Service          | URL                                 |
|------------------|-------------------------------------|
| Frontend         | http://localhost:5173                |
| Backend API      | http://localhost:8000                |
| API Docs (Swagger)| http://localhost:8000/docs          |
| API Docs (ReDoc) | http://localhost:8000/redoc          |

### Default Admin Account

```
Email: admin@rootify.com
Password: admin123
```

## Docker Setup (Alternative)

```bash
docker-compose up --build
```

This starts MySQL, the FastAPI backend, and the React frontend automatically.

## Project Structure

```
Rootify/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── database.py           # SQLAlchemy config
│   ├── config.py             # Environment config
│   ├── schema.sql            # MySQL schema
│   ├── requirements.txt
│   ├── .env / .env.example
│   ├── models/               # SQLAlchemy models
│   │   ├── user.py
│   │   ├── ngo.py
│   │   ├── opportunity.py
│   │   ├── application.py
│   │   ├── message.py
│   │   ├── notification.py
│   │   ├── review.py
│   │   └── post.py
│   ├── schemas/              # Pydantic schemas
│   │   ├── user.py
│   │   ├── ngo.py
│   │   ├── opportunity.py
│   │   ├── application.py
│   │   ├── message.py
│   │   ├── notification.py
│   │   ├── review.py
│   │   └── post.py
│   ├── routers/              # API endpoints
│   │   ├── auth.py
│   │   ├── ngos.py
│   │   ├── opportunities.py
│   │   ├── applications.py
│   │   ├── messages.py
│   │   ├── notifications.py
│   │   ├── reviews.py
│   │   ├── posts.py
│   │   └── admin.py
│   └── services/             # Business logic
│       ├── auth.py
│       └── notification.py
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── utils/
│       │   └── api.js
│       ├── components/
│       │   ├── Navbar.jsx
│       │   └── UI.jsx
│       └── pages/
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── NGOList.jsx
│           ├── NGODetail.jsx
│           ├── Dashboard.jsx
│           ├── Profile.jsx
│           ├── Chat.jsx
│           ├── Portfolio.jsx
│           ├── Feed.jsx
│           ├── Notifications.jsx
│           └── Admin.jsx
├── docker-compose.yml
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Sign up
- `POST /api/auth/login` — Log in
- `GET /api/auth/me` — Get profile
- `PUT /api/auth/me` — Update profile

### NGOs
- `POST /api/ngos` — Register NGO
- `GET /api/ngos` — List NGOs (paginated, filterable)
- `GET /api/ngos/{id}` — Get NGO details
- `PUT /api/ngos/{id}` — Update NGO
- `POST /api/ngos/{id}/verify` — Toggle verification (admin)

### Opportunities
- `POST /api/opportunities` — Create opportunity
- `GET /api/opportunities` — List opportunities
- `GET /api/opportunities/{id}` — Get opportunity

### Applications
- `POST /api/applications` — Apply to opportunity
- `GET /api/applications/my` — My applications
- `GET /api/applications/ngo` — Applications to my NGO
- `PUT /api/applications/{id}` — Update status/hours

### Messages
- `GET /api/messages/conversations` — List conversations
- `GET /api/messages/{user_id}` — Chat history
- `POST /api/messages` — Send message (REST)
- `WS /api/messages/ws/{token}` — WebSocket chat

### Notifications
- `GET /api/notifications` — List notifications
- `GET /api/notifications/unread-count` — Unread count
- `PUT /api/notifications/{id}/read` — Mark read
- `PUT /api/notifications/read-all` — Mark all read

### Reviews
- `POST /api/reviews` — Create review
- `GET /api/reviews/ngo/{id}` — NGO reviews

### Posts
- `POST /api/posts` — Create post
- `GET /api/posts` — List posts (paginated)
- `DELETE /api/posts/{id}` — Delete post

### Admin
- `GET /api/admin/stats` — Dashboard stats
- `GET /api/admin/users` — List users
- `GET /api/admin/ngos` — List all NGOs
- `PUT /api/admin/users/{id}/role` — Change user role
