import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api"; // Import the Axios instance
import { auth, provider, signInWithPopup } from "./firebase"; // Firebase auth functions

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle email/password change
  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  // Handle email/password login
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.email || !form.password) {
      setError("Both fields are required!");
      return;
    }

    try {
      // Use API for email/password login
      const res = await api.post("/auth/login", form);

      // Save token + user info
      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  // Google Sign-In handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Handle Google Sign-In
      const user = result.user;
      console.log(user); // Check user object to see the logged-in user details

      // Send user data to backend to save in MongoDB
      const userData = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        uid: user.uid,
      };

      // Send data to the backend API to save in MongoDB
      await api.post("/auth/google-signin", userData); // Your backend API route

      // Save token and user info to local storage
      localStorage.setItem("auth_token", user.accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("✅ Login successful!");
      navigate("/dashboard"); // Redirect to the dashboard after login
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#fff",
          width: "300px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Login</h2>

        <div style={{ marginBottom: "10px" }}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        {message && <p style={{ color: "green", fontSize: "14px" }}>{message}</p>}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login with Email
        </button>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#db4437", // Google Red Color
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Login with Google
        </button>

        <Link
          to="/register"
          style={{
            display: "block",
            textAlign: "center",
            marginTop: "10px",
            color: "#007bff",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          Don’t have an account? Register
        </Link>
      </form>
    </div>
  );
}
