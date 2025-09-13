import React, { useState } from "react";
import api from "./api"; // Import the Axios instance you created
import { Link } from "react-router-dom"; // Import Link for navigation

const TwitterPage = () => {
  const [username, setUsername] = useState("MrBeast");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Make the POST request to the /get-user endpoint
      const response = await api.post(`/twitter/get-user`, { username });
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

      {loading && <p style={loadingStyle}>Loading...</p>}
      {error && <p style={{ color: "red", fontSize: "18px" }}>{error}</p>}

      {/* Profile Info */}
      {userData && (
        <div style={profileCardStyle}>
          {/* Profile Banner Image */}
          {userData?.data?.result?.data?.user?.result?.profile_banner_url && (
            <div
              style={{
                backgroundImage: `url(${userData?.data?.result?.data?.user?.result?.profile_banner_url})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "250px",
                borderRadius: "10px",
                marginBottom: "20px",
                position: "relative", // Added relative positioning
              }}
            >
              {/* View Profile Banner Link */}
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

          {/* Profile Image */}
          <div style={profileInfoCardStyle}>
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

              {/* Profile Stats */}
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

              {/* Other Information */}
              <div style={extraInfoStyle}>
                <div>
                  <strong>Profile URL:</strong>{" "}
                  <a
                    href={userData?.data?.result?.data?.user?.result?.legacy?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    Visit Profile
                  </a>
                </div>
                <div>
                  <strong>Verified:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.verification?.verified
                    ? "Yes"
                    : "No"}
                </div>
                <div>
                  <strong>Super Follow Eligible:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.super_follow_eligible
                    ? "Yes"
                    : "No"}
                </div>
                <div>
                  <strong>Can DM:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.dm_permissions?.can_dm
                    ? "Yes"
                    : "No"}
                </div>
                <div>
                  <strong>Location:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.location?.location || "Not provided"}
                </div>
                <div>
                  <strong>Account Created At:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.core?.created_at}
                </div>
              </div>

              {/* Additional Professional Info */}
              <div style={extraInfoStyle}>
                <div>
                  <strong>Creator Type:</strong> {userData?.data?.result?.data?.user?.result?.professional?.category[0]?.name || "N/A"}
                </div>
                <div>
                  <strong>Tip Jar Enabled:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.tipjar_settings?.is_enabled
                    ? "Yes"
                    : "No"}
                </div>
                <div>
                  <strong>Creator Subscriptions:</strong>{" "}
                  {userData?.data?.result?.data?.user?.result?.creator_subscriptions_count || "0"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Button to go back to Dashboard */}
      <Link to="/" style={backToDashboardStyle}>
        Back to Dashboard
      </Link>
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

const extraInfoStyle = {
  marginTop: "20px",
  marginBottom: "20px",
  textAlign: "left",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "bold",
};

const bannerLinkStyle = {
  position: "absolute", // Fix the link positioning over the banner
  bottom: "10px",       // Place it at the bottom of the banner
  left: "50%",          // Center it horizontally
  transform: "translateX(-50%)", // Center the link exactly
  backgroundColor: "rgba(0, 123, 255, 0.7)", // Semi-transparent background
  padding: "10px 20px", // Padding for the link
  color: "white",       // White text color
  fontWeight: "bold",   // Bold text for emphasis
  borderRadius: "5px",  // Rounded corners for the link
  textDecoration: "none", // Remove underline
  textAlign: "center",  // Center the text inside the link
  fontSize: "16px",     // Font size for the link
};

const backToDashboardStyle = {
  display: "inline-block",
  marginTop: "20px",
  padding: "10px 20px",
  backgroundColor: "#28a745",
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  borderRadius: "5px",
};

