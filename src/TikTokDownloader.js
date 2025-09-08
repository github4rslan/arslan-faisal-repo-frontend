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

      const res = await api.post(
        "/tiktok/download",
        { url },
        { headers }
      );

      setRawResponse(res.data); // save full backend response for debug (unchanged)

      if (res.data.videoUrl) {
        setVideoUrl(res.data.videoUrl);
      } else {
        setError("No downloadable video found");
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Failed to fetch video";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="backdrop" />
      <main className="card" role="main">
        <header className="header">
          <div className="logo">🎵</div>
          <div>
            <h1 className="title">TikTok Downloader</h1>
            <p className="subtitle">Paste a TikTok link and grab the video—no watermark*</p>
          </div>
        </header>

        <form onSubmit={handleDownload} className="form" aria-label="Download TikTok video">
          <label htmlFor="tiktokUrl" className="label">TikTok URL</label>
          <div className="inputRow">
            <input
              id="tiktokUrl"
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@user/video/…"
              className="input"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "errorText" : undefined}
            />
            <button
              type="submit"
              disabled={loading}
              className={`btn ${loading ? "btn-loading" : ""}`}
              aria-busy={loading}
            >
              {loading ? (
                <span className="spinner" aria-hidden="true" />
              ) : (
                <span className="btnIcon" aria-hidden>⬇</span>
              )}
              {loading ? "Fetching" : "Download"}
            </button>
          </div>
        </form>

        {error && (
          <p id="errorText" className="error" role="alert">{error}</p>
        )}

        {videoUrl && (
          <section className="result">
            <video className="video" src={videoUrl} controls playsInline />
            <a className="downloadLink" href={videoUrl} download>
              <span className="btnGhostIcon" aria-hidden>💾</span> Download Video
            </a>
          </section>
        )}

        {rawResponse && (
          <section className="debug">
            <details open>
              <summary>🔎 Debug Response</summary>
              <pre className="codeblock">{JSON.stringify(rawResponse, null, 2)}</pre>
            </details>
            <p className="footnote">* If your backend removes watermarks.</p>
          </section>
        )}
      </main>

      {/* Styles: purely cosmetic; no functional changes */}
      <style>{`
        :root {
          --bg: #0b0f1a;
          --fg: #e6eaf2;
          --muted: #9aa4b2;
          --primary: #5b8cff;
          --primary-600: #3f6df0;
          --primary-700: #335edf;
          --card: rgba(255,255,255,0.06);
          --border: rgba(255,255,255,0.12);
          --error: #ff6b6b;
          --success: #30d158;
          --shadow: 0 10px 30px rgba(0,0,0,0.35);
        }

        @media (prefers-color-scheme: light) {
          :root {
            --bg: #f6f8fb;
            --fg: #0b0f1a;
            --muted: #667085;
            --card: rgba(255,255,255,0.8);
            --border: rgba(15,23,42,0.08);
          }
        }

        * { box-sizing: border-box; }
        html, body, #root { height: 100%; }
        body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji"; color: var(--fg); background: var(--bg); }

        .page {
          position: relative; min-height: 100vh; display: grid; place-items: center; padding: 24px;
        }
        .backdrop {
          position: absolute; inset: 0; background: radial-gradient(1200px 600px at 10% 10%, rgba(91,140,255,0.25), transparent),
                                     radial-gradient(1000px 500px at 90% 90%, rgba(48,209,88,0.20), transparent),
                                     radial-gradient(800px 400px at 70% 20%, rgba(255,99,132,0.18), transparent);
          filter: blur(40px); opacity: 0.9; pointer-events: none;
        }

        .card {
          position: relative; width: 100%; max-width: 720px; padding: 28px; border-radius: 20px; border: 1px solid var(--border);
          background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)) , var(--card);
          backdrop-filter: saturate(140%) blur(12px); box-shadow: var(--shadow);
        }

        .header { display: flex; align-items: center; gap: 16px; margin-bottom: 18px; }
        .logo { width: 48px; height: 48px; display: grid; place-items: center; font-size: 26px; border-radius: 12px; background:
          radial-gradient(120% 120% at 0% 0%, #7aa2ff 0%, #5b8cff 30%, #6fdc8c 100%); box-shadow: inset 0 -6px 20px rgba(0,0,0,0.2);
        }
        .title { margin: 0; font-size: 24px; letter-spacing: -0.02em; background: linear-gradient(90deg, #fff, #b8c7ff, #bdf0ce);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .subtitle { margin: 4px 0 0 0; color: var(--muted); font-size: 14px; }

        .form { margin-top: 14px; }
        .label { display: block; margin: 0 0 8px 4px; font-size: 12px; color: var(--muted); }
        .inputRow { display: grid; grid-template-columns: 1fr auto; gap: 12px; }

        .input { width: 100%; height: 48px; padding: 0 14px; border-radius: 12px; border: 1px solid var(--border); background: rgba(0,0,0,0.2);
          color: var(--fg); outline: none; transition: box-shadow .2s, border-color .2s, transform .06s;
        }
        .input::placeholder { color: #94a3b8; }
        .input:focus { border-color: var(--primary); box-shadow: 0 0 0 6px rgba(91,140,255,0.15); }
        .input:active { transform: translateY(0.5px); }

        .btn { height: 48px; padding: 0 18px; border: 1px solid transparent; border-radius: 12px; background: linear-gradient(135deg, var(--primary), var(--primary-600));
          color: white; font-weight: 600; display: inline-grid; grid-auto-flow: column; align-items: center; gap: 10px; cursor: pointer;
          transition: transform .08s ease, box-shadow .2s ease, filter .2s ease; box-shadow: 0 10px 20px rgba(91,140,255,0.35);
        }
        .btn:hover { filter: brightness(1.05); box-shadow: 0 14px 26px rgba(91,140,255,0.45); }
        .btn:active { transform: translateY(1px) scale(0.995); }
        .btn:disabled { cursor: not-allowed; filter: saturate(0.85) grayscale(0.1) opacity(0.9); box-shadow: none; }
        .btnIcon { display: inline-block; transform: translateY(-1px); }

        .spinner { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%;
          animation: spin 1s linear infinite; margin-right: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .error { margin: 14px 2px 0; color: var(--error); background: rgba(255,107,107,0.08); border: 1px solid rgba(255,107,107,0.25);
          padding: 10px 12px; border-radius: 12px; font-size: 14px; }

        .result { margin-top: 20px; display: grid; gap: 12px; }
        .video { width: 100%; border-radius: 16px; border: 1px solid var(--border); overflow: hidden; box-shadow: var(--shadow);
          background: #000; }
        .downloadLink { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; color: var(--primary);
          padding: 10px 14px; border-radius: 12px; border: 1px solid var(--border); background: rgba(91,140,255,0.08);
          text-decoration: none; width: fit-content; transition: transform .08s, box-shadow .2s, background .2s; }
        .downloadLink:hover { transform: translateY(-1px); box-shadow: 0 10px 18px rgba(0,0,0,0.12); background: rgba(91,140,255,0.12); }

        .debug { margin-top: 24px; }
        details { border: 1px dashed var(--border); border-radius: 14px; padding: 12px 14px; background: rgba(255,255,255,0.04); }
        summary { cursor: pointer; font-weight: 600; }
        .codeblock { margin: 12px 0 0; padding: 14px; border-radius: 12px; overflow-x: auto; white-space: pre-wrap; word-break: break-word;
          background: #0a0f18; color: #d6e3ff; border: 1px solid #182136; }

        .footnote { margin: 8px 2px 0; color: var(--muted); font-size: 12px; }

        @media (max-width: 520px) {
          .inputRow { grid-template-columns: 1fr; }
          .btn { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
}
