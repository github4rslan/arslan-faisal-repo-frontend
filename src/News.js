import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    setError(null); // Reset error

    try {
      // Using a CORS proxy to bypass CORS restrictions
      const res = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          "https://newsapi.org/v2/top-headlines?country=us&pageSize=10&apiKey=bc137755eac6456e886e66a71137a319" // Your News API key
        )}`
      );
      const data = await res.json();
      
      // Check if 'contents' exists and is not empty
      if (data.contents) {
        const newsData = JSON.parse(data.contents);

        // Check if newsData.articles is an array before setting state
        if (newsData.articles && Array.isArray(newsData.articles)) {
          setArticles(newsData.articles);
        } else {
          setError('Failed to load news articles');
        }
      } else {
        setError('Failed to fetch news data');
      }
    } catch (err) {
      setError("Error fetching news: " + err.message);
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
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
          {articles.length > 0 ? (
            articles.map((article, index) => (
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
            ))
          ) : (
            <p>No articles available</p>
          )}
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
