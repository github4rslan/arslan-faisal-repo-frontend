import React, { useState, useEffect } from "react";
import api from "./api"; // Axios instance for API calls
import { useLocation } from "react-router-dom"; // For retrieving the username from the URL or props

const UserTweetsCheck = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const username = location.state?.username; // Assuming you're passing the username as state

  useEffect(() => {
    if (username) {
      fetchTweets();
    }
  }, [username]);

  const fetchTweets = async () => {
    setLoading(true);
    setError(null);
    try {
      // Make the POST request to the /get-user-tweets endpoint
      const response = await api.post(`/twitter/get-user-tweets`, { username });
      setTweets(response.data.data); // Store the tweets data
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setError("Error fetching tweets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <h1 style={titleStyle}>Tweets of @{username}</h1>

      {loading && <p style={loadingStyle}>Loading tweets...</p>}
      {error && <p style={{ color: "red", fontSize: "18px" }}>{error}</p>}

      {/* Display Tweets */}
      {tweets.length > 0 ? (
        <div style={tweetsContainerStyle}>
          {tweets.map((tweet, index) => (
            <div key={index} style={tweetCardStyle}>
              <p style={tweetTextStyle}>{tweet.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No tweets found for this user.</p>
      )}

      {/* Back to Twitter Profile */}
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
