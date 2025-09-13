import React, { useEffect, useState } from "react";
import api from "./api";  // Import the Axios instance you created

const TwitterPage = () => {
  const [username, setUsername] = useState("MrBeast"); // Default username
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("get-user"); // Default endpoint
  const [endpointData, setEndpointData] = useState(null);

  // Function to handle fetching data based on selected endpoint
  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      // Depending on selected endpoint, fetch data
      if (selectedEndpoint === "get-user") {
        response = await api.get(`/get-user/${username}`);
      } else if (selectedEndpoint === "get-user-tweets") {
        response = await api.get(`/get-user-tweets/${username}`);
      } else if (selectedEndpoint === "get-user-followers") {
        response = await api.get(`/get-user-followers/${username}`);
      }
      setUserData(response.data);
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username, selectedEndpoint]);

  const handleSearchChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEndpointChange = (e) => {
    setSelectedEndpoint(e.target.value);
  };

  return (
    <div style={pageContainerStyle}>
      <h1 style={titleStyle}>Twitter Profile Search</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter Twitter Username"
          value={username}
          onChange={handleSearchChange}
          style={searchInputStyle}
        />
        <button onClick={fetchUserData} style={searchButtonStyle}>
          Search
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <select
          value={selectedEndpoint}
          onChange={handleEndpointChange}
          style={dropdownStyle}
        >
          <option value="get-user">User Info</option>
          <option value="get-user-tweets">User Tweets</option>
          <option value="get-user-followers">User Followers</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {userData && selectedEndpoint === "get-user" && (
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

      {userData && selectedEndpoint === "get-user-tweets" && (
        <div>
          <h2>Tweets</h2>
          <ul>
            {userData?.data?.user?.result?.tweets?.map((tweet, index) => (
              <li key={index}>{tweet.text}</li>
            ))}
          </ul>
        </div>
      )}

      {userData && selectedEndpoint === "get-user-followers" && (
        <div>
          <h2>Followers</h2>
          <ul>
            {userData?.data?.user?.result?.followers?.map((follower, index) => (
              <li key={index}>{follower.name} (@{follower.screen_name})</li>
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
  fontSize: "2rem",
  marginBottom: "20px",
};

const searchInputStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginRight: "10px",
};

const searchButtonStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
};

const dropdownStyle = {
  padding: "10px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginTop: "10px",
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
