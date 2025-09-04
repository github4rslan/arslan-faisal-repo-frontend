import React, { useEffect, useState } from "react";
import axios from "axios";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use your new generated API key here
  const API_KEY = "bc137755eac6456e886e66a71137a319";  // Replace with your new API key

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null); // Reset error

      try {
        const response = await axios.get(
          `https://worldnewsapi.com/api/v1/top-headlines?country=us&pageSize=10&apiKey=${API_KEY}`
        );

        // Check if the response status is okay
        if (response.status === 200 && response.data.status === "ok") {
          setArticles(response.data.articles); // Set articles if successful
        } else {
          setError("Error fetching news: " + response.data.message);
        }
      } catch (err) {
        setError("There was an error fetching the news. Please try again later.");
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false); // Stop loading after the request
      }
    };

    fetchNews();
  }, []);

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
        onClick={() => window.location.href = "/dashboard"}
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
};

export default News;
