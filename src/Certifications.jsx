import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./Certifications.css";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Google Sheet CSV URL (Publish to Web → CSV link)
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQY92EkubYVIUCV6JKayuRisUlP7rPJIgGsrTXQ9HivcgiF0H3c1oCkO1_ngEt1ZhUiILpSye2gZLxF/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    setLoading(true);
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (result) => {
        const clean = result.data.filter(
          (row) => row.Title && row.Provider && row.Link
        );
        setCertifications(clean);
        setLoading(false);
      },
      error: (err) => {
        console.error("CSV Fetch Error:", err);
        setError("Failed to load certifications.");
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <div className="loading">⏳ Loading Certifications…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="certifications-container">
      <h1>📜 Popular Certification Courses</h1>
      <div className="certification-cards">
        {certifications.map((course, index) => (
          <a
            key={index}
            href={course.Link}
            target="_blank"
            rel="noopener noreferrer"
            className="cert-card"
          >
            <h2>{course.Title}</h2>
            <p>{course.Provider}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Certifications;
