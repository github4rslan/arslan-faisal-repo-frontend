import React, { useState, useEffect, useCallback } from "react";
import api from "./api"; // Import the API instance you created

export default function Web3Page() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // 'success', 'error', or 'info'
  const [txHash, setTxHash] = useState("");
  const [estimatedGas, setEstimatedGas] = useState(null);

  const clearStatus = useCallback(() => {
    setStatusMessage("");
    setStatusType("");
    setTxHash("");
    setEstimatedGas(null);
  }, []);

  const getBalance = useCallback(async () => {
    if (!account) return;

    setLoading(true);
    try {
      const response = await api.get(`/web3/get-balance/${account}`);
      setBalance(response.data.balance);
      setStatusMessage("Balance updated successfully!");
      setStatusType("success");
    } catch (error) {
      console.error("Error fetching balance:", error);
      setStatusMessage("Failed to fetch balance. Please try again.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  }, [account]);

  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setBalance(null);
      clearStatus();
    } else {
      setAccount(accounts[0]);
    }
  }, [clearStatus]);

  const handleChainChanged = useCallback(() => {
    // Reload the page when chain changes
    window.location.reload();
  }, []);

  const checkWalletConnection = useCallback(async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  }, []);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkWalletConnection();
    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [checkWalletConnection, handleAccountsChanged, handleChainChanged]);

  // Auto-fetch balance when account changes
  useEffect(() => {
    if (account) {
      getBalance();
    }
  }, [account, getBalance]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatusMessage("MetaMask is not installed. Please install MetaMask to continue.");
      setStatusType("error");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setStatusMessage("Wallet connected successfully!");
      setStatusType("success");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatusMessage("Failed to connect wallet. Please try again.");
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const estimateTransaction = async () => {
    if (!account || !recipient || !amount) return;

    try {
      const response = await api.post("/web3/create-transaction", {
        recipient,
        amount,
        senderAddress: account,
      });
      
      setEstimatedGas(response.data.estimatedGasFee);
      setStatusMessage(`Estimated gas fee: ${response.data.estimatedGasFee} ETH`);
      setStatusType("info");
    } catch (error) {
      console.error("Error estimating transaction:", error);
      setStatusMessage("Failed to estimate transaction cost.");
      setStatusType("error");
    }
  };

  const sendPayment = async () => {
    if (!account) {
      setStatusMessage("Please connect your wallet first.");
      setStatusType("error");
      return;
    }

    if (!recipient || !amount) {
      setStatusMessage("Please provide both recipient address and amount.");
      setStatusType("error");
      return;
    }

    // Validate recipient Ethereum address
    if (!isValidAddress(recipient)) {
      setStatusMessage("Invalid recipient Ethereum address.");
      setStatusType("error");
      return;
    }

    if (recipient.toLowerCase() === account.toLowerCase()) {
      setStatusMessage("You cannot send payment to your own address.");
      setStatusType("error");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setStatusMessage("Amount must be greater than 0.");
      setStatusType("error");
      return;
    }

    if (balance && parseFloat(amount) > parseFloat(balance)) {
      setStatusMessage("Insufficient balance.");
      setStatusType("error");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("Preparing transaction...");
      setStatusType("info");

      // Step 1: Create transaction data
      const transactionResponse = await api.post("/web3/create-transaction", {
        recipient,
        amount,
        senderAddress: account,
      });

      const { transactionObject } = transactionResponse.data;

      setStatusMessage("Please confirm the transaction in MetaMask...");

      // Step 2: Sign and send transaction via MetaMask
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionObject],
      });

      setTxHash(txHash);
      setStatusMessage("Transaction submitted! Waiting for confirmation...");
      setStatusType("info");

      // Step 3: Wait for confirmation
      await waitForTransaction(txHash);

    } catch (error) {
      console.error("Error sending payment:", error);
      if (error.code === 4001) {
        setStatusMessage("Transaction rejected by user.");
      } else if (error.message.includes("insufficient funds")) {
        setStatusMessage("Insufficient funds for gas fee.");
      } else {
        setStatusMessage(`Payment failed: ${error.message}`);
      }
      setStatusType("error");
    } finally {
      setLoading(false);
    }
  };

  const waitForTransaction = async (txHash) => {
    let attempts = 0;
    const maxAttempts = 30; // Wait up to 5 minutes (30 * 10s)

    const checkStatus = async () => {
      try {
        const response = await api.get(`/web3/transaction-status/${txHash}`);
        
        if (response.data.status === "success") {
          setStatusMessage(`Payment successful! Transaction confirmed in block ${response.data.blockNumber}`);
          setStatusType("success");
          getBalance(); // Refresh balance
          clearForm();
        } else if (response.data.status === "failed") {
          setStatusMessage("Transaction failed. Please try again.");
          setStatusType("error");
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(checkStatus, 10000); // Check every 10 seconds
        } else {
          setStatusMessage("Transaction is taking longer than expected. Check your transaction hash manually.");
          setStatusType("info");
        }
      } catch (error) {
        console.error("Error checking transaction status:", error);
        setStatusMessage("Could not verify transaction status. Please check manually.");
        setStatusType("error");
      }
    };

    setTimeout(checkStatus, 5000); // Initial check after 5 seconds
  };

  const isValidAddress = (address) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const clearForm = useCallback(() => {
    setAmount("");
    setRecipient("");
    setEstimatedGas(null);
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setBalance(null);
    clearStatus();
    clearForm();
  }, [clearStatus, clearForm]);

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>🌐 Web3 Payment Interface</h1>

        {!account ? (
          <div style={connectSectionStyle}>
            <p style={descriptionStyle}>
              Connect your MetaMask wallet to get started with Web3 payments
            </p>
            <button 
              onClick={connectWallet} 
              style={primaryButtonStyle}
              disabled={loading}
            >
              {loading ? "Connecting..." : "Connect MetaMask"}
            </button>
          </div>
        ) : (
          <div>
            {/* Account Info */}
            <div style={accountSectionStyle}>
              <div style={accountInfoStyle}>
                <p><strong>Connected Account:</strong></p>
                <p style={addressStyle}>{formatAddress(account)}</p>
                <p><strong>Balance:</strong> {balance || "Loading..."} ETH</p>
              </div>
              <div style={buttonGroupStyle}>
                <button onClick={getBalance} style={secondaryButtonStyle} disabled={loading}>
                  {loading ? "Loading..." : "Refresh Balance"}
                </button>
                <button onClick={disconnectWallet} style={disconnectButtonStyle}>
                  Disconnect
                </button>
              </div>
            </div>

            {/* Payment Form */}
            <div style={paymentSectionStyle}>
              <h2 style={sectionTitleStyle}>Send Payment</h2>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Recipient Address</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  style={inputStyle}
                />
              </div>

              <div style={inputGroupStyle}>
                <label style={labelStyle}>Amount (ETH)</label>
                <input
                  type="number"
                  step="0.001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  style={inputStyle}
                />
              </div>

              {recipient && amount && (
                <button 
                  onClick={estimateTransaction} 
                  style={secondaryButtonStyle}
                  disabled={loading}
                >
                  Estimate Gas Fee
                </button>
              )}

              {estimatedGas && (
                <div style={gasFeeStyle}>
                  <p><strong>Estimated Gas Fee:</strong> {estimatedGas} ETH</p>
                </div>
              )}

              <button 
                onClick={sendPayment} 
                style={primaryButtonStyle}
                disabled={loading || !recipient || !amount}
              >
                {loading ? "Processing..." : "Send Payment"}
              </button>
            </div>

            {/* Status Message */}
            {statusMessage && (
              <div style={{...statusStyle, ...getStatusColor(statusType)}}>
                <p>{statusMessage}</p>
                {txHash && (
                  <p style={txHashStyle}>
                    Transaction Hash: 
                    <a 
                      href={`https://etherscan.io/tx/${txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={linkStyle}
                    >
                      {formatAddress(txHash)}
                    </a>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  minHeight: "100vh",
  backgroundColor: "#f5f7fa",
  padding: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "40px",
  maxWidth: "600px",
  width: "100%",
};

const titleStyle = {
  textAlign: "center",
  color: "#2d3748",
  marginBottom: "30px",
  fontSize: "28px",
};

const connectSectionStyle = {
  textAlign: "center",
  padding: "40px 0",
};

const descriptionStyle = {
  color: "#718096",
  marginBottom: "30px",
  fontSize: "16px",
};

const accountSectionStyle = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "30px",
};

const accountInfoStyle = {
  marginBottom: "20px",
};

const addressStyle = {
  fontFamily: "monospace",
  backgroundColor: "#e2e8f0",
  padding: "8px 12px",
  borderRadius: "4px",
  display: "inline-block",
  fontSize: "14px",
};

const buttonGroupStyle = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const paymentSectionStyle = {
  marginBottom: "30px",
};

const sectionTitleStyle = {
  color: "#2d3748",
  marginBottom: "20px",
  fontSize: "20px",
};

const inputGroupStyle = {
  marginBottom: "20px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  color: "#4a5568",
  fontWeight: "500",
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  fontSize: "16px",
  border: "2px solid #e2e8f0",
  borderRadius: "8px",
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

const primaryButtonStyle = {
  backgroundColor: "#4299e1",
  color: "white",
  padding: "12px 24px",
  fontSize: "16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.2s",
  width: "100%",
  marginTop: "10px",
};

const secondaryButtonStyle = {
  backgroundColor: "#edf2f7",
  color: "#4a5568",
  padding: "10px 20px",
  fontSize: "14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const disconnectButtonStyle = {
  backgroundColor: "#fed7d7",
  color: "#c53030",
  padding: "10px 20px",
  fontSize: "14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

const gasFeeStyle = {
  backgroundColor: "#ebf8ff",
  border: "1px solid #bee3f8",
  borderRadius: "6px",
  padding: "12px",
  marginBottom: "20px",
};

const statusStyle = {
  padding: "16px",
  borderRadius: "8px",
  marginTop: "20px",
};

const txHashStyle = {
  marginTop: "10px",
  fontSize: "14px",
};

const linkStyle = {
  color: "#3182ce",
  textDecoration: "none",
  marginLeft: "8px",
};

const getStatusColor = (type) => {
  switch (type) {
    case "success":
      return { backgroundColor: "#f0fff4", border: "1px solid #9ae6b4", color: "#2f855a" };
    case "error":
      return { backgroundColor: "#fed7d7", border: "1px solid #feb2b2", color: "#c53030" };
    case "info":
      return { backgroundColor: "#ebf8ff", border: "1px solid #bee3f8", color: "#2b6cb0" };
    default:
      return { backgroundColor: "#f7fafc", border: "1px solid #e2e8f0", color: "#4a5568" };
  }
};