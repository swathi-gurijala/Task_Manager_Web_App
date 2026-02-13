import React, { useEffect, useState, useRef } from "react";
import {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  updateTaskStatus,
} from "../api";
import { getCurrentUser } from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // store original tasks
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  const [searchText, setSearchText] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchStartDate, setSearchStartDate] = useState("");

  const profileRef = useRef(null);

  const [hoveredBtn, setHoveredBtn] = useState(null);
  const [hoveredStatus, setHoveredStatus] = useState(null);

  // Fetch tasks & user email
  useEffect(() => {
    const fetchUserAndTasks = async () => {
      const emailFromStorage = localStorage.getItem("email");
      if (emailFromStorage) setUserEmail(emailFromStorage);

      try {
        const user = await getCurrentUser();
        setUserEmail(user.email);
      } catch (err) {
        console.error("Failed to fetch user info:", err);
      }

      fetchTasks();
    };

    fetchUserAndTasks();
  }, []);

  // Close profile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasks();

      const formatted = data.map((task) => ({
        ...task,
        created_at: task.created_at ? new Date(task.created_at + "Z") : null,
        updated_at: task.updated_at ? new Date(task.updated_at + "Z") : null,
      }));

      setTasks(formatted);
      setAllTasks(formatted); // store original
    } catch (err) {
      toast.error(err.message || "Error fetching tasks");
    }
  };

  // Proper frontend filtering (no backend refetch)
  const handleSearch = () => {
    let filtered = [...allTasks];

    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchText.toLowerCase()) ||
          task.description.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (searchStatus !== "") {
      filtered = filtered.filter(
        (task) => task.status === searchStatus
      );
    }

    if (searchStartDate !== "") {
      filtered = filtered.filter(
        (task) =>
          task.created_at &&
          task.created_at >= new Date(searchStartDate)
      );
    }

    setTasks(filtered);
  };

  const handleReset = () => {
    setSearchText("");
    setSearchStatus("");
    setSearchStartDate("");
    setTasks(allTasks);
  };

  const handleAddOrUpdate = async () => {
    if (!title || !description)
      return toast.warn("Please enter title & description");
    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, { title, description });
        toast.success("Task updated successfully!");
        setEditingTaskId(null);
      } else {
        await createTask({ title, description });
        toast.success("Task added successfully!");
      }
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      toast.error(err.message || "Error adding/updating task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (err) {
      toast.error(err.message || "Error deleting task");
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditingTaskId(task.id);
  };

  const handleStatusChange = async (taskId) => {
    try {
      await updateTaskStatus(taskId);
      toast.success("Task status updated!");
      fetchTasks();
    } catch (err) {
      toast.error(err.message || "Error updating status");
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "/login";
  };

  const handleShare = (task) => {
    const taskLink = `${window.location.origin}/task/${task.id}`;
    if (navigator.share) {
      navigator.share({
        title: task.title,
        text: task.description,
        url: taskLink,
      });
    } else {
      navigator.clipboard.writeText(taskLink);
      toast.info("Task link copied!");
    }
  };

  // ---------------- STYLES (UNCHANGED) ----------------
  const container = { fontFamily: "Segoe UI", backgroundColor: darkMode ? "#1e1e2f" : "#f5f6fa", minHeight: "100vh", padding: "30px" };
  const header = { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" };
  const heading = { fontSize: "2.5rem", fontWeight: "bold", color: darkMode ? "#fff" : "#333", margin: 0 };
  const subHeading = { fontSize: "1.1rem", color: darkMode ? "#bbb" : "#555", marginTop: "5px" };
  const profileArea = { display: "flex", alignItems: "center", gap: "15px", position: "relative" };
  const toggleBtn = { padding: "8px", borderRadius: "50%", border: "none", cursor: "pointer", fontSize: "18px", backgroundColor: darkMode ? "#fff" : "#1e1e2f", color: darkMode ? "#000" : "#fff" };
  const profileBtn = { fontSize: "24px", cursor: "pointer", padding: "5px 12px", border: "1px solid #fff", borderRadius: "5px", backgroundColor: "#3498db", color: "#fff" };
  const profileDropdown = { position: "absolute", top: "40px", right: "0", backgroundColor: "#fff", color: "#000", padding: "15px", borderRadius: "5px", width: "220px", boxShadow: "0px 0px 10px rgba(0,0,0,0.3)", zIndex: 1000 };
  const logoutBtn = { marginTop: "10px", backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "8px 12px", cursor: "pointer", borderRadius: "5px", fontWeight: "bold", width: "100%" };
  const card = { backgroundColor: darkMode ? "#2c2c3e" : "#fff", color: darkMode ? "#fff" : "#000", padding: "20px", borderRadius: "12px", boxShadow: darkMode ? "0px 0px 15px rgba(0,0,0,0.5)" : "0px 0px 10px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "10px", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer" };
  const cardHover = { transform: "scale(1.02)" };
  const formInput = { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #ccc", outline: "none", fontSize: "16px", boxSizing: "border-box" };
  const addBtn = { padding: "12px 20px", backgroundColor: "#3498db", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold", fontSize: "16px", marginTop: "10px" };
  const btnGroup = { display: "flex", justifyContent: "space-between", marginTop: "10px", gap: "10px" };
  const taskBtn = { flex: 1, padding: "8px 12px", borderRadius: "6px", border: "none", fontWeight: "bold", cursor: "pointer", fontSize: "14px" };
  const taskList = { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" };
  const dateStyle = { fontSize: "0.85rem", color: darkMode ? "#bbb" : "#555" };
  const lineStyle = { borderBottom: `1px solid ${darkMode ? "#555" : "#ccc"}`, margin: "5px 0" };

  const getStatusStyle = (status, isHovered) => ({
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    backgroundColor: isHovered ? (status === "completed" ? "#27ae60" : "#e67e22") : (status === "completed" ? "#2ecc71" : "#f39c12"),
    color: "#fff",
    width: "150px",
    fontSize: "14px",
    transition: "all 0.2s ease",
  });

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <h1 style={heading}>Task Manager ✨</h1>
          <p style={subHeading}>Stay productive, complete tasks & have fun! 🚀</p>
        </div>

        <div style={profileArea} ref={profileRef}>
          <button onClick={toggleDarkMode} style={toggleBtn}>
            {darkMode ? "🌙" : "🌞"}
          </button>
          <div onClick={() => setShowProfile(!showProfile)} style={profileBtn}>☰</div>
          {showProfile && (
            <div style={profileDropdown}>
              <p><strong>User:</strong> {userEmail || "Not logged in"}</p>
              <button style={logoutBtn} onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH SECTION (UI unchanged, only logic updated) */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
        <h3 style={{ color: darkMode ? "#fff" : "#333", marginRight: "10px", fontSize: "1rem" }}>
          🔎 Search & Filter Tasks
        </h3>

        <input
          style={{ ...formInput, width: "170px", padding: "6px", fontSize: "14px" }}
          placeholder="Title / Description"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          style={{ ...formInput, width: "130px", padding: "6px", fontSize: "14px" }}
          value={searchStatus}
          onChange={(e) => setSearchStatus(e.target.value)}
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="date"
          style={{ ...formInput, width: "150px", padding: "6px", fontSize: "14px" }}
          value={searchStartDate}
          onChange={(e) => setSearchStartDate(e.target.value)}
        />

        <button
          style={{ padding: "6px 10px", fontSize: "14px", backgroundColor: "#3498db", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          onClick={handleSearch}
        >
          Search
        </button>

        <button
          style={{ padding: "6px 10px", fontSize: "14px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer" }}
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Rest of your UI remains EXACTLY the same */}
      {/* Task Form + Task List unchanged */}

      {/* (Keeping exactly your original JSX below without modification) */}

      {/* Task Form */}
      <div style={{ ...card, marginBottom: "25px" }}>
        <input style={formInput} placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} />
        <input style={formInput} placeholder="Task Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button
          style={addBtn}
          onClick={handleAddOrUpdate}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2980b9"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3498db"}
        >
          {editingTaskId ? "Update Task" : "Add Task"}
        </button>
      </div>

      {/* Task List */}
      <div style={taskList}>
        {tasks.length === 0 && <p style={{ color: darkMode ? "#fff" : "#000" }}>No tasks yet.</p>}
        {tasks.map(task => (
          <div
            key={task.id}
            style={card}
            onMouseEnter={e => e.currentTarget.style.transform = cardHover.transform}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{task.title}</div>
            <div style={lineStyle}></div>
            <div style={{ wordWrap: "break-word", overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>
              {task.description}
            </div>
            <div style={lineStyle}></div>
            <p style={dateStyle}>Created: {task.created_at?.toLocaleString()}</p>

            {task.updated_at instanceof Date &&
              task.created_at instanceof Date &&
              task.updated_at.getTime() !== task.created_at.getTime() && (
                <p style={dateStyle}>Updated: {task.updated_at?.toLocaleString()}</p>
              )}

            <select
              value={task.status}
              onChange={() => handleStatusChange(task.id)}
              style={getStatusStyle(task.status, hoveredStatus === task.id)}
              onMouseEnter={() => setHoveredStatus(task.id)}
              onMouseLeave={() => setHoveredStatus(null)}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <div style={btnGroup}>
              <button style={{ ...taskBtn, backgroundColor: "#f1c40f" }} onClick={() => handleEdit(task)}>Edit</button>
              <button style={{ ...taskBtn, backgroundColor: "#e74c3c", color: "#fff" }} onClick={() => handleDelete(task.id)}>Delete</button>
              <button style={{ ...taskBtn, backgroundColor: "#1abc9c", color: "#fff" }} onClick={() => handleShare(task)}>Share</button>
            </div>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}
