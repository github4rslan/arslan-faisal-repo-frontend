import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // ✅ Use the correct API key from World News API
  const API_KEY = "bc137755eac6456e886e66a71137a319"; // World News API key

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetchNews();
  }, [navigate]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null); // Reset any previous errors

    try {
      // Add a CORS proxy URL before your API endpoint
      const res = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://worldnewsapi.com/api/v1/top-headlines?country=us&pageSize=10&apiKey=${API_KEY}`
        )}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch news articles");
      }

      const data = await res.json();
      const newsData = JSON.parse(data.contents); // Parse the JSON response

      if (newsData.status === "ok") {
        setArticles(newsData.articles);  // Save articles if response is successful
      } else {
        setError("Error fetching news: " + newsData.message);
        setArticles([]);  // Clear articles in case of an error
      }
    } catch (err) {
      console.error("News fetch error:", err);
      setArticles([]);  // Clear articles in case of an error
      setError("There was an error fetching the news. Please try again later.");
    } finally {
      setLoading(false); // Stop loading after the API call
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1>📰 Latest News</h1>

      {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}

      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {articles.map((article, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                backgroundColor: "#fff",
                textAlign: "left",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt="news"
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
              <h3 style={{ fontSize: "18px", marginTop: "10px" }}>
                {article.title}
              </h3>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {article.description || "No description available."}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  color: "#007bff",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Read more →
              </a>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "30px",
          padding: "10px 20px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
