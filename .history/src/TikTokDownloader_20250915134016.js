import React, { useState } from "react";
import api from "./api";
import { TextField, Button, CircularProgress, Alert, Typography, Box } from '@mui/material';

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
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#E8F1F5">
      <Box
        component="form"
        onSubmit={handleDownload}
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: { xs: "90%", sm: "400px" },
          transition: "all 0.3s ease",
          ":hover": {
            boxShadow: 10
          },
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: "#3f6df0" }}>
          TikTok Downloader
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
          Paste a TikTok link and grab the video—no watermark*
        </Typography>

        <TextField
          label="TikTok URL"
          variant="outlined"
          fullWidth
          value={url}
          onChange={handleUrlChange}
          error={Boolean(error)}
          helperText={error}
          sx={{ marginBottom: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          type="submit"
          disabled={loading}
          sx={{
            padding: 1.5,
            backgroundColor: "#3f6df0",
            ":hover": {
              backgroundColor: "#335edf",
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Download"}
        </Button>

        {videoUrl && (
          <Box marginTop={3}>
            <video controls width="100%" src={videoUrl} />
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              href={videoUrl}
              download
              sx={{ marginTop: 2 }}
            >
              Download Video
            </Button>
            <Button
              variant="outlined"
              color="success"
              fullWidth
              sx={{ marginTop: 1 }}
              onClick={() => navigator.share({ url: videoUrl })}
            >
              Share Video
            </Button>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}

        {rawResponse && (
          <Box marginTop={3}>
            <details open>
              <summary>🔎 Debug Response</summary>
              <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
            </details>
          </Box>
        )}
      </Box>
    </Box>
  );
}
