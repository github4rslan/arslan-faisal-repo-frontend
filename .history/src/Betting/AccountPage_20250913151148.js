import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ axios instance

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ helper: normalize id
  const normalizeUser = (u) => ({
    ...u,
    id: u._id || u.id,
  });

  const fetchUser = useCallback(async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("auth_token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/users/${storedUser._id || storedUser.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = normalizeUser(res.data);
      setUser(updatedUser);

      // ✅ keep localStorage consistent
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();

    // ✅ Listen for balance updates (Deposit/Withdraw triggers)
    const handleStorageChange = () => {
      fetchUser();
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [fetchUser]);

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "50px" }}>⏳ Loading account...</p>;
  }

  if (!user) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        ❌ No user info found. Please login.
      </p>
    );
  }

  const winRate =
    user.totalBets > 0 ? ((user.betsWon / user.totalBets) * 100).toFixed(1) : 0;

  return (
    <div style={containerStyle}>
      <h1>👤 Account Details</h1>

      {/* Profile Info */}
      <div style={cardStyle}>
        <h2>📌 Profile Info</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
        <p><strong>Joined:</strong> {new Date(user.createdAt).toDateString()}</p>
      </div>

      {/* Wallet Info */}
      <div style={cardStyle}>
        <h2>💰 Wallet</h2>
        <p><strong>Balance:</strong> PKR {user.balance}</p>
        <p><strong>Total Deposits:</strong> PKR {user.totalDeposits}</p>
        <p><strong>Total Withdrawals:</strong> PKR {user.totalWithdrawals}</p>
        <p><strong>Bonus:</strong> PKR {user.bonus}</p>
      </div>

      {/* Betting Stats */}
      <div style={cardStyle}>
        <h2>🎲 Betting Stats</h2>
        <p><strong>Total Bets:</strong> {user.totalBets}</p>
        <p><strong>Bets Won:</strong> {user.betsWon}</p>
        <p><strong>Bets Lost:</strong> {user.betsLost}</p>
        <p><strong>Win Rate:</strong> {winRate}%</p>
        <p><strong>Biggest Win:</strong> PKR {user.biggestWin}</p>
      </div>

      {/* Actions */}
      <div style={{ marginTop: "30px" }}>
        <button onClick={() => navigate("/betting")} style={buttonStyle}>
          ⬅ Back to Betting Dashboard
        </button>
        <button
          onClick={fetchUser}
          style={{ ...buttonStyle, backgroundColor: "#28a745", marginLeft: "10px" }}
        >
          🔄 Refresh Balance
        </button>
      </div>
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
  maxWidth: "500px",
  textAlign: "left",
};

const buttonStyle = {
  marginTop: "10px",
  padding: "12px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};
