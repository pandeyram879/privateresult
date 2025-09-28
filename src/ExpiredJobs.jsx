import React, { useEffect, useState } from "react";
import "./ExpiredJobs.css";

export default function ExpiredJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1Cfm8Sn2dkJZ8kMJJ4oHCRTbkW-XCZkRG7fxxza59ORZm0EaEZkJbSLePgWPONWY84j9VSH5qs4Qc/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    async function fetchExpired() {
      try {
        const res = await fetch(CSV_URL);
        const text = await res.text();

        const rows = text.split("\n").map(r => r.split(","));
        const headers = rows[0].map(h => h.trim());
        const data = rows.slice(1).map(row =>
          headers.reduce((acc, h, i) => {
            acc[h] = row[i]?.trim();
            return acc;
          }, {})
        );

        const today = new Date();

        const expired = data.filter(j => {
          const d = j.LastDate?.trim();
          if (!d) return false;

          // parse DD/MM/YYYY or YYYY-MM-DD
          const parts = d.includes("/") ? d.split("/") : d.split("-");
          let lastDate;
          if (parts.length === 3 && d.includes("/")) {
            lastDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
          } else {
            lastDate = new Date(d);
          }

          // expired but within last 21 days
          const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);
          return diffDays > 0 && diffDays <= 21;
        });

        setJobs(expired);
      } catch (e) {
        console.error(e);
        setError("Failed to load expired jobs.");
      } finally {
        setLoading(false);
      }
    }

    fetchExpired();
  }, []);

  if (loading) return <p className="loading">Loading expired jobs…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="expired-page">
      <h1 className="expired-title">Expired Jobs (Last 21 Days)</h1>
      {jobs.length === 0 ? (
        <p>No expired jobs in the last 21 days.</p>
      ) : (
        <table className="expired-table">
          <thead>
            <tr>
              <th>Post Name</th>
              <th>Department</th>
              <th>Last Date</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, i) => (
              <tr key={i}>
                <td>{job.Post}</td>
                <td>{job.Department}</td>
                <td>{job.LastDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
