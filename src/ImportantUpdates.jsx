import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./ImportantUpdates.css";

export default function ImportantUpdates() {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Replace with your published Google Sheet CSV link
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQLXatQlFh2g-SeUX6s8NPEUUy7lfft4_lfSUkmgGS5RclJ1n3iKQE6TdRYtg0ecCOavXbniqvLrhIs/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    setLoading(true);
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (result) => {
        const clean = result.data.filter((r) => r.Title && r.Description);
        setUpdates(clean);
        setLoading(false);
      },
      error: (err) => {
        console.error(err);
        setError("Failed to load updates.");
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <div className="loading">Loading Updates…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="updates-container">
      <h1>📢 Important Updates</h1>
      <div className="updates-list">
        {updates.map((u, idx) => (
          <div key={idx} className="update-card">
            <h2>{u.Title}</h2>
            <p className="date">{u.Date}</p>
            <p>{u.Description}</p>
            {u.Link && (
              <a href={u.Link} target="_blank" rel="noopener noreferrer">
                Read More →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
