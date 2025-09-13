import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <h1>👤 Account Details</h1>
      {user ? (
        <div style={cardStyle}>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Balance:</strong> ${user.balance || 0}</p>
        </div>
      ) : (
        <p>No user info found. Please login.</p>
      )}

      {/* Back Button */}
      <button onClick={() => navigate("/betting")} style={buttonStyle}>
        ⬅ Back to Betting Dashboard
      </button>
    </div>
  );
}

const containerStyle = {
  padding: "40px",
  textAlign: "center",
  backgroundColor: "#f4f6f8",
  minHeight: "100vh",
};

const cardStyle = {
  margin: "20px auto",
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  maxWidth: "400px",
  textAlign: "left",
};

const buttonStyle = {
  marginTop: "30px",
  padding: "12px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};
