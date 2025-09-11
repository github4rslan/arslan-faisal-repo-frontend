import React, { useEffect, useState } from "react";
import api from "./api"; // ✅ your axios instance (baseURL=http://localhost:5000/api)

export default function Covid() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch countries on mount
  useEffect(() => {
    api
      .get("/covid/countries")
      .then((res) => {
        setCountries(res.data.response || []);
      })
      .catch((err) => {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries.");
      });
  }, []);

  // ✅ Fetch stats when user selects a country
  const fetchStats = async (country) => {
    setLoading(true);
    setError("");
    setStats(null);

    try {
      const res = await api.get(`/covid/stats/${country}`);
      setStats(res.data.response?.[0] || null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Failed to load stats.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1 style={{ marginBottom: "20px" }}>🦠 COVID-19 Tracker</h1>

      {/* Country Selector */}
      <select
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          fetchStats(e.target.value);
        }}
        style={{ padding: "10px", fontSize: "16px" }}
      >
        <option value="">Select a country</option>
        {countries.map((c, i) => (
          <option key={i} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Loading / Error */}
      {loading && <p style={{ marginTop: "20px" }}>⏳ Loading...</p>}
      {error && <p style={{ marginTop: "20px", color: "red" }}>{error}</p>}

      {/* Stats */}
      {stats && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            display: "inline-block",
            textAlign: "left",
          }}
        >
          <h2>{stats.country}</h2>
          <p>
            <strong>Population:</strong> {stats.population?.toLocaleString()}
          </p>
          <p>
            <strong>Total Cases:</strong> {stats.cases?.total?.toLocaleString()}
          </p>
          <p>
            <strong>Active:</strong> {stats.cases?.active?.toLocaleString()}
          </p>
          <p>
            <strong>Recovered:</strong> {stats.cases?.recovered?.toLocaleString()}
          </p>
          <p>
            <strong>Total Deaths:</strong> {stats.deaths?.total?.toLocaleString()}
          </p>
          <p>
            <strong>Total Tests:</strong> {stats.tests?.total?.toLocaleString()}
          </p>
          <p>
            <small>📅 Updated: {stats.day}</small>
          </p>
        </div>
      )}
    </div>
  );
}
