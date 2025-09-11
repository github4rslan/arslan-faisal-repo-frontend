import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Covid() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const options = {
      method: "GET",
      url: "https://covid-193.p.rapidapi.com/countries",
      headers: {
        "x-rapidapi-key": "YOUR_RAPIDAPI_KEY", // ⚠️ move to .env in real project
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then((response) => {
        setCountries(response.data.response || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>🦠 COVID-19 Countries</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {countries.map((c, idx) => (
            <li
              key={idx}
              style={{
                margin: "8px 0",
                padding: "10px",
                backgroundColor: "#f0f0f0",
                borderRadius: "6px",
                maxWidth: "400px",
                marginInline: "auto",
              }}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
