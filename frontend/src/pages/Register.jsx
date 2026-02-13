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
        <h1 style={styles.mainHeading}>Create Your Account 🚀</h1>
        <p style={styles.subHeading}>
          Join us and start organizing your tasks smarter today.
        </p>

        <input
          style={styles.input}
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2ecc71")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#27ae60")}
          onClick={handleRegister}
        >
          Register
        </button>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <a style={styles.link} href="/login">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

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
    borderRadius: "12px",
    boxShadow: "0px 0px 25px rgba(0,0,0,0.6)",
    width: "370px",
    textAlign: "center",
  },
  mainHeading: {
    color: "#ffffff",
    fontSize: "26px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  subHeading: {
    color: "#b0b0c3",
    fontSize: "14px",
    marginBottom: "25px",
  },
  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "none",
    outline: "none",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#27ae60",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    marginTop: "15px",
    transition: "0.3s ease",
  },
  footerText: {
    color: "#ffffff",
    marginTop: "15px",
    fontSize: "14px",
  },
  link: {
    color: "#3498db",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
