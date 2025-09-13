import React, { useState } from "react";
import api from "./api"; // Import the Axios instance you created

const TwitterPage = () => {
  const [username, setUsername] = useState("MrBeast");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("get-user");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Using the imported `api` instance for making the POST request
      const response = await api.post(`/twitter/${selectedEndpoint}`, {
        username,
      });

      setUserData(response.data); // Store the response data
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageContainerStyle}>
      <h1 style={titleStyle}>Twitter Profile Search</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Twitter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={searchInputStyle}
        />
        <button onClick={fetchData} style={searchButtonStyle}>
          Search
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedEndpoint}
          onChange={(e) => setSelectedEndpoint(e.target.value)}
          style={dropdownStyle}
        >
          <option value="get-user">User Info</option>
          <option value="get-user-tweets">User Tweets</option>
          <option value="get-user-followers">User Followers</option>
        </select>
      </div>

      {loading && <p style={loadingStyle}>Loading...</p>}
      {error && <p style={{ color: "red", fontSize: "18px" }}>{error}</p>}

      {/* Profile Info */}
      {userData && selectedEndpoint === "get-user" && (
        <div style={profileCardStyle}>
          {/* Profile Banner Link */}
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

          <div style={profileInfoCardStyle}>
            {/* Profile Image */}
            <img
              src={userData?.data?.result?.data?.user?.result?.avatar?.image_url}
              alt="Profile"
              style={profileImageStyle}
            />
            <div style={profileInfoStyle}>
              <h2 style={nameStyle}>
                {userData?.data?.result?.data?.user?.result?.core?.name}
              </h2>
              <p style={screenNameStyle}>
                @{userData?.data?.result?.data?.user?.result?.core?.screen_name}
              </p>
              <p style={descriptionStyle}>
                {userData?.data?.result?.data?.user?.result?.legacy?.description}
              </p>

              <div style={statsStyle}>
                <div>
                  <strong>Followers:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.legacy?.followers_count}
                </div>
                <div>
                  <strong>Following:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.legacy?.friends_count}
                </div>
                <div>
                  <strong>Tweets:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.legacy?.statuses_count}
                </div>
                <div>
                  <strong>Listed:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.legacy?.listed_count}
                </div>
                <div>
                  <strong>Favorites:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.legacy?.favourites_count}
                </div>
                <div>
                  <strong>Media:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.legacy?.media_count}
                </div>
              </div>

              {/* Profile URL */}
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

              {/* Verified Status */}
              <p>
                <strong>Verified:</strong>{" "}
                {userData?.data?.result?.data?.user?.result?.verification?.verified
                  ? "Yes"
                  : "No"}
              </p>

              {/* Super Follow Eligibility */}
              <p>
                <strong>Super Follow Eligible:</strong>{" "}
                {userData?.data?.result?.data?.user?.result?.super_follow_eligible
                  ? "Yes"
                  : "No"}
              </p>

              {/* DM Permissions */}
              <p>
                <strong>Can DM:</strong>{" "}
                {userData?.data?.result?.data?.user?.result?.dm_permissions?.can_dm
                  ? "Yes"
                  : "No"}
              </p>

              {/* Additional Info */}
              <p>
                <strong>Location:</strong>{" "}
                {userData?.data?.result?.data?.user?.result?.location?.location || "Not provided"}
              </p>
              <p>
                <strong>Account Created At:</strong>{" "}
                {userData?.data?.result?.data?.user?.result?.core?.created_at}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tweets */}
      {userData && selectedEndpoint === "get-user-tweets" && (
        <div>
          <h2>Tweets</h2>
          <ul>
            {userData?.data?.result?.data?.user?.result?.tweets?.map((tweet, index) => (
              <li key={index} style={tweetStyle}>
                {tweet.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Followers */}
      {userData && selectedEndpoint === "get-user-followers" && (
        <div>
          <h2>Followers</h2>
          <ul>
            {userData?.data?.result?.data?.user?.result?.followers?.map((follower, index) => (
              <li key={index} style={followerStyle}>
                {follower.name} (@{follower.screen_name})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TwitterPage;

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

const dropdownStyle = {
  padding: "12px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "10px",
  marginBottom: "20px",
};

const loadingStyle = {
  fontSize: "18px",
  color: "#007bff",
  fontWeight: "bold",
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

const profileInfoCardStyle = {
  display: "flex",
  alignItems: "center",
  marginTop: "20px",
};

const profileImageStyle = {
  borderRadius: "50%",
  width: "120px",
  height: "120px",
  marginRight: "20px",
  border: "3px solid #007bff",
};

const profileInfoStyle = {
  textAlign: "left",
  fontSize: "1.1rem",
  color: "#333",
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

const descriptionStyle = {
  fontStyle: "italic",
  color: "#777",
  marginBottom: "10px",
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

const tweetStyle = {
  backgroundColor: "#f1f1f1",
  padding: "10px",
  borderRadius: "8px",
  marginBottom: "15px",
  fontSize: "16px",
  color: "#333",
};

const followerStyle = {
  padding: "8px",
  backgroundColor: "#f1f1f1",
  borderRadius: "8px",
  marginBottom: "10px",
  fontSize: "16px",
  color: "#333",
};
