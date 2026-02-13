const BASE_URL = "http://127.0.0.1:8000";

// ---------------- AUTH ----------------
export async function registerUser(email, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Registration failed");
  return data;
}

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "Login failed");

  localStorage.setItem("email", email);
  localStorage.setItem("token", data.access_token);
  return data;
}

// ---------------- HELPER ----------------
function authHeader() {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

// ---------------- TASKS ----------------
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`, { headers: authHeader() });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: authHeader(),
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to create task");
  }
  return res.json();
}

export async function updateTask(id, task) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: authHeader(),
    body: JSON.stringify(task),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to update task");
  }
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeader(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to delete task");
  }
}

export async function updateTaskStatus(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}/status`, {
    method: "PUT",
    headers: authHeader(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Failed to update status");
  }
  return res.json();
}

export async function getCurrentUser() {
  const res = await fetch(`${BASE_URL}/me`, { headers: authHeader() });
  if (!res.ok) throw new Error("Failed to fetch user info");
  return res.json();
}
