import React, { useState } from "react";
import { loginUser } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("email", email);

      alert("Login successful!");
      window.location.href = "/dashboard";
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.mainHeading}>Welcome Back 👋</h1>
        <p style={styles.subHeading}>
          Login to continue managing your tasks efficiently.
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
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
          onClick={handleLogin}
        >
          Login
        </button>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <a style={styles.link} href="/register">
            Register
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
    fontSize: "28px",
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
    backgroundColor: "#3498db",
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
