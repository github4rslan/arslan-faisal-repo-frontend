import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function WhatsAppChecker() {
  const [phone, setPhone] = useState("");
  const [endpoint, setEndpoint] = useState("check"); // default endpoint
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle API call
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
      const res = await api.post(`/whatsapp/${endpoint}`, { phone });
      console.log("API Response:", res.data); // 🔎 debug
      setResult(res.data);
    } catch (err) {
      console.error("Error fetching WhatsApp data:", err);
      setError("Failed to fetch WhatsApp data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render results by endpoint type
  const renderResult = () => {
    if (!result) return null;

    switch (result.type) {
      case "business":
        if (Array.isArray(result) && result.length > 0) {
          const biz = result[0];
          return (
            <>
              <p><strong>Query:</strong> {biz.query}</p>
              <p><strong>Business Info:</strong> {biz.isBusiness}</p>
              <p><strong>Verified Name:</strong> {biz.verifiedName}</p>
            </>
          );
        }
        return <p>No business data found.</p>;

      case "privacy":
        return (
          <>
            <p><strong>Phone:</strong> {result.phone}</p>
            <p><strong>Privacy:</strong> {result.privacy}</p>
          </>
        );

      case "devices":
        return (
          <>
            <p><strong>Message:</strong> {result.message}</p>
            <p><strong>Devices:</strong> {result.devices}</p>
          </>
        );

      case "osint":
        return (
          <>
            <p><strong>Registered:</strong> {result.Registered}</p>
            <p><strong>Public Image:</strong> {result.PublicImage}</p>
            {result.URL && (
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <img
                  src={result.URL}
                  alt="Profile"
                  style={{ width: "120px", height: "120px", borderRadius: "50%" }}
                />
              </div>
            )}
          </>
        );

      default:
        return <pre>{JSON.stringify(result, null, 2)}</pre>;
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
      <form
        onSubmit={handleCheck}
        style={{ display: "flex", marginBottom: "20px", gap: "8px" }}
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
            width: "250px",
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
          <option value="check">Business Insights</option>
          <option value="privacy">Privacy Settings</option>
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
          {renderResult()}
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
