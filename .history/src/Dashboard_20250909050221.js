import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Paper,
} from "@mui/material";

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

  // Reusable clean card
  const renderCard = (to, icon, text) => (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 10px 28px rgba(0,0,0,0.15)",
          },
          backgroundColor: "#fff",
        }}
      >
        <CardActionArea component={Link} to={to} sx={{ height: "100%" }}>
          <CardContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 4,
            }}
          >
            <Typography variant="h3" component="div">
              {icon}
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mt: 2, textAlign: "center", color: "#444" }}
            >
              {text}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%)", // pink → white gradient
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 5,
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#d81b60",
            }}
          >
            🎉 Welcome to Dashboard
          </Typography>

          {user && (
            <Typography
              align="center"
              sx={{ fontSize: "1.1rem", mb: 4, color: "#444" }}
            >
              Logged in as <strong>{user.name}</strong> ({user.email}) —{" "}
              <span
                style={{
                  color: isAdmin ? "#2e7d32" : "#888",
                  fontWeight: "bold",
                }}
              >
                {isAdmin ? "Admin" : "User"}
              </span>
            </Typography>
          )}

          <Typography
            variant="h5"
            align="center"
            sx={{ mb: 3, fontWeight: "600", color: "#ad1457" }}
          >
            🚀 Available Features
          </Typography>

          <Grid container spacing={3}>
            {/* Common features */}
            {renderCard("/weather", "🌦", "Weather")}
            {renderCard("/trivia", "🎮", "Trivia Quiz")}
            {renderCard("/crypto", "💰", "Crypto")}
            {renderCard("/quotes", "💬", "Quotes")}
            {renderCard("/tasks", "📝", "Tasks (CRUD)")}
            {renderCard("/payment", "💳", "Mock Payment")}
            {renderCard("/payment-history", "📜", "Payment History")}
            {renderCard("/tiktok-downloader", "🎵", "TikTok Downloader")}

            {/* Admin-only features */}
            {isAdmin && (
              <>
                {renderCard("/admin/users", "👥", "Registered Users")}
                {renderCard("/admin/add-user", "➕", "Add User")}
              </>
            )}
          </Grid>

          <Box textAlign="center" mt={5}>
            <Button
              onClick={handleLogout}
              variant="contained"
              sx={{
                px: 5,
                py: 1.5,
                background: "linear-gradient(90deg, #e53935, #b71c1c)",
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "10px",
                boxShadow: "0px 6px 20px rgba(183,28,28,0.4)",
                "&:hover": {
                  background: "linear-gradient(90deg, #c62828, #7f0000)",
                },
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
