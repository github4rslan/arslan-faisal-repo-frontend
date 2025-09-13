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
  Paper,
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
        background: "linear-gradient(135deg, #42a5f5 0%, #1a237e 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1a237e" }}
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
                background: "linear-gradient(90deg, #43a047, #2e7d32)",
                "&:hover": {
                  background: "linear-gradient(90deg, #388e3c, #1b5e20)",
                },
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(67, 160, 71, 0.4)",
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
        </Paper>
      </Container>
    </Box>
  );
}
