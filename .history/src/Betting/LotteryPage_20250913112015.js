import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ axios instance

export default function LotteryPage() {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlay = async () => {
    if (number < 1 || number > 10) {
      setMessage("⚠️ Please enter a number between 1 and 10.");
      return;
    }

    const winningNum = Math.floor(Math.random() * 10) + 1;
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("auth_token");

    if (!user || !token) {
      setMessage("❌ Please login first.");
      return;
    }

    const betAmount = 100; // 🎯 fixed bet for now
    const reward = 500; // 🎯 win reward

    if (parseInt(number) === winningNum) {
      setMessage(`🎉 You won! The winning number was ${winningNum} (+PKR ${reward})`);

      try {
        setLoading(true);
        await api.post(
          "/users/update-balance",
          {
            userId: user.id,
            amount: reward, // add to balance
            bet: {
              event: `Lottery Draw`,
              amount: betAmount,
              status: "Won",
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLoading(false);
      } catch (err) {
        console.error("Error updating balance:", err);
        setLoading(false);
      }
    } else {
      setMessage(`😢 You lost. The winning number was ${winningNum}`);
      try {
        setLoading(true);
        await api.post(
          "/users/update-balance",
          {
            userId: user.id,
            amount: -betAmount, // deduct bet
            bet: {
              event: `Lottery Draw`,
              amount: betAmount,
              status: "Lost",
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLoading(false);
      } catch (err) {
        console.error("Error deducting balance:", err);
        setLoading(false);
      }
    }
  };

  return (
    <div style={containerStyle}>
      <h1>🎟 Lottery App</h1>
      <div style={cardStyle}>
        <input
          type="number"
          placeholder="Pick a number (1-10)"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handlePlay} style={buttonStyle} disabled={loading}>
          {loading ? "Processing..." : "Play Lottery"}
        </button>
        {message && <p style={{ marginTop: "15px" }}>{message}</p>}
      </div>

      {/* Back Button */}
      <button onClick={() => navigate("/betting")} style={backButtonStyle}>
        ⬅ Back to Betting Dashboard
      </button>
    </div>
  );
}

// Styles
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
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#28a745",
  color: "white",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const backButtonStyle = {
  marginTop: "30px",
  padding: "12px 20px",
  backgroundColor: "#007bff",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
