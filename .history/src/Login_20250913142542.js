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
import { AppProvider } from "@toolpad/core/AppProvider";
import { useTheme } from "@mui/material/styles";

// ✅ Branding like Toolpad example
const BRANDING = {
  logo: (
    <img
      src="https://mui.com/static/logo.svg"
      alt="App Logo"
      style={{ height: 30 }}
    />
  ),
  title: "My App",
};

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  // ✅ normalize user
  const normalizeUser = (user) => ({
    ...user,
    id: user._id || user.id,
  });

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
          const normalizedUser = {
            id: user.uid,
            name: user.displayName,
            email: user.email,
          };
          localStorage.setItem("user", JSON.stringify(normalizedUser));
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
      const res = await api.post("/auth/login", form);
      localStorage.setItem("auth_token", res.data.token);
      const normalizedUser = normalizeUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(normalizedUser));
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
      const normalizedUser = {
        id: user.uid,
        name: user.displayName,
        email: user.email,
      };
      localStorage.setItem("user", JSON.stringify(normalizedUser));
      setMessage("✅ Login successful!");
      navigate("/dashboard");
    } catch (e) {
      console.warn("Popup failed, falling back to redirect:", e);
      await signInWithRedirect(auth, provider);
    }
  };

  return (
    <AppProvider branding={BRANDING} theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #333 0%, #444 100%)", // Charcoal background
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              p: 5,
              borderRadius: 4,
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(255,255,255,0.9)", // Slight opacity to make it look modern
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
                  boxShadow: "0px 4px 12px rgba(25, 118, 210, 0.4)",
                }}
              >
                Login with Email
              </Button>
            </form>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<Google />}
              onClick={handleGoogleLogin}
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: "8px",
                fontWeight: "500",
                borderColor: "#ccc",
                "&:hover": { backgroundColor: "#f9f9f9" },
              }}
            >
              Login with Google
            </Button>

            <Typography align="center" sx={{ mt: 3, fontSize: "0.9rem" }}>
              Don’t have an account?{" "}
              <Link to="/register" style={{ color: "#1976d2", fontWeight: "500" }}>
                Register
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    </AppProvider>
  );
}
