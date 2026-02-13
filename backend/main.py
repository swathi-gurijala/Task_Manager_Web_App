from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal, User, Task
from schemas import UserCreate, TaskCreate, TaskUpdate
from auth import hash_password, verify_password, create_access_token, get_current_user, get_db
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from fastapi import APIRouter, Depends
from auth import get_current_user
from schemas import UserOut
from typing import Optional
from sqlalchemy import or_

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------- AUTH --------
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    db_user = User(email=user.email, hashed_password=hash_password(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"email": db_user.email}

@app.post("/login")
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

# -------- TASKS --------
@app.get("/tasks")
def get_tasks(
    search: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Task).filter(Task.user_email == current_user.email)

    # 🔎 Search in title OR description
    if search:
        query = query.filter(
            or_(
                Task.title.ilike(f"%{search}%"),
                Task.description.ilike(f"%{search}%")
            )
        )

    # ✅ Filter by status (pending/completed)
    if status:
        query = query.filter(Task.status == status.lower())

    # 📅 Filter by created_at date range
    if start_date:
        query = query.filter(Task.created_at >= datetime.fromisoformat(start_date))

    if end_date:
        query = query.filter(Task.created_at <= datetime.fromisoformat(end_date))

    return query.order_by(Task.created_at.desc()).all()


@app.post("/tasks")
def create_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = Task(
        title=task.title,
        description=task.description,
        user_email=current_user.email,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow(),
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_email == current_user.email).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.title is not None:
        db_task.title = task.title
    if task.description is not None:
        db_task.description = task.description
    db_task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_email == current_user.email).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"detail": "Task deleted"}

@app.put("/tasks/{task_id}/status")
def toggle_task_status(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_task = db.query(Task).filter(Task.id == task_id, Task.user_email == current_user.email).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db_task.status = "completed" if db_task.status == "pending" else "pending"
    db_task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_task)
    return db_task

@app.get("/me", response_model=UserOut)
def read_current_user(current_user=Depends(get_current_user)):
    return current_user
