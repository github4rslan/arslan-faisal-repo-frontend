import React from "react";
import { Link } from "react-router-dom";

export default function BettingMainPage() {
  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "2.2rem", marginBottom: "20px" }}>🎲 Betting App</h1>
      <p style={{ marginBottom: "30px", fontSize: "1.1rem", color: "#555" }}>
        Manage your account, verify payments, and try your luck in the lottery!
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "25px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* 👤 Account Details */}
        <Link to="/betting/account" style={cardStyle}>
          👤 Account Details
          <span style={cardDesc}>View balance & user details</span>
        </Link>

        {/* 💳 Payment Verification */}
        <Link to="/betting/payment" style={cardStyle}>
          💳 Payment Verification
          <span style={cardDesc}>Verify your payments securely</span>
        </Link>

        {/* 🎟 Lottery App */}
        <Link to="/betting/lottery" style={cardStyle}>
          🎟 Lottery App
          <span style={cardDesc}>Play & test your luck</span>
        </Link>
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "40px 20px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  textDecoration: "none",
  color: "#333",
  fontSize: "18px",
  fontWeight: "bold",
  textAlign: "center",
  transition: "0.3s",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  cursor: "pointer",
};

const cardDesc = {
  fontSize: "14px",
  fontWeight: "normal",
  color: "#666",
  marginTop: "10px",
};
