import React, { useEffect, useState } from "react";
import api from "./api"; // Import the API instance you created

export default function Web3Page() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🌐 Web3 Integration</h1>
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
};
