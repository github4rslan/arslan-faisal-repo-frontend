import React, { useState, useEffect } from "react";
import api from "./api";
import { useLocation } from "react-router-dom";

const UserTweetsCheck = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const userId = location.state?.userId; // get userId from previous page

  useEffect(() => {
    if (userId) {
      fetchTweets(userId);
    }
  }, [userId]);

  const fetchTweets = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/twitter/get-user-tweets`, { userId });
      setTweets(response.data.data || []);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setError("Error fetching tweets");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <h1 style={titleStyle}>Tweets</h1>

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

// styles
const pageContainerStyle = { padding: "20px", textAlign: "center", backgroundColor: "#f9f9f9" };
const titleStyle = { fontSize: "2.5rem", fontWeight: "bold", marginBottom: "20px", color: "#333" };
const loadingStyle = { fontSize: "18px", color: "#007bff", fontWeight: "bold" };
const tweetsContainerStyle = { marginTop: "20px" };
const tweetCardStyle = { backgroundColor: "#f1f1f1", padding: "10px", borderRadius: "8px", marginBottom: "15px", fontSize: "16px", color: "#333", textAlign: "left" };
const tweetTextStyle = { fontSize: "16px", color: "#333" };
const backButtonStyle = { marginTop: "20px", padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", transition: "background-color 0.3s" };
