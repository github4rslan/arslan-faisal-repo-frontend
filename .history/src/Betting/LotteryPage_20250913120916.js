import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function EvenOddPage() {
  const [choice, setChoice] = useState(""); // "even" or "odd"
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch user balance when page loads
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.balance) setBalance(user.balance);

    // ✅ Listen for global balance updates (Deposit/Withdraw/Other games)
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      if (updatedUser?.balance !== undefined) {
        setBalance(updatedUser.balance);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

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

    let outcome;
    let change;

    if (choice === result) {
      outcome = `🎉 You won! Number was ${randomNum} (${result.toUpperCase()}) (+PKR ${reward})`;
      change = reward;
    } else {
      outcome = `😢 You lost! Number was ${randomNum} (${result.toUpperCase()}) (-PKR ${betAmount})`;
      change = -betAmount;
    }

    setMessage(outcome);

    try {
      setLoading(true);
      const res = await api.post(
        "/users/update-balance",
        {
          userId: user._id || user.id, // ✅ normalize
          amount: change,
          bet: {
            event: `Even/Odd Game`,
            amount: betAmount,
            status: choice === result ? "Won" : "Lost",
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Update localStorage & balance live
      const updatedUser = {
        ...res.data.user,
        id: res.data.user._id || res.data.user.id,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setBalance(updatedUser.balance);

      // ✅ Trigger global update
      window.dispatchEvent(new Event("storage"));

      // ✅ Append to history (frontend only, for now)
      setHistory((prev) => [
        {
          result: choice === result ? "Won" : "Lost",
          number: randomNum,
          time: new Date().toLocaleTimeString(),
          amount: change,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error updating balance:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1>🎲 Even or Odd Game</h1>

      {/* Live Balance */}
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        💰 Balance: PKR {balance}
      </p>

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

      {/* Game History */}
      <div style={historyCard}>
        <h3>📜 Game History</h3>
        {history.length === 0 ? (
          <p>No games played yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {history.map((h, idx) => (
              <li
                key={idx}
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #eee",
                  color: h.result === "Won" ? "green" : "red",
                }}
              >
                [{h.time}] {h.result} ({h.number}) {h.amount > 0 ? "+" : ""}
                {h.amount} PKR
              </li>
            ))}
          </ul>
        )}
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

const historyCard = {
  margin: "20px auto",
  padding: "15px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  maxWidth: "500px",
  textAlign: "left",
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
