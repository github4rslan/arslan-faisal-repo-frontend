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

  // Reusable card function
  const renderCard = (to, icon, text, color) => (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(233,30,99,0.4)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 12px 32px rgba(136,14,79,0.6)",
          },
          background: `linear-gradient(135deg, ${color[0]}, ${color[1]})`,
          color: "white",
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
              sx={{ fontWeight: "bold", mt: 2, textAlign: "center" }}
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
        background: "linear-gradient(135deg, #ff4081 0%, #7b1fa2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 5,
            backgroundColor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(14px)",
          }}
        >
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#d81b60",
              textShadow: "0 3px 8px rgba(216,27,96,0.4)",
            }}
          >
            🎉 Welcome to Dashboard
          </Typography>

          {user && (
            <Typography
              align="center"
              sx={{ fontSize: "1.2rem", mb: 4, color: "#333" }}
            >
              Logged in as <strong>{user.name}</strong> ({user.email}) —{" "}
              <span
                style={{
                  color: isAdmin ? "#2e7d32" : "#616161",
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
            sx={{ mb: 3, fontWeight: "600", color: "#6a1b9a" }}
          >
            🚀 Available Features
          </Typography>

          <Grid container spacing={3}>
            {/* Common features */}
            {renderCard("/weather", "🌦", "Weather", ["#ec407a", "#d81b60"])}
            {renderCard("/trivia", "🎮", "Trivia Quiz", ["#ab47bc", "#8e24aa"])}
            {renderCard("/crypto", "💰", "Crypto", ["#f06292", "#e91e63"])}
            {renderCard("/quotes", "💬", "Quotes", ["#ba68c8", "#9c27b0"])}
            {renderCard("/tasks", "📝", "Tasks (CRUD)", ["#f48fb1", "#c2185b"])}
            {renderCard("/payment", "💳", "Mock Payment", ["#ce93d8", "#6a1b9a"])}
            {renderCard("/payment-history", "📜", "Payment History", [
              "#f06292",
              "#ad1457",
            ])}
            {renderCard("/tiktok-downloader", "🎵", "TikTok Downloader", [
              "#d81b60",
              "#880e4f",
            ])}

            {/* Admin-only features */}
            {isAdmin && (
              <>
                {renderCard("/admin/users", "👥", "Registered Users", [
                  "#ec407a",
                  "#ad1457",
                ])}
                {renderCard("/admin/add-user", "➕", "Add User", [
                  "#ab47bc",
                  "#6a1b9a",
                ])}
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
