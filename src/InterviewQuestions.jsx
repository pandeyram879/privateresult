import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./InterviewQuestions.css";

export default function InterviewQuestions() {
  const [qaList, setQaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Replace this URL with your Published CSV link
  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS9eQkmGy0yy-xvtVAvujUzqOy_B0N3JU_-4CofiBQecVX5zorSLHrkiWMpLzq8ibpBH1aNoBj4ydSS/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    setLoading(true);
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      complete: (result) => {
        const clean = result.data.filter((r) => r.Question && r.Answer);
        setQaList(clean);
        setLoading(false);
      },
      error: (err) => {
        console.error(err);
        setError("Failed to load questions.");
        setLoading(false);
      },
    });
  }, []);

  if (loading) return <div className="loading">Loading Questions…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="interview-container">
      <h1>💼 Job Interview Questions</h1>
      <div className="qa-list">
        {qaList.map((item, idx) => (
          <div key={idx} className="qa-card">
            <h2 className="question">Q{idx + 1}: {item.Question}</h2>
            <p className="answer">{item.Answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
