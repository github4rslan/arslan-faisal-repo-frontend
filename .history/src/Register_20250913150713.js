import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "./api";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { PersonAdd } from "@mui/icons-material";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required!");
      return;
    }

    try {
      await api.post("/auth/register", form);
      setMessage("✅ Registration successful! Please login.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#1976d2", // Classic Blue Solid Background
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.9)", // Slight opacity for modern look
            boxShadow: "none", // No card shadow for simplicity
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333", // Dark text color
            }}
          >
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              sx={{
                backgroundColor: "#f5f5f5", // Light input background
              }}
            />
            <TextField
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              sx={{
                backgroundColor: "#f5f5f5", // Light input background
              }}
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              sx={{
                backgroundColor: "#f5f5f5", // Light input background
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<PersonAdd />}
              sx={{
                mt: 3,
                py: 1.3,
                fontWeight: "bold",
                fontSize: "1rem",
                background: "#1976d2", // Primary button color
                "&:hover": {
                  background: "#1565c0", // Darker on hover
                },
                borderRadius: "8px",
                boxShadow: "none", // Removed shadow for simplicity
              }}
            >
              Register
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 3, fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1976d2", fontWeight: "500" }}>
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
