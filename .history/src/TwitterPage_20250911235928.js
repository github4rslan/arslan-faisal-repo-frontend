import React, { useEffect, useState } from "react";
import api from "../api";  // Import the Axios instance you created

const TwitterPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const username = "MrBeast"; // Example username, you can make this dynamic

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Use the centralized Axios instance for the API request
        const response = await api.get(`/get-user/${username}`);
        setUserData(response.data);
      } catch (err) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
          </div>
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
