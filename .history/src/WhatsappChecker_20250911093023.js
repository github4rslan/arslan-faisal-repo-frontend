import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function WhatsAppChecker() {
  const [phone, setPhone] = useState("");
  const [endpoint, setEndpoint] = useState("business");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      let res;
      switch (endpoint) {
        case "business":
          res = await api.post("/whatsapp/check", { phone });
          break;
        case "privacy":
          res = await api.post("/whatsapp/privacy", { phone });
          break;
        case "devices":
          res = await api.post("/whatsapp/devices", { phone });
          break;
        case "osint":
          res = await api.post("/whatsapp/osint", { phone });
          break;
        default:
          throw new Error("Invalid endpoint");
      }
      setResult(res.data);
    } catch (err) {
      console.error("Error fetching WhatsApp data:", err);
      setError("Failed to fetch WhatsApp data.");
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    switch (result.type) {
      case "business":
        return (
          <>
            <p><strong>Query:</strong> {result.data.query}</p>
            <p><strong>Business:</strong> {result.data.isBusiness}</p>
            <p><strong>Verified Name:</strong> {result.data.verifiedName}</p>
          </>
        );
      case "privacy":
        return (
          <>
            <p><strong>Phone:</strong> {result.data.phone}</p>
            <p><strong>Privacy:</strong> {result.data.privacy}</p>
          </>
        );
      case "devices":
        return (
          <>
            <p><strong>Message:</strong> {result.data.message}</p>
            <p><strong>Devices:</strong> {result.data.devices}</p>
          </>
        );
      case "osint":
        return (
          <>
            <p><strong>Registered:</strong> {result.data.Registered}</p>
            <p><strong>Public Image:</strong> {result.data.PublicImage}</p>
            {result.data.URL && (
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <img
                  src={result.data.URL}
                  alt="Profile"
                  style={{ width: "120px", height: "120px", borderRadius: "50%" }}
                />
              </div>
            )}
          </>
        );
      default:
        return <p>No data found.</p>;
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

      {/* Input Form */}
      <form
        onSubmit={handleCheck}
        style={{ display: "flex", marginBottom: "20px", gap: "10px" }}
      >
        <input
          type="text"
          placeholder="Enter phone number (e.g., 13022612667)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            padding: "12px 15px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            width: "260px",
          }}
        />
        <select
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
          }}
        >
          <option value="business">Business Insights</option>
          <option value="privacy">Privacy</option>
          <option value="devices">Devices</option>
          <option value="osint">Fetch OSINT Info</option>
        </select>
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </form>

      {/* Loading/Error */}
      {loading && <p>⏳ Checking WhatsApp...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Result */}
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
          <h2 style={{ marginBottom: "15px", fontSize: "1.5rem" }}>Result</h2>
          {renderResult()}
        </div>
      )}

      {/* Back */}
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
        }}
      >
        ⬅ Back to Dashboard
      </button>
    </div>
  );
}
