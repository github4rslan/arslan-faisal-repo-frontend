import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ add Link
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

      // Prepare data for backend
      const userData = {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        uid: user.uid,
      };

      // Save in your backend
      await api.post("/auth/google-signin", userData);

      // Store token + user locally
      // Note: In Firebase v9, prefer an ID token if you need a verified JWT:
      // const idToken = await user.getIdToken();
      // localStorage.setItem("auth_token", idToken);
      localStorage.setItem("auth_token", user.accessToken || ""); // falls back if you keep this shape
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      setError("Google login failed");
      console.error(err);
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
