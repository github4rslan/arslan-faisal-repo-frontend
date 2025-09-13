import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function DepositPage() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ normalize user so "id" always exists
  const normalizeUser = (user) => ({
    ...user,
    id: user._id || user.id,
  });

  const handleDeposit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("auth_token");

    if (!user || !token) {
      setMessage("❌ Please login first.");
      return;
    }

    try {
      const res = await api.post(
        "/users/deposit",
        { userId: user.id, amount: parseInt(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Normalize before saving
      const updatedUser = normalizeUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ Trigger live update for AccountPage
      window.dispatchEvent(new Event("storage"));

      setMessage(`✅ Successfully deposited PKR ${amount}`);
      setAmount("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Deposit failed");
    }
  };

  const currentBalance = JSON.parse(localStorage.getItem("user"))?.balance || 0;

  return (
    <div style={containerStyle}>
      <h1>💳 Deposit</h1>
      <p>
        <strong>Available Balance:</strong> PKR {currentBalance}
      </p>

      <div style={cardStyle}>
        <input
          type="number"
          placeholder="Enter deposit amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleDeposit} style={buttonStyle}>
          Deposit
        </button>
        {message && <p style={{ marginTop: "15px" }}>{message}</p>}
      </div>

      <button onClick={() => navigate("/betting")} style={backButtonStyle}>
        ⬅ Back to Betting Dashboard
      </button>
    </div>
  );
}

// Styles
const containerStyle = { padding: "40px", textAlign: "center", backgroundColor: "#f4f6f8", minHeight: "100vh" };
const cardStyle = { margin: "20px auto", padding: "20px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxWidth: "400px" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" };
const buttonStyle = { width: "100%", padding: "12px", backgroundColor: "#28a745", color: "white", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer" };
const backButtonStyle = { marginTop: "30px", padding: "12px 20px", backgroundColor: "#007bff", color: "white", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer" };
