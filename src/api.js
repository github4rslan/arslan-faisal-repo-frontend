import axios from "axios";

// Detect if running locally or in production
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const api = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:5000/api" // local backend
    : "https://backend-node-js-8eqf.onrender.com/api", // deployed backend
});

export default api;
