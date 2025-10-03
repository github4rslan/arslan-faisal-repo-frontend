import React, { useEffect, useState } from "react";
import api from "./api"; // Import the API instance you created

export default function Web3Page() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState(""); // Amount to send
  const [recipient, setRecipient] = useState(""); // Recipient address
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(""); // Status message for success or failure

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  // Get the balance of the connected account
  const getBalance = async () => {
    if (!account) return;

    setLoading(true);

    try {
      // Use the api instance to make the request
      const response = await api.get(`/web3/get-balance/${account}`);
      setBalance(response.data.balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }

    setLoading(false);
  };

  // Send payment via backend API
  const sendPayment = async () => {
    if (!account) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!recipient || !amount) {
      alert("Please provide both recipient address and amount.");
      return;
    }

    try {
      setLoading(true);

      // Call backend API to process the payment
      const response = await api.post("/web3/send-payment", {
        recipient,
        amount,
      });

      setStatusMessage(`Payment successful! Transaction Hash: ${response.data.txHash}`);
    } catch (error) {
      console.error("Error sending payment:", error);
      setStatusMessage("Error: Payment failed.");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🌐 Web3 Payment Integration</h1>

      {!account ? (
        <button onClick={connectWallet} style={buttonStyle}>
          Connect Wallet
        </button>
      ) : (
        <>
          <p>Connected Account: {account}</p>

          <button onClick={getBalance} style={buttonStyle}>
            {loading ? "Loading..." : "Get Balance"}
          </button>
          {balance && <p>Balance: {balance} ETH</p>}

          {/* Payment Form */}
          <div style={{ marginTop: "20px" }}>
            <h2>Send Payment</h2>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Recipient Address"
              style={inputStyle}
            />
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (ETH)"
              style={inputStyle}
            />
            <button onClick={sendPayment} style={buttonStyle}>
              Send Payment
            </button>
            {/* Status Message */}
            {statusMessage && <p>{statusMessage}</p>}
          </div>
        </>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "#4CAF50",
  color: "white",
  fontSize: "16px",
  borderRadius: "5px",
  cursor: "pointer",
  border: "none",
  marginTop: "20px",
};

const inputStyle = {
  padding: "10px",
  margin: "10px",
  fontSize: "16px",
  width: "300px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};
