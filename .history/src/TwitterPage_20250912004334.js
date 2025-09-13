import React, { useState, useEffect } from "react";
import api from "./api"; // Import the Axios instance

const TwitterPage = () => {
  const [username, setUsername] = useState("MrBeast");
  const [userData, setUserData] = useState(null);
  const [replies, setReplies] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("get-user");

  // Fetching data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user data
        const userResponse = await api.post(`/twitter/get-user`, {
          username,
        });
        setUserData(userResponse.data);

        // Fetch replies
        const repliesResponse = await api.post(`/twitter/user-replies`, {
          user: "2455740283", // Example user ID
          count: 20,
        });
        setReplies(repliesResponse.data.timeline.instructions);

        // Fetch follower IDs (latest 500)
        const followersResponse = await api.get("/followers-ids", {
          params: { username: "mrbeast", count: "500" },
        });

        // Fetch follower details
        const followerDetails = await Promise.all(
          followersResponse.data.ids.map(async (followerId) => {
            const followerResponse = await api.get(`/user-info/${followerId}`);
            return followerResponse.data;
          })
        );

        setFollowers(followerDetails);
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]); // Added username to dependency array

  return (
    <div style={pageContainerStyle}>
      <h1 style={titleStyle}>Twitter Profile: {username}</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Profile Info */}
      {userData && selectedEndpoint === "get-user" && (
        <div style={profileCardStyle}>
          {/* Profile Banner */}
          {userData?.data?.result?.data?.user?.result?.profile_banner_url && (
            <div
              style={{
                backgroundImage: `url(${userData?.data?.result?.data?.user?.result?.profile_banner_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "250px",
                borderRadius: "10px",
                marginBottom: "20px",
              }}
            >
              <a
                href={userData?.data?.result?.data?.user?.result?.profile_banner_url}
                target="_blank"
                rel="noopener noreferrer"
                style={bannerLinkStyle}
              >
                View Profile Banner
              </a>
            </div>
          )}

          <div style={profileInfoStyle}>
            <img
              src={userData?.data?.result?.data?.user?.result?.avatar?.image_url}
              alt="Profile"
              style={profileImageStyle}
            />
            <div style={profileInfoContentStyle}>
              <h2 style={nameStyle}>
                {userData?.data?.result?.data?.user?.result?.core?.name}
              </h2>
              <p style={screenNameStyle}>
                @{userData?.data?.result?.data?.user?.result?.core?.screen_name}
              </p>
              <p>{userData?.data?.result?.data?.user?.result?.legacy?.description}</p>
              <div style={statsStyle}></div>
              <p>
                <strong>Profile URL:</strong>{" "}
                <a
                  href={userData?.data?.result?.data?.user?.result?.legacy?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                >
                  Visit Profile
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Replies Section */}
      <h2>🗨️ Recent Replies</h2>
      {replies.length > 0 ? (
        <div>
          {replies.map((entry, index) => (
            <div key={index} style={replyCardStyle}>
              <p>{entry.itemContent.tweet_results.result.legacy.full_text}</p>
              <p>Views: {entry.itemContent.tweet_results.result.views.count}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No replies found.</p>
      )}

      {/* Followers Section */}
      <h2>👥 Followers</h2>
      {followers.length > 0 ? (
        <div style={followersContainerStyle}>
          {followers.map((follower, index) => (
            <div key={index} style={followerCardStyle}>
              <img
                src={follower.avatarUrl} // Assuming you have avatar URL
                alt="Follower"
                style={followerImageStyle}
              />
              <p>
                {follower.name} (@{follower.screenName})
              </p>
              <a href={`https://twitter.com/${follower.screenName}`} target="_blank" rel="noopener noreferrer">
                View Profile
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p>No followers found.</p>
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
  flexDirection: "column",
  backgroundColor: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  padding: "30px",
  maxWidth: "800px",
  margin: "0 auto",
  marginTop: "20px",
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

const profileInfoContentStyle = {
  textAlign: "left",
};

const nameStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  color: "#333",
};

const screenNameStyle = {
  fontSize: "1.2rem",
  color: "#007bff",
  fontWeight: "bold",
};

const statsStyle = {
  marginTop: "20px",
  marginBottom: "20px",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "bold",
};

const bannerLinkStyle = {
  display: "block",
  backgroundColor: "#007bff",
  padding: "10px",
  textAlign: "center",
  color: "white",
  fontWeight: "bold",
  textDecoration: "none",
};

const replyCardStyle = {
  backgroundColor: "#f1f1f1",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "16px",
  color: "#333",
};

const followersContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "20px",
  marginTop: "20px",
};

const followerCardStyle = {
  backgroundColor: "#f1f1f1",
  borderRadius: "10px",
  padding: "15px",
  width: "200px",
  textAlign: "center",
};

const followerImageStyle = {
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  marginBottom: "10px",
};
