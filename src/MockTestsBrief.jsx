import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./MockTestsBrief.css";

export default function MockTestsBrief() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ वही Google Sheet publish-to-web CSV URL
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlvlIBlI07jW0y8UMSL1vo3tY7ts7elq1lSl0nX3--kjTHd4N0IodO9CAmkWVrWdczz3HJCjWw2ooo/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    setLoading(true);
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (result) => {
        // ✅ वही हेडर नाम चेक करें जो शीट में हैं
        const clean = result.data.filter(
          (row) => row["COMPANY NAME"] && row["LINK"]
        );
        setTests(clean);
        setLoading(false);
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
        setError("Failed to load mock tests.");
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <div className="loading">Loading Mock Tests…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="mockbrief-page">
      <h1 className="mockbrief-title">All Mock Tests</h1>
      <div className="mockbrief-list">
        {tests.map((test, i) => (
          <a
            key={i}
            href={test["LINK"]}
            target="_blank"
            rel="noopener noreferrer"
            className="mockbrief-item"
          >
            {test["COMPANY NAME"]} – Practice Now
          </a>
        ))}
      </div>
    </div>
  );
}
