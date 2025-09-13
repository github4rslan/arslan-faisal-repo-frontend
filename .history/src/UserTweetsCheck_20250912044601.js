import React, { useState } from "react";
import api from "./api";

const UserTweetsCheck = () => {
  const [tweets, setTweets] = useState([]);
  const [userId, setUserId] = useState(""); // store input userId
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTweets = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/twitter/get-user-tweets`, { userId: id });
      setTweets(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setError("Error fetching tweets");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (userId.trim()) {
      fetchTweets(userId.trim());
    } else {
      setError("Please enter a valid userId.");
    }
  };

  return (
    <div style={pageContainerStyle}>
      <h1 style={titleStyle}>Tweets</h1>

      {/* Search Bar */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Twitter userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={searchInputStyle}
        />
        <button onClick={handleSearch} style={searchButtonStyle}>
          Search
        </button>
      </div>

      {loading && <p style={loadingStyle}>Loading tweets...</p>}
      {error && <p style={{ color: "red", fontSize: "18px" }}>{error}</p>}

      {tweets.length > 0 ? (
        <div style={tweetsContainerStyle}>
          {tweets.map((tweet) => (
            <div key={tweet.id} style={tweetCardStyle}>
              <p style={tweetTextStyle}>
                <strong>Tweet:</strong> {tweet.text}
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                {new Date(tweet.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No tweets found for this user.</p>
      )}

      <button onClick={() => window.history.back()} style={backButtonStyle}>
        Back
      </button>
    </div>
  );
};

export default UserTweetsCheck;

// Styles
const pageContainerStyle = {
  padding: "20px",
  textAlign: "center",
  backgroundColor: "#f9f9f9",
};

const titleStyle = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#333",
};

const searchInputStyle = {
  padding: "12px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginRight: "10px",
  marginBottom: "20px",
  width: "250px",
};

const searchButtonStyle = {
  padding: "12px 25px",
  fontSize: "16px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const loadingStyle = {
  fontSize: "18px",
  color: "#007bff",
  fontWeight: "bold",
};

const tweetsContainerStyle = {
  marginTop: "20px",
};

const tweetCardStyle = {
  backgroundColor: "#f1f1f1",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "16px",
  color: "#333",
  textAlign: "left",
};

const tweetTextStyle = {
  fontSize: "16px",
  color: "#333",
};

const backButtonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};
