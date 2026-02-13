📌 Task Manager – Full Stack Web Application

A modern full-stack Task Manager built using React.js (Frontend) and FastAPI (Backend) with JWT authentication, protected routes, and full CRUD functionality.

✨ Features
🔐 Authentication

User Registration

User Login

JWT-based Authentication

Protected Routes

Secure Password Hashing

📋 Task Management

Create Tasks

Edit Tasks

Delete Tasks

Toggle Pending / Completed

Search Tasks (by title & description)

Filter by:

Status (Pending / Completed)

Start Date

Reset Filters

Responsive Task Cards

Dark / Light Mode

🛠 Tech Stack
Frontend

React.js

React Router

Axios

Toast Notifications

Custom Responsive CSS

Backend

FastAPI

SQLAlchemy

JWT Authentication

Password Hashing

SQLite (Development)

📂 Project Structure
task-manager/
│
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── database.py
│   ├── schemas.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/ ProtectedRoute.js
│   │   ├── pages/ Dashborad.jsx, Login.jsx, Register.jsx
│   │   ├── api.js
│   │   └── App.jsx
│
└── README.md

⚙️ Installation & Setup
1️⃣ Backend Setup
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload


Backend runs on:

http://localhost:8000

2️⃣ Frontend Setup
cd frontend
npm install
npm start


Frontend runs on:

http://localhost:3000

🔑 Environment Variables (Production Ready Setup)

Create .env file inside backend:

SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=postgresql://user:password@host:port/dbname

🔒 Security Implemented

Password hashing

JWT token validation

Protected API routes

Token-based authentication middleware

CORS configuration

🚀 Future Improvements

Deploy backend with PostgreSQL

Use TailwindCSS for scalable styling

Add Pagination

Add Due Date reminders

Add Role-based access control

👩‍💻 Author

Swathi
Full Stack Developer (React + FastAPI)
