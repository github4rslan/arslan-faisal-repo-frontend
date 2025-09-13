import React, { useState, useEffect } from "react";
import api from "./api";
import { useLocation } from "react-router-dom";

const UserTweetsCheck = () => {
  const [tweets, setTweets] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const user = location.state?.username;

  useEffect(() => {
    if (user) {
      setUsername(user);
      fetchTweets(user);
    }
  }, [user]);

  const fetchTweets = async (username) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/twitter/get-user-tweets`, { username });
      setTweets(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setError("Error fetching tweets");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (username) {
      fetchTweets(username);
    } else {
      setError("Please enter a valid username.");
    }
  };

  return (
    <div style={pageContainerStyle}>
      <h1 style={titleStyle}>Tweets of @{username}</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Twitter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
        Back to Twitter Profile
      </button>
    </div>
  );
};

export default UserTweetsCheck;

// Styles for the page
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

const rawDataStyle = {
  fontSize: "14px",
  color: "#777",
  whiteSpace: "pre-wrap", // Ensures JSON data is formatted correctly
  backgroundColor: "#f0f0f0",
  padding: "10px",
  borderRadius: "8px",
  marginTop: "10px",
  overflowX: "auto",
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
