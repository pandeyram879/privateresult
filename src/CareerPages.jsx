import { useEffect, useState } from "react";
import "./CareerPages.css";

export default function CareerPages() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("All");

  // Google Sheet CSV
  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRAQVgrlA6rGrSuJzCs0AEHm4fyFF-S3wy86iR1ZuYzx7lcU5iHgW85fLFLZQnd8aTeKI6A9SLjNqC-/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    // fetch only once on mount
    fetch(`${csvUrl}&nocache=${Date.now()}`)
      .then((res) => res.text())
      .then((csvText) => {
        const rows = csvText.split("\n").map((row) => row.split(","));
        const headers = rows[0];
        const data = rows.slice(1).map((row) => {
          let obj = {};
          headers.forEach((header, i) => {
            obj[header.trim()] = row[i]?.trim();
          });
          return obj;
        });
        setCompanies(
          data.sort((a, b) => a["COMPANY NAME"].localeCompare(b["COMPANY NAME"]))
        );
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching CSV:", err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []); // ✅ empty array → fetch only once

  const categories = ["All", ...new Set(companies.map(c => c.CATEGORY))];
  const filtered = category === "All" ? companies : companies.filter(c => c.CATEGORY === category);

  if (loading) return <p className="loading">Loading jobs…</p>;
  if (error)
    return (
      <div className="error-container">
        <p className="error">{error}</p>
        <button className="retry-btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );

  return (
    <div className="career-page">
      <h1 className="career-title">🌐 Tech Companies Career Pages</h1>

      <div className="career-filter">
        <label htmlFor="category">Filter by Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="career-grid">
        {filtered.map((company, index) => (
          <a
            key={index}
            href={company.LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="career-card"
          >
            <img
              src={company.LOGO}
              alt={company["COMPANY NAME"]}
              className="career-logo"
            />
            <span>{company["COMPANY NAME"]}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
