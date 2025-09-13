import React from "react";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // Dummy extra details (replace later with API data)
  const wallet = {
    balance: user?.balance || 0,
    deposits: 5000,
    withdrawals: 2000,
    bonus: 500,
  };

  const stats = {
    totalBets: 42,
    betsWon: 18,
    betsLost: 24,
    biggestWin: 1500,
  };

  const recentActivity = [
    { event: "Team A vs Team B", amount: 500, status: "Won" },
    { event: "Team C vs Team D", amount: 300, status: "Lost" },
    { event: "Lottery Draw #21", amount: 200, status: "Pending" },
  ];

  const winRate =
    stats.totalBets > 0
      ? ((stats.betsWon / stats.totalBets) * 100).toFixed(1)
      : 0;

  return (
    <div style={containerStyle}>
      <h1>👤 Account Details</h1>
      {user ? (
        <>
          {/* Profile Info */}
          <div style={cardStyle}>
            <h2>📌 Profile Info</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Joined:</strong> Jan 12, 2025</p>
          </div>

          {/* Wallet Info */}
          <div style={cardStyle}>
            <h2>💰 Wallet</h2>
            <p><strong>Balance:</strong> PKR {wallet.balance}</p>
            <p><strong>Total Deposits:</strong> PKR {wallet.deposits}</p>
            <p><strong>Total Withdrawals:</strong> PKR {wallet.withdrawals}</p>
            <p><strong>Bonus:</strong> PKR {wallet.bonus}</p>
          </div>

          {/* Betting Stats */}
          <div style={cardStyle}>
            <h2>🎲 Betting Stats</h2>
            <p><strong>Total Bets:</strong> {stats.totalBets}</p>
            <p><strong>Bets Won:</strong> {stats.betsWon}</p>
            <p><strong>Bets Lost:</strong> {stats.betsLost}</p>
            <p><strong>Win Rate:</strong> {winRate}%</p>
            <p><strong>Biggest Win:</strong> PKR {stats.biggestWin}</p>
          </div>

          {/* Recent Activity */}
          <div style={cardStyle}>
            <h2>🕒 Recent Activity</h2>
            {recentActivity.map((bet, index) => (
              <p key={index}>
                {bet.event} — <strong>PKR {bet.amount}</strong> (
                <span
                  style={{
                    color:
                      bet.status === "Won"
                        ? "green"
                        : bet.status === "Lost"
                        ? "red"
                        : "orange",
                  }}
                >
                  {bet.status}
                </span>
                )
              </p>
            ))}
          </div>
        </>
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
  maxWidth: "500px",
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
