import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "./firebase"; // Firebase functions
import api from "./api"; // Axios instance to interact with the backend

export default function Login() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Google Sign-In handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // Handle Google Sign-In
      const user = result.user;
      console.log(user); // Check user object to see the logged-in user details

      // Send user data to backend to save in MongoDB
      const userData = {
        email: user.email,
        name: user.displayName,
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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px", backgroundColor: "#fff", width: "300px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Login</h2>

        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        {message && <p style={{ color: "green", fontSize: "14px" }}>{message}</p>}

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

        {/* Option for users who don't have an account */}
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
      </div>
    </div>
  );
}
