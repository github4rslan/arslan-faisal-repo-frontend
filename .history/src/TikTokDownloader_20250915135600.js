import React, { useState } from "react";
import api from "./api";
import { TextField, Button, CircularProgress, Alert, Typography, Box, Collapse, Tooltip } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export default function TikTokDownloader() {
  const [url, setUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [nextVideoUrl, setNextVideoUrl] = useState(""); // To store the next video URL
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [rawResponse, setRawResponse] = useState(null); // debug panel (unchanged)
  const [debugOpen, setDebugOpen] = useState(false); // control debug panel visibility

  const token = localStorage.getItem("auth_token");

  const handleDownload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setVideoUrl("");
    setRawResponse(null);
    setShowGuide(false);  // Hide the guide after clicking download button

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
        setNextVideoUrl(res.data.nextVideoUrl || ""); // Store next video URL (if available)
      } else {
        setError("No downloadable video found");
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || "Failed to fetch video";
      setError(msg);
    } finally {
      // Wait for 5-7 seconds after video URL is fetched
      setTimeout(() => {
        setShowGuide(true);  // Show the guide after the wait
        setLoading(false);
      }, 5000);  // 5 seconds wait
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    const validUrl = /https:\/\/www\.tiktok\.com\/@[\w-]+\/video\/\d+/;
    setError(validUrl.test(value) ? "" : "Please enter a valid TikTok URL");
  };

  const handleDownloadNext = async () => {
    if (!nextVideoUrl) {
      setError("No next video available.");
      return;
    }
    setUrl(nextVideoUrl); // Set the next video URL to trigger a download
    await handleDownload(new Event('submit')); // Trigger the download for the next video
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#FDEAEA">
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
            boxShadow: 12,
          },
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ color: "#E74C3C" }}>
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
          sx={{
            marginBottom: 2,
            borderRadius: 2,
            backgroundColor: "#F4F6F9",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
            "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#E74C3C", // Red border on focus
            },
            "&:hover .MuiOutlinedInput-root": {
              boxShadow: "0 0 10px rgba(231, 76, 60, 0.6)", // Glow effect on hover (Red)
            },
          }}
        />

        <Tooltip title="Download the video" placement="top">
          <Button
            variant="contained"
            color="error" // Red color for the download button
            fullWidth
            type="submit"
            disabled={loading}
            sx={{
              padding: 1.5,
              backgroundColor: "#E74C3C", // Red color
              ":hover": {
                backgroundColor: "#C0392B", // Darker red on hover
              },
            }}
            startIcon={<DownloadIcon />}
          >
            {loading ? <CircularProgress size={24} /> : "Download"}
          </Button>
        </Tooltip>

        {videoUrl && (
          <Box marginTop={3} sx={{ padding: 2 }}>
            <video controls width="100%" src={videoUrl} />
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 2 }}>
              <Button
                variant="outlined"
                color="error" // Red color for the button
                fullWidth
                href={videoUrl}
                download
              >
                Download Video
              </Button>
              <Button
                variant="outlined"
                color="success"
                fullWidth
                onClick={() => navigator.share({ url: videoUrl })}
              >
                Share Video
              </Button>
              {nextVideoUrl && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleDownloadNext}
                  sx={{ marginTop: 2 }}
                >
                  Download Next Video
                </Button>
              )}
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ marginTop: 2 }}>
            {error}
          </Alert>
        )}

        {showGuide && (
          <Box sx={{ marginTop: 2, padding: 2, backgroundColor: "#F9EBEA", borderRadius: 1 }}>
            <Typography variant="body1" color="textSecondary">
              <strong>Guide:</strong> Please wait for 5 to 7 seconds. Then click the 3 dots on the video preview, and you will see the "Download" button. Click on it, and your video will start downloading!
            </Typography>
          </Box>
        )}

        <Button
          variant="text"
          color="info"
          fullWidth
          onClick={() => setDebugOpen((prev) => !prev)}
          sx={{ marginTop: 2 }}
        >
          {debugOpen ? "Hide Debug" : "Show Debug"}
        </Button>

        <Collapse in={debugOpen}>
          {rawResponse && (
            <Box marginTop={3}>
              <details open>
                <summary>🔎 Debug Response</summary>
                <pre>{JSON.stringify(rawResponse, null, 2)}</pre>
              </details>
            </Box>
          )}
        </Collapse>
      </Box>
    </Box>
  );
}
