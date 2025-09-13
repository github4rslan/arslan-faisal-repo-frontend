import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentPage() {
  const [method, setMethod] = useState("");
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!method) {
      setMessage("⚠️ Please select a payment method.");
      return;
    }

    // TODO: call your backend API here to verify with Fastpayment
    setMessage(`✅ Payment request submitted via ${method}.`);
  };

  return (
    <div style={containerStyle}>
      <h1>💳 Payment Verification</h1>
      <p style={{ marginBottom: "20px" }}>
        Choose a payment method to deposit money into your betting wallet.
      </p>

      {/* Payment Method Selector */}
      <select
        style={inputStyle}
        value={method}
        onChange={(e) => {
          setMethod(e.target.value);
          setMessage("");
          setFormData({});
        }}
      >
        <option value="">-- Select Payment Method --</option>
        <option value="debit">💳 Debit Card</option>
        <option value="credit">💳 Credit Card</option>
        <option value="easypaisa">📱 Easypaisa</option>
        <option value="jazzcash">📱 JazzCash</option>
      </select>

      {/* Payment Form */}
      {method && (
        <form onSubmit={handleSubmit} style={cardStyle}>
          {method === "debit" || method === "credit" ? (
            <>
              <input
                type="text"
                placeholder="Card Number"
                style={inputStyle}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Expiry Date (MM/YY)"
                style={inputStyle}
                onChange={(e) =>
                  setFormData({ ...formData, expiry: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="CVV"
                style={inputStyle}
                onChange={(e) =>
                  setFormData({ ...formData, cvv: e.target.value })
                }
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Mobile Account Number"
                style={inputStyle}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />
              <p style={{ fontSize: "14px", color: "#666", marginTop: "10px" }}>
                Send deposit directly to: <strong>0345-XXXXXXX</strong> (Easypaisa)
              </p>
            </>
          )}

          <button type="submit" style={buttonStyle}>
            Proceed with {method}
          </button>
        </form>
      )}

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}

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
