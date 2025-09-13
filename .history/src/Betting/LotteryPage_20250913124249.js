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

  // ✅ Fetch user (balance + history) when page loads
  const fetchUser = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("auth_token");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    try {
      const res = await api.get(`/users/${user._id || user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBalance(res.data.balance || 0);
      // ✅ Always sort latest first
      setHistory((res.data.gameHistory || []).sort((a, b) => new Date(b.time) - new Date(a.time)));

      // refresh localStorage copy too
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.error("⚠️ Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUser();

    // ✅ Listen for deposits/withdraws
    const handleStorageChange = () => {
      fetchUser();
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

    const betAmount = 100;
    const reward = 200;
    const won = choice === result;

    setMessage(
      won
        ? `🎉 You won! Number was ${randomNum} (${result.toUpperCase()}) (+PKR ${reward})`
        : `😢 You lost! Number was ${randomNum} (${result.toUpperCase()}) (-PKR ${betAmount})`
    );

    try {
      setLoading(true);
      const res = await api.post(
        "/users/update-balance",
        {
          userId: user._id || user.id,
          amount: won ? reward : -betAmount,
          bet: {
            event: "Even/Odd Game",
            number: randomNum,
            amount: betAmount,
            status: won ? "Won" : "Lost",
            time: new Date().toISOString(),
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = {
        ...res.data.user,
        id: res.data.user._id || res.data.user.id,
      };

      // ✅ Update balance & history live (sorted latest first)
      setBalance(updatedUser.balance);
      setHistory((updatedUser.gameHistory || []).sort((a, b) => new Date(b.time) - new Date(a.time)));

      // ✅ Sync localStorage & trigger refresh
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("❌ Error updating balance:", err);
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
                  color: h.status === "Won" ? "green" : "red",
                  fontWeight: "500",
                }}
              >
                [{new Date(h.time).toLocaleString()}] {h.status} (Number:{" "}
                {h.number}) {h.status === "Won" ? "+" : "-"}
                {h.status === "Won" ? 200 : 100} PKR
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
