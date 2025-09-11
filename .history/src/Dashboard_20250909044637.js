import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import {
  WbSunny,
  Quiz,
  CurrencyBitcoin,
  FormatQuote,
  Assignment,
  CreditCard,
  History,
  MusicNote,
  Group,
  PersonAdd,
  Logout,
} from "@mui/icons-material";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  const isAdmin = user?.role === "admin";

  // ✅ Features with icons
  const features = (isAdmin) => [
    { label: "Weather", path: "/weather", icon: WbSunny, color: "#ffb300" },
    { label: "Trivia Quiz", path: "/trivia", icon: Quiz, color: "#8e24aa" },
    { label: "Crypto", path: "/crypto", icon: CurrencyBitcoin, color: "#f57c00" },
    { label: "Quotes", path: "/quotes", icon: FormatQuote, color: "#0288d1" },
    { label: "Tasks", path: "/tasks", icon: Assignment, color: "#2e7d32" },
    { label: "Payment", path: "/payment", icon: CreditCard, color: "#c2185b" },
    { label: "History", path: "/payment-history", icon: History, color: "#5d4037" },
    { label: "TikTok Downloader", path: "/tiktok-downloader", icon: MusicNote, color: "#d81b60" },
    ...(isAdmin
      ? [
          { label: "Users", path: "/admin/users", icon: Group, color: "#1976d2" },
          { label: "Add User", path: "/admin/add-user", icon: PersonAdd, color: "#00796b" },
        ]
      : []),
  ];

  return (
    <Box sx={{ p: 3, minHeight: "100vh", backgroundColor: "#f5f7fb" }}>
      {/* Welcome Header */}
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Welcome {user?.name || "User"} 🎉
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "gray" }}>
        Logged in as <strong>{user?.email}</strong> —{" "}
        <span style={{ color: isAdmin ? "green" : "gray", fontWeight: "bold" }}>
          {isAdmin ? "Admin" : "User"}
        </span>
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={statCardStyle("linear-gradient(135deg,#42a5f5,#1e88e5)")}>
            <Typography variant="h6">Users</Typography>
            <Typography variant="h4">26K</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={statCardStyle("linear-gradient(135deg,#66bb6a,#43a047)")}>
            <Typography variant="h6">Income</Typography>
            <Typography variant="h4">$6,200</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={statCardStyle("linear-gradient(135deg,#ffa726,#fb8c00)")}>
            <Typography variant="h6">Conversion</Typography>
            <Typography variant="h4">2.49%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={statCardStyle("linear-gradient(135deg,#ef5350,#e53935)")}>
            <Typography variant="h6">Sessions</Typography>
            <Typography variant="h4">44K</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Features Section */}
      <Typography variant="h6" sx={{ mt: 5, mb: 2, fontWeight: "bold" }}>
        🚀 Available Features
      </Typography>

      <Grid container spacing={3}>
        {features(isAdmin).map((f, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <Paper
              component={Link}
              to={f.path}
              sx={{
                p: 3,
                textDecoration: "none",
                color: "#333",
                textAlign: "center",
                borderRadius: 3,
                height: 140,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                },
              }}
            >
              <f.icon sx={{ fontSize: 40, color: f.color, mb: 1 }} />
              <Typography variant="subtitle1" fontWeight="bold">
                {f.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Logout Button */}
      <Box textAlign="center" sx={{ mt: 5 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            px: 4,
            py: 1.2,
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "8px",
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}

/* Reusable Stat Card Style */
const statCardStyle = (background) => ({
  p: 3,
  borderRadius: 3,
  color: "white",
  background,
  textAlign: "center",
  height: 120,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
});
