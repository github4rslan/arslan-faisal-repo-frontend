import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ axios instance

export default function EvenOddPage() {
  const [choice, setChoice] = useState(""); // "even" or "odd"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePlay = async () => {
    if (!choice) {
      setMessage("⚠️ Please select Even or Odd first.");
      return;
    }

    const randomNum = Math.floor(Math.random() * 10) + 1; // 1–10
    const result = randomNum % 2 === 0 ? "even" : "odd";

    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("auth_token");

    if (!user || !token) {
      setMessage("❌ Please login first.");
      return;
    }

    const betAmount = 100; // 🎯 fixed bet
    const reward = 200; // 🎯 win reward (2x)

    if (choice === result) {
      setMessage(
        `🎉 You won! Number was ${randomNum} (${result.toUpperCase()}) (+PKR ${reward})`
      );

      try {
        setLoading(true);
        await api.post(
          "/users/update-balance",
          {
            userId: user.id,
            amount: reward, // add reward
            bet: {
              event: `Even/Odd Game`,
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
      setMessage(
        `😢 You lost! Number was ${randomNum} (${result.toUpperCase()}) (-PKR ${betAmount})`
      );

      try {
        setLoading(true);
        await api.post(
          "/users/update-balance",
          {
            userId: user.id,
            amount: -betAmount, // deduct bet
            bet: {
              event: `Even/Odd Game`,
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
      <h1>🎲 Even or Odd Game</h1>
      <div style={cardStyle}>
        <div style={{ marginBottom: "15px" }}>
          <button
            style={{
              ...optionButton,
              backgroundColor: choice === "even" ? "#007bff" : "#f1f1f1",
              color: choice === "even" ? "white" : "black",
            }}
            onClick={() => setChoice("even")}
          >
            Even
          </button>
          <button
            style={{
              ...optionButton,
              backgroundColor: choice === "odd" ? "#007bff" : "#f1f1f1",
              color: choice === "odd" ? "white" : "black",
            }}
            onClick={() => setChoice("odd")}
          >
            Odd
          </button>
        </div>

        <button onClick={handlePlay} style={buttonStyle} disabled={loading}>
          {loading ? "Processing..." : "Play"}
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

const optionButton = {
  padding: "12px 20px",
  margin: "0 10px",
  border: "1px solid #ddd",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
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
  marginTop: "10px",
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
