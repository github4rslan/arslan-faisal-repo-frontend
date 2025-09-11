import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

export default function WhatsAppChecker() {
  const [phone, setPhone] = useState("");
  const [endpoint, setEndpoint] = useState("business"); // default
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Call backend
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
      setResult(res.data);
    } catch (err) {
      console.error("Error fetching WhatsApp data:", err);
      setError("Failed to fetch WhatsApp data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Render results based on endpoint type
  const renderResult = () => {
    if (!result) return null;

    switch (result.type) {
      case "business":
        return (
          <>
            <p>
              <strong>Verified Name:</strong>{" "}
              {result.data?.verifiedName || "N/A"}
            </p>
            <p>
              <strong>Business Type:</strong>{" "}
              {result.data?.isBusiness || "N/A"}
            </p>
          </>
        );

      case "status":
        return (
          <>
            <p>
              <strong>Status (About):</strong> {result.data?.about || "N/A"}
            </p>
          </>
        );

      case "osint":
        return (
          <>
            <p>
              <strong>Registered:</strong>{" "}
              {result.data.registered ? "Yes ✅" : "No ❌"}
            </p>
            <p>
              <strong>Public Image:</strong>{" "}
              {result.data.publicImage ? "Yes ✅" : "No ❌"}
            </p>
            {result.data.imageUrl ? (
              <div style={{ marginTop: "15px", textAlign: "center" }}>
                <img
                  src={result.data.imageUrl}
                  alt="Profile"
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ) : (
              <p><em>No profile picture available</em></p>
            )}
          </>
        );

      case "devices":
        return (
          <>
            <p>
              <strong>Message:</strong> {result.data?.message || "N/A"}
            </p>
            <p>
              <strong>Devices Linked:</strong>{" "}
              {result.data?.devices ?? "Unknown"}
            </p>
          </>
        );

      case "privacy":
        return (
          <>
            <p>
              <strong>Phone:</strong> {result.data?.phone || "N/A"}
            </p>
            <p>
              <strong>Privacy:</strong> {result.data?.privacy || "N/A"}
            </p>
          </>
        );

      default:
        return <p>Unknown result type.</p>;
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
        style={{ display: "flex", marginBottom: "20px" }}
      >
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
            width: "250px",
          }}
        />
        <select
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          style={{
            padding: "12px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
          }}
        >
          <option value="status">Status</option>
          <option value="osint">Fetch OSINT Info</option>
          <option value="devices">Devices</option>
          <option value="privacy">Privacy Settings</option>
        </select>
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
            maxWidth: "450px",
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
