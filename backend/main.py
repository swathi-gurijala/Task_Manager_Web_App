from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from bson import ObjectId

from schemas import UserCreate, UserResponse, TaskCreate, TaskResponse
from auth import hash_password, verify_password, create_access_token, get_current_user
from database_mongo import users_col, tasks_col

import os
from dotenv import load_dotenv

load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL")

app = FastAPI()

# ---------------- CORS ----------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------- AUTH ROUTES ----------------
@app.post("/register")
def register(user: UserCreate):
    if users_col.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(user.password)
    users_col.insert_one({"email": user.email, "hashed_password": hashed})
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: UserCreate):
    db_user = users_col.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "email": user.email}

# ---------------- TASK ROUTES ----------------
# @app.get("/tasks")
# def get_tasks(current_user=Depends(get_current_user)):
#     tasks = list(tasks_col.find({"user_email": current_user["email"]}))
#     for task in tasks:
#         task["id"] = str(task["_id"])
#         task["created_at"] = task.get("created_at") or datetime.utcnow()
#         task["updated_at"] = task.get("updated_at") or datetime.utcnow()
#     return tasks

@app.get("/tasks")
def get_tasks(current_user=Depends(get_current_user)):

    tasks = list(tasks_col.find({"user_id": current_user["email"]}))

    formatted_tasks = []

    for task in tasks:
        formatted_tasks.append({
            "id": str(task["_id"]),
            "title": task.get("title"),
            "description": task.get("description"),
            "completed": task.get("completed", False),
            "created_at": task.get("created_at")
        })

    return formatted_tasks



@app.post("/tasks")
def create_task(task: dict, current_user=Depends(get_current_user)):

    task_data = {
        "title": task.get("title"),
        "description": task.get("description"),
        "completed": False,
        "user_id": current_user["email"],
        "created_at": datetime.utcnow()
    }

    result = tasks_col.insert_one(task_data)

    return {
        "id": str(result.inserted_id),
        "title": task_data["title"],
        "description": task_data["description"],
        "completed": task_data["completed"],
        "created_at": task_data["created_at"]
    }



@app.put("/tasks/{task_id}")
def update_task(task_id: str, updated_data: dict, current_user=Depends(get_current_user)):

    tasks_col.update_one(
        {"_id": ObjectId(task_id), "user_id": current_user["email"]},
        {"$set": {
            "title": updated_data.get("title"),
            "description": updated_data.get("description")
        }}
    )

    return {"message": "Task updated successfully"}


@app.put("/tasks/{task_id}/status")
def toggle_status(task_id: str, current_user=Depends(get_current_user)):

    task = tasks_col.find_one({"_id": ObjectId(task_id)})

    if not task:
        return {"error": "Task not found"}

    tasks_col.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {"completed": not task["completed"]}}
    )

    return {"message": "Status updated"}


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, current_user=Depends(get_current_user)):

    tasks_col.delete_one(
        {"_id": ObjectId(task_id), "user_id": current_user["email"]}
    )

    return {"message": "Task deleted successfully"}

