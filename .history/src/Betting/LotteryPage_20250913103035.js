import React, { useState } from "react";

export default function LotteryPage() {
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");

  const handlePlay = () => {
    if (number >= 1 && number <= 10) {
      const winningNum = Math.floor(Math.random() * 10) + 1;
      setMessage(
        number == winningNum
          ? `🎉 You won! The winning number was ${winningNum}`
          : `😢 You lost. The winning number was ${winningNum}`
      );
    } else {
      setMessage("⚠️ Please enter a number between 1 and 10.");
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
        <button onClick={handlePlay} style={buttonStyle}>
          Play Lottery
        </button>
        {message && <p style={{ marginTop: "15px" }}>{message}</p>}
      </div>
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
