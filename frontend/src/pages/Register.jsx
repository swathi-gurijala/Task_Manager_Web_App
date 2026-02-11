import React, { useState } from "react";
import { registerUser } from "../api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      await registerUser(email, password);
      alert("Registered successfully! Please login.");
      setEmail("");
      setPassword("");
      window.location.href = "/login";
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Register</h2>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleRegister}>
          Register
        </button>
        <p style={{ color: "#fff", marginTop: "10px" }}>
          Already have an account?{" "}
          <a style={{ color: "#3498db" }} href="/login">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

// --------- Styles ----------
const styles = {
  container: {
    backgroundColor: "#1e1e2f",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    backgroundColor: "#2c2c3e",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 0px 20px rgba(0,0,0,0.5)",
    width: "350px",
    textAlign: "center",
  },
  heading: {
    color: "#fff",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "5px",
    border: "none",
    outline: "none",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "10px",
  },
};
