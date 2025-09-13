import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("auth_token");

    if (!user || !token) {
      setMessage("❌ Please login first.");
      return;
    }

    // ✅ normalize id
    const userId = user._id || user.id;

    if (parseInt(amount) > user.balance) {
      setMessage("⚠️ Insufficient balance.");
      return;
    }

    try {
      const res = await api.post(
        "/users/withdraw",
        { userId, amount: parseInt(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Normalize & update localStorage
      const updatedUser = { ...res.data.user, id: res.data.user._id || res.data.user.id };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // ✅ Trigger storage event so AccountPage updates instantly
      window.dispatchEvent(new Event("storage"));

      setMessage(`✅ Successfully withdrawn PKR ${amount}`);
      setAmount("");
    } catch (err) {
      setMessage(err.response?.data?.error || "Withdraw failed");
    }
  };

  return (
    <div style={containerStyle}>
      <h1>🏦 Withdraw</h1>
      <p>
        <strong>Available Balance:</strong> PKR{" "}
        {JSON.parse(localStorage.getItem("user"))?.balance || 0}
      </p>

      <div style={cardStyle}>
        <input
          type="number"
          placeholder="Enter withdraw amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleWithdraw} style={buttonStyle}>
          Withdraw
        </button>
        {message && <p style={{ marginTop: "15px" }}>{message}</p>}
      </div>

      <button onClick={() => navigate("/betting")} style={backButtonStyle}>
        ⬅ Back to Betting Dashboard
      </button>
    </div>
  );
}

// Styles (same as DepositPage but with red button for withdraw)
const containerStyle = { padding: "40px", textAlign: "center", backgroundColor: "#f4f6f8", minHeight: "100vh" };
const cardStyle = { margin: "20px auto", padding: "20px", backgroundColor: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", maxWidth: "400px" };
const inputStyle = { width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ddd" };
const buttonStyle = { width: "100%", padding: "12px", backgroundColor: "#dc3545", color: "white", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer" };
const backButtonStyle = { marginTop: "30px", padding: "12px 20px", backgroundColor: "#007bff", color: "white", fontSize: "16px", fontWeight: "bold", border: "none", borderRadius: "8px", cursor: "pointer" };
