import React, { useState } from "react";
import api from "../api"; // import your axios instance

export default function WhatsAppChecker() {
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (!phone) {
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
      console.error(err);
      setError("Failed to fetch WhatsApp data. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>📱 WhatsApp OSINT Checker</h1>

      {/* Input + Button */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={{
            padding: "10px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        />
        <button
          onClick={handleCheck}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p style={{ color: "red", fontWeight: "bold", marginTop: "10px" }}>
          {error}
        </p>
      )}

      {/* Results */}
      {result && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            background: "#f9f9f9",
            borderRadius: "12px",
            maxWidth: "600px",
            marginInline: "auto",
            textAlign: "left",
          }}
        >
          <h2>Result:</h2>
          {result.data ? (
            <div>
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
                <img
                  src={result.data.profile_pic}
                  alt="Profile"
                  style={{
                    width: "100px",
                    borderRadius: "50%",
                    marginTop: "10px",
                  }}
                />
              )}
            </div>
          ) : (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}
