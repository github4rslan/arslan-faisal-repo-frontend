import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./api";
import {
  auth,
  provider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
} from "./firebase";

import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
} from "@mui/material";
import { Google } from "@mui/icons-material";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          const user = result.user;
          const idToken = await user.getIdToken();
          try {
            await api.post("/auth/google-signin", { idToken });
          } catch (e) {
            console.error("Backend session create failed:", e);
          }
          localStorage.setItem("auth_token", idToken);
          localStorage.setItem("user", JSON.stringify(user));
          setMessage("✅ Login successful!");
          navigate("/dashboard");
        }
      })
      .catch((e) => {
        console.error(e);
        setError(e.message || "Google login failed");
      });
  }, [navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.email || !form.password) {
      setError("Both fields are required!");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("✅ Login successful! Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  }

  const handleGoogleLogin = async () => {
    setError("");
    setMessage("");
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      try {
        await api.post("/auth/google-signin", { idToken });
      } catch (e) {
        console.error("Backend session create failed:", e);
      }

      localStorage.setItem("auth_token", idToken);
      localStorage.setItem("user", JSON.stringify(user));
      setMessage("✅ Login successful!");
      navigate("/dashboard");
    } catch (e) {
      console.warn("Popup failed, falling back to redirect:", e);
      await signInWithRedirect(auth, provider);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: "100%" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
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
              sx={{ mt: 2, py: 1.2 }}
            >
              Login with Email
            </Button>
          </form>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            sx={{ mt: 2, py: 1.2 }}
          >
            Login with Google
          </Button>

          <Typography align="center" sx={{ mt: 3 }}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ color: "#1976d2" }}>
              Register
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
