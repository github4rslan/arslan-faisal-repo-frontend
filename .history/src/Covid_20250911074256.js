import React, { useEffect, useState } from "react";
import api from "./api"; // ✅ your axios instance

export default function Covid() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load all countries
  useEffect(() => {
    api
      .get("/covid/countries")
      .then((res) => setCountries(res.data.response || []))
      .catch((err) => console.error(err));
  }, []);

  // Fetch stats for selected country
  const fetchStats = (country) => {
    setLoading(true);
    setStats(null);
    api
      .get(`/covid/stats/${country}`)
      .then((res) => {
        setStats(res.data.response?.[0] || null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>🦠 COVID-19 Dashboard</h1>

      {/* Country selector */}
      <select
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          fetchStats(e.target.value);
        }}
        style={{ padding: "10px", fontSize: "1rem", marginBottom: "20px" }}
      >
        <option value="">Select a country</option>
        {countries.map((c, idx) => (
          <option key={idx} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Loading */}
      {loading && <p>Loading stats...</p>}

      {/* Stats */}
      {stats && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            display: "inline-block",
            textAlign: "left",
          }}
        >
          <h2>{stats.country}</h2>
          <p><strong>Cases:</strong> {stats.cases?.total || "N/A"}</p>
          <p><strong>Deaths:</strong> {stats.deaths?.total || "N/A"}</p>
          <p><strong>Recovered:</strong> {stats.cases?.recovered || "N/A"}</p>
        </div>
      )}
    </div>
  );
}
