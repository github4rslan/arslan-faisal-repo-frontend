// src/PaymentHistory.js
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");

  const authedApi = useMemo(() => {
    const instance = api;
    instance.defaults.headers.common.Authorization = token;
    return instance;
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    authedApi
      .get("/payments")
      .then((res) => {
        setPayments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Failed to fetch payments");
        setLoading(false);
      });
  }, [authedApi, token, navigate]);

  return (
    <div style={{ padding: "30px", maxWidth: "500px", margin: "auto" }}>
      <h2>
        <span role="img" aria-label="history">
          🧾
        </span>{" "}
        Payment History
      </h2>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "15px",
          padding: "8px 15px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        ⬅ Back
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {payments.map((payment) => (
            <li key={payment._id}>
              {payment.amount} -{" "}
              {new Date(payment.date).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
