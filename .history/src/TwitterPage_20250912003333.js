import React, { useEffect, useState } from "react";
import api from "./api";  // Import the Axios instance

const TwitterPage = () => {
  const [userData, setUserData] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const username = "MrBeast"; // Example username

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user data
        const userResponse = await api.get(`/get-user/${username}`);
        setUserData(userResponse.data);

        // Fetch user replies (20 latest)
        const repliesResponse = await api.get(`/user-replies?user=2455740283&count=20`);
        setReplies(repliesResponse.data.timeline.instructions);
      } catch (err) {
        setError("Error fetching user data or replies");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={pageContainerStyle}>
      <h1 style={titleStyle}>Twitter Profile: {username}</h1>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {userData && (
        <div style={profileCardStyle}>
          <img
            src={userData?.data?.user?.result?.avatar?.image_url}
            alt="Profile"
            style={profileImageStyle}
          />
          <div style={profileInfoStyle}>
            <h2>{userData?.data?.user?.result?.core?.name}</h2>
            <p>@{userData?.data?.user?.result?.core?.screen_name}</p>
            <p>{userData?.data?.user?.result?.core?.description}</p>
            <p>Followers: {userData?.data?.user?.result?.followers_count}</p>
            <p>Following: {userData?.data?.user?.result?.friends_count}</p>
            <p>
              Profile Banner:{" "}
              <a href={userData?.data?.user?.result?.legacy?.profile_banner_url} target="_blank" rel="noopener noreferrer">
                Click to view banner
              </a>
            </p>
          </div>
        </div>
      )}

      <h2>🗨️ Recent Replies</h2>

      {replies.length > 0 ? (
        <div style={repliesContainerStyle}>
          {replies.map((entry, index) => (
            <div key={index} style={replyCardStyle}>
              <p>{entry.itemContent.tweet_results.result.legacy.full_text}</p>
              <p>Retweets: {entry.itemContent.tweet_results.result.legacy.retweet_count} | Replies: {entry.itemContent.tweet_results.result.legacy.reply_count}</p>
              <p>Views: {entry.itemContent.tweet_results.result.views.count}</p>
              {entry.itemContent.tweet_results.result.legacy.entities.media && entry.itemContent.tweet_results.result.legacy.entities.media.length > 0 && (
                <img
                  src={entry.itemContent.tweet_results.result.legacy.entities.media[0].media_url_https}
                  alt="Tweet Media"
                  style={mediaImageStyle}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No replies found.</p>
      )}
    </div>
  );
};

export default TwitterPage;

// Styles
const pageContainerStyle = {
  padding: "20px",
  textAlign: "center",
  backgroundColor: "#f9f9f9",
};

const titleStyle = {
  fontSize: "2rem",
  marginBottom: "20px",
};

const profileCardStyle = {
  display: "flex",
  justifyContent: "center",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  padding: "20px",
  maxWidth: "800px",
  margin: "0 auto",
};

const profileImageStyle = {
  borderRadius: "50%",
  width: "120px",
  height: "120px",
  marginRight: "20px",
};

const profileInfoStyle = {
  textAlign: "left",
  fontSize: "1.1rem",
};

const repliesContainerStyle = {
  marginTop: "20px",
  textAlign: "left",
  maxWidth: "800px",
  margin: "0 auto",
};

const replyCardStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  padding: "10px",
  marginBottom: "15px",
};

const mediaImageStyle = {
  width: "100%",
  borderRadius: "10px",
  marginTop: "10px",
};

