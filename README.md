# 🚀 Task Manager – Full Stack Web Application

<p align="center">
  <b>A modern full-stack task management application built with React.js & FastAPI</b><br/>
  Secure • Responsive • JWT Auth • Production Ready
</p>

---

## 📌 Overview

Task Manager is a full-stack web application that allows users to securely manage their daily tasks with authentication, filtering, and responsive UI design.

This project demonstrates:

- Frontend architecture using **React.js**
- Backend API development using **FastAPI**
- JWT-based authentication
- Full CRUD operations
- Production-ready project structure

---

## ✨ Features

### 🔐 Authentication
- User Registration
- User Login
- Secure Password Hashing
- JWT-based Authentication
- Protected Routes
- Token Validation Middleware

---

### 📋 Task Management
- ✅ Create Tasks  
- ✏️ Edit Tasks  
- 🗑 Delete Tasks  
- 🔄 Toggle Pending / Completed  
- 🔍 Search by Title & Description  
- 📅 Filter by Start Date  
- 📊 Filter by Status (Pending / Completed)  
- ♻ Reset Filters  
- 🌙 Dark / Light Mode  
- 📱 Fully Responsive Design  

---

## 🛠 Tech Stack

### 🎨 Frontend
- React.js
- React Router
- Axios
- Toast Notifications
- Custom Responsive CSS

### ⚙ Backend
- FastAPI
- SQLAlchemy ORM
- JWT Authentication
- Password Hashing
- SQLite (Development Database)

---

## 📂 Project Structure

```
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
│   │   ├── components/
│   │   │   └── ProtectedRoute.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── api.js
│   │   └── App.jsx
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 🔹 Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

```
http://localhost:8000
```

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔑 Environment Variables (Production Ready Setup)

Create a `.env` file inside the backend folder:

```
SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=postgresql://user:password@host:port/dbname
```

⚠️ Never commit `.env` files to GitHub.

---

## 🔒 Security Implementation

- Password hashing before storing in database
- JWT token generation & validation
- Protected API routes
- Middleware-based authentication
- CORS configuration
- Secure token handling on frontend

---

## 🌍 Production Deployment (Recommended)

### Frontend
- Deploy using **Vercel** or **Netlify**

### Backend
- Deploy using **Render**, **Railway**, or **Fly.io**
- Use PostgreSQL instead of SQLite
- Configure environment variables securely
- Enable HTTPS

---

## 🚀 Future Improvements

- PostgreSQL for production database
- Pagination for tasks
- Due date reminders
- Role-based access control
- Task categories
- Email notifications

---

## 👩‍💻 Author

**Swathi**  
Full Stack Developer  
React.js • FastAPI • JWT Authentication  

---

## ⭐ Why This Project Stands Out

✔ Clean Architecture  
✔ Secure Authentication  
✔ Full CRUD Implementation  
✔ Filtering & Search Logic  
✔ Responsive UI  
✔ Production-Ready Structure  
