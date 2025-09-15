import React, { useState } from "react";
import api from "./api";

export default function TikTokDownloader() {
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rawResponse, setRawResponse] = useState(null); // debug panel (unchanged)

  const token = localStorage.getItem("auth_token");

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVideoUrl("");
    setRawResponse(null);

    if (!url) {
      setError("Please enter a TikTok URL");
      setLoading(false);
      return;
    }

    try {
      const headers = {};
      if (token) {
        headers.Authorization = token; // only include if available (unchanged)
      }

      const res = await api.post("/tiktok/download", { url }, { headers });

      setRawResponse(res.data); // save full backend response for debug (unchanged)

      if (res.data.videoUrl) {
        setVideoUrl(res.data.videoUrl);
      } else {
        setError("No downloadable video found");
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Failed to fetch video";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    const validUrl = /https:\/\/www\.tiktok\.com\/@[\w-]+\/video\/\d+/;
    setError(validUrl.test(value) ? "" : "Please enter a valid TikTok URL");
  };

  return (
    <div className="page">
      <main className="card" role="main">
        <header className="header">
          <div className="logo">🎵</div>
          <h1 className="title">TikTok Downloader</h1>
          <p className="subtitle">Paste a TikTok link and grab the video—no watermark*</p>
        </header>

        <form onSubmit={handleDownload} className="form">
          <label htmlFor="tiktokUrl" className="label">TikTok URL</label>
          <div className="inputRow">
            <input
              id="tiktokUrl"
              type="url"
              value={url}
              onChange={handleUrlChange}
              placeholder="https://www.tiktok.com/@user/video/…"
              className="input"
            />
            <button
              type="submit"
              disabled={loading}
              className={`btn ${loading ? "btn-loading" : ""}`}
            >
              {loading ? <div className="loading-spinner"></div> : "Download"}
            </button>
          </div>
        </form>

        {error && <p className="error">{error}</p>}

        {videoUrl && (
          <section className="result">
            <video className="video" src={videoUrl} controls />
            <a className="downloadLink" href={videoUrl} download>Download Video</a>
            <button className="shareBtn" onClick={() => navigator.share({ url: videoUrl })}>
              Share Video
            </button>
          </section>
        )}

        {rawResponse && (
          <section className="debug">
            <details open>
              <summary>🔎 Debug Response</summary>
              <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
            </details>
          </section>
        )}
      </main>

      <style>{`
        :root {
          --bg: #f7f7f7;
          --fg: #333;
          --muted: #777;
          --primary: #3f6df0;
          --card: rgba(255,255,255,0.95);
          --border: rgba(0,0,0,0.1);
          --error: #ff6b6b;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0;
          background: var(--bg);
          color: var(--fg);
        }

        .page {
          display: grid;
          place-items: center;
          min-height: 100vh;
          padding: 20px;
        }

        .card {
          background: var(--card);
          padding: 24px;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
          gap: 16px;
        }

        .logo {
          font-size: 32px;
          background: linear-gradient(45deg, #5b8cff, #3f6df0);
          padding: 8px;
          border-radius: 50%;
          color: white;
        }

        .title {
          margin: 0;
          font-size: 28px;
          color: var(--primary);
        }

        .subtitle {
          font-size: 14px;
          color: var(--muted);
        }

        .form {
          margin-top: 20px;
        }

        .label {
          font-size: 14px;
          color: var(--muted);
          margin-bottom: 8px;
        }

        .inputRow {
          display: flex;
          gap: 12px;
        }

        .input {
          width: 100%;
          height: 48px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: rgba(255, 255, 255, 0.1);
          color: var(--fg);
        }

        .btn {
          height: 48px;
          padding: 0 16px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: var(--primary);
          color: white;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .btn:hover {
          background: #335edf;
        }

        .btn:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .error {
          color: var(--error);
          background-color: rgba(255, 107, 107, 0.1);
          padding: 10px;
          border-radius: 8px;
          margin-top: 10px;
        }

        .result {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .video {
          max-width: 100%;
          border-radius: 8px;
        }

        .downloadLink {
          margin-top: 12px;
          padding: 10px 20px;
          border-radius: 8px;
          background: var(--primary);
          color: white;
          text-decoration: none;
        }

        .downloadLink:hover {
          background: #335edf;
        }

        .shareBtn {
          margin-top: 12px;
          padding: 10px 20px;
          border-radius: 8px;
          background: #1db954;
          color: white;
          cursor: pointer;
        }

        .shareBtn:hover {
          background: #1ed760;
        }

        .debug {
          margin-top: 20px;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 8px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 5px solid transparent;
          border-top: 5px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .card {
            padding: 16px;
          }

          .inputRow {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
