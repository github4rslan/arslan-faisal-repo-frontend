import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const [paymentId, setPaymentId] = useState("");
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    if (paymentId.trim() !== "") {
      setVerified(true);
    }
  };

  return (
    <div style={containerStyle}>
      <h1>💳 Payment Verification</h1>
      <div style={cardStyle}>
        <input
          type="text"
          placeholder="Enter Payment ID"
          value={paymentId}
          onChange={(e) => setPaymentId(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleVerify} style={buttonStyle}>
          Verify Payment
        </button>
        {verified && <p style={{ marginTop: "15px", color: "green" }}>✅ Payment Verified!</p>}
      </div>

      {/* Back Button */}
      <button onClick={() => navigate("/betting")} style={backButtonStyle}>
        ⬅ Back to Betting Dashboard
      </button>
    </div>
  );
}

const containerStyle = {
  padding: "40px",
  textAlign: "center",
  backgroundColor: "#f4f6f8",
  minHeight: "100vh",
};

const cardStyle = {
  margin: "20px auto",
  padding: "20px",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  maxWidth: "400px",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ddd",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#007bff",
  color: "white",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const backButtonStyle = {
  marginTop: "30px",
  padding: "12px 20px",
  backgroundColor: "#6c757d",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};
