import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function WhatsAppChecker() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Check WhatsApp info
  const handleCheck = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError("Please enter a phone number");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/whatsapp/check", { phone });
      setResult(res.data);
    } catch (err) {
      console.error("Error fetching WhatsApp data:", err);
      setError("Failed to fetch WhatsApp data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>
        📱 WhatsApp Checker
      </h1>

      {/* Search Form */}
      <form onSubmit={handleCheck} style={{ display: "flex", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter phone number (e.g., 13022612667)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            padding: "12px 15px",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            width: "280px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            borderRadius: "0 8px 8px 0",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {/* Loading / Error */}
      {loading && <p>⏳ Checking WhatsApp...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Result Card */}
      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "25px 30px",
            backgroundColor: "white",
            borderRadius: "15px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <h2 style={{ marginBottom: "15px", fontSize: "1.8rem" }}>Result</h2>

          {result.data ? (
            <>
              <p>
                <strong>Exists:</strong>{" "}
                {result.data.exists ? "Yes ✅" : "No ❌"}
              </p>
              <p>
                <strong>Type:</strong> {result.data.type || "Unknown"}
              </p>
              {result.data.name && (
                <p>
                  <strong>Name:</strong> {result.data.name}
                </p>
              )}
              {result.data.category && (
                <p>
                  <strong>Category:</strong> {result.data.category}
                </p>
              )}
              {result.data.about && (
                <p>
                  <strong>About:</strong> {result.data.about}
                </p>
              )}
              {result.data.profile_pic && (
                <div style={{ marginTop: "15px", textAlign: "center" }}>
                  <img
                    src={result.data.profile_pic}
                    alt="Profile"
                    style={{
                      width: "120px",
                      height: "120px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <p>No data found for this number.</p>
          )}
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "40px",
          padding: "12px 25px",
          backgroundColor: "#28a745",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#1e7e34")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
