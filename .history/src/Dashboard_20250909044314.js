import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Grid,
  Paper,
} from "@mui/material";

import {
  Dashboard as DashboardIcon,
  People,
  Settings,
  Logout,
  WbSunny,
  Quiz,
  CurrencyBitcoin,
  FormatQuote,
  Assignment,
  Payment,
  History,
  MusicNote,
  Add,
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

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
        }}
      >
        <Toolbar>
          <Typography variant="h6" fontWeight="bold" color="primary">
            MyApp Dashboard
          </Typography>
        </Toolbar>
        <List>
          <ListItem button>
            <ListItemIcon>
              <DashboardIcon color="primary" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          {isAdmin && (
            <ListItem button>
              <ListItemIcon>
                <People color="primary" />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
          )}
          <ListItem button>
            <ListItemIcon>
              <Settings color="primary" />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        {/* Topbar */}
        <AppBar
          position="static"
          color="transparent"
          elevation={0}
          sx={{ borderBottom: "1px solid #ddd" }}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h5" fontWeight="bold">
              Welcome {user?.name || "User"} 🎉
            </Typography>
            <IconButton color="error" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Stat Cards */}
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

            {/* Feature Links */}
            {features(isAdmin).map((f, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Paper
                  component={Link}
                  to={f.path}
                  sx={{
                    p: 3,
                    textDecoration: "none",
                    color: "#333",
                    textAlign: "center",
                    borderRadius: 3,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: "0 6px 16px rgba(0,0,0,0.2)" },
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
        </Box>
      </Box>
    </Box>
  );
}

const statCardStyle = (bg) => ({
  p: 3,
  borderRadius: 3,
  color: "white",
  background: bg,
  textAlign: "center",
});

const features = (isAdmin) => [
  { path: "/weather", label: "Weather", icon: WbSunny, color: "#fbc02d" },
  { path: "/trivia", label: "Trivia Quiz", icon: Quiz, color: "#7b1fa2" },
  { path: "/crypto", label: "Crypto", icon: CurrencyBitcoin, color: "#f57c00" },
  { path: "/quotes", label: "Quotes", icon: FormatQuote, color: "#0288d1" },
  { path: "/tasks", label: "Tasks", icon: Assignment, color: "#388e3c" },
  { path: "/payment", label: "Payment", icon: Payment, color: "#c2185b" },
  { path: "/payment-history", label: "History", icon: History, color: "#5d4037" },
  { path: "/tiktok-downloader", label: "TikTok", icon: MusicNote, color: "#000" },
  ...(isAdmin
    ? [
        { path: "/admin/users", label: "Users", icon: People, color: "#1976d2" },
        { path: "/admin/add-user", label: "Add User", icon: Add, color: "#388e3c" },
      ]
    : []),
];
