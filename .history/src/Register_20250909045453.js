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
        background: "linear-gradient(135deg, #ff4081 0%, #7b1fa2 100%)",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 4,
            backdropFilter: "blur(14px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            boxShadow: "0px 8px 30px rgba(123, 31, 162, 0.5)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#7b1fa2",
              textShadow: "0px 2px 6px rgba(123, 31, 162, 0.3)",
            }}
          >
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
          {message && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
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
              variant="outlined"
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
              variant="outlined"
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
              variant="outlined"
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              startIcon={<PersonAdd />}
              sx={{
                mt: 3,
                py: 1.4,
                fontWeight: "bold",
                fontSize: "1rem",
                background: "linear-gradient(90deg, #ec407a, #d81b60)",
                "&:hover": {
                  background: "linear-gradient(90deg, #d81b60, #880e4f)",
                },
                borderRadius: "10px",
                boxShadow: "0px 6px 18px rgba(216, 27, 96, 0.4)",
                letterSpacing: "0.5px",
              }}
            >
              Register
            </Button>
          </form>

          <Typography
            align="center"
            sx={{ mt: 3, fontSize: "0.9rem", color: "#444" }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#ec407a",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
