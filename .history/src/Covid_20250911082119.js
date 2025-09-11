import React, { useEffect, useState } from "react";
import api from "./api";

export default function Covid() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
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

  // ✅ Fetch stats for a country
  const fetchStats = async (country) => {
    if (!country) return;
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

  // ✅ Handle search enter
  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      fetchStats(search.trim());
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f4f6f9",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ marginBottom: "30px", fontSize: "2.5rem" }}>
        🦠 COVID-19 Tracker
      </h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: "flex", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          list="countries"
          style={{
            padding: "12px 15px",
            borderRadius: "8px 0 0 8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            width: "280px",
          }}
        />
        <datalist id="countries">
          {countries.map((c, i) => (
            <option key={i} value={c} />
          ))}
        </datalist>
        <button
          type="submit"
          style={{
            padding: "12px 20px",
            borderRadius: "0 8px 8px 0",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Search
        </button>
      </form>

      {/* Loading / Error */}
      {loading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Stats Card */}
      {stats && (
        <div
          style={{
            marginTop: "20px",
            padding: "25px 30px",
            backgroundColor: "white",
            borderRadius: "15px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
            maxWidth: "400px",
            width: "100%",
            textAlign: "left",
          }}
        >
          <h2 style={{ marginBottom: "15px", fontSize: "1.8rem" }}>
            {stats.country}
          </h2>
          <p><strong>Population:</strong> {stats.population?.toLocaleString()}</p>
          <p><strong>Total Cases:</strong> {stats.cases?.total?.toLocaleString()}</p>
          <p><strong>Active:</strong> {stats.cases?.active?.toLocaleString()}</p>
          <p><strong>Recovered:</strong> {stats.cases?.recovered?.toLocaleString()}</p>
          <p><strong>Total Deaths:</strong> {stats.deaths?.total?.toLocaleString()}</p>
          <p><strong>Total Tests:</strong> {stats.tests?.total?.toLocaleString()}</p>
          <p style={{ marginTop: "10px", fontSize: "0.9rem", color: "gray" }}>
            📅 Updated: {stats.day}
          </p>
        </div>
      )}
    </div>
  );
}
