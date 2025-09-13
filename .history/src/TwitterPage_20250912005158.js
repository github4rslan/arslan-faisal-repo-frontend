import React, { useState } from "react";
import api from "./api"; // Import the Axios instance

const TwitterPage = () => {
  const [username, setUsername] = useState("MrBeast");
  const [userData, setUserData] = useState(null);
  const [tweetsData, setTweetsData] = useState(null);
  const [followersData, setFollowersData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEndpoint, setSelectedEndpoint] = useState("get-user");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      // Fetch data based on selected endpoint
      if (selectedEndpoint === "get-user") {
        response = await api.post(`/twitter/get-user`, { username });
        setUserData(response.data);
      } else if (selectedEndpoint === "get-user-tweets") {
        response = await api.post(`/twitter/get-user-tweets`, { username });
        setTweetsData(response.data);
      } else if (selectedEndpoint === "get-user-followers") {
        response = await api.post(`/twitter/get-user-followers`, { username });
        setFollowersData(response.data);
      }

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
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tweets */}
      {tweetsData && selectedEndpoint === "get-user-tweets" && (
        <div>
          <h2>Tweets</h2>
          <ul>
            {tweetsData?.data?.map((tweet, index) => (
              <li key={index} style={tweetStyle}>
                {tweet.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Followers */}
      {followersData && selectedEndpoint === "get-user-followers" && (
        <div>
          <h2>Followers</h2>
          <ul>
            {followersData?.data?.map((follower, index) => (
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
