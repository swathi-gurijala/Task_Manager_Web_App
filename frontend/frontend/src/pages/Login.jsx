import React, { useState } from "react";
import { loginUser } from "../api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    setLoadingMessage("Checking credentials... ⏳");

    try {
      const data = await loginUser(email, password);

      // Smooth progress simulation
      setLoadingMessage("Almost there... 🚀");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("email", email);

      setLoadingMessage("Login successful! 🎉");
      await new Promise((resolve) => setTimeout(resolve, 500));

      window.location.href = "/dashboard";
    } catch (err) {
      setLoading(false);
      setLoadingMessage("");
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
          disabled={loading}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2980b9")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3498db")}
          onClick={handleLogin}
          disabled={loading}
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

      {/* Floating modal for loading */}
      {loading && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.spinner}></div>
            <p style={styles.modalMessage}>{loadingMessage}</p>
          </div>
        </div>
      )}
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
    position: "relative",
  },
  card: {
    backgroundColor: "#2c2c3e",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 0px 25px rgba(0,0,0,0.6)",
    width: "370px",
    textAlign: "center",
    zIndex: 1,
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
  // Modal overlay
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: "#2c2c3e",
    padding: "30px 40px",
    borderRadius: "12px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #fff",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "15px",
  },
  modalMessage: {
    color: "#fff",
    fontSize: "16px",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};
