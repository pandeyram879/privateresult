import { useEffect, useState } from "react";
import "./JobListingsBrief.css";

export default function JobListingsBrief() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1Cfm8Sn2dkJZ8kMJJ4oHCRTbkW-XCZkRG7fxxza59ORZm0EaEZkJbSLePgWPONWY84j9VSH5qs4Qc/pub?gid=0&single=true&output=csv";

  const parseDate = (str) => {
    if (!str) return null;
    const trimmed = str.trim();
    let d = new Date(trimmed);
    if (!isNaN(d)) return d;
    const parts = trimmed.split("/");
    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      return new Date(`${yyyy}-${mm}-${dd}T23:59:59`);
    }
    return null;
  };

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await fetch(CSV_URL);
        const text = await res.text();

        const rows = text.split("\n").map((r) => r.split(","));
        const headers = rows[0];
        const data = rows.slice(1).map((row) =>
          headers.reduce((acc, header, i) => {
            acc[header.trim()] = row[i]?.trim();
            return acc;
          }, {})
        );

        const now = new Date();
        const clean = data.filter(
          (j) => j.Post && j.ApplyLink && (() => {
            const d = parseDate(j.LastDate);
            return d && d >= now;
          })()
        );
        setJobs(clean);
      } catch (e) {
        console.error(e);
        setError("Failed to load job listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, []);

  if (loading) return <div className="loading">Loading Jobs…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="jobbrief-page">
      <h1 className="jobbrief-title">All Job Listings</h1>
      <table className="jobbrief-table">
        <thead>
          <tr>
            <th>Post Name</th>
            <th>Department</th>
            <th>Last Date</th>
            <th>Apply Link</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, i) => (
            <tr key={i}>
              <td>{job.Post}</td>
              <td>{job.Department}</td>
              <td>{job.LastDate}</td>
              <td>
                <a
                  href={job.ApplyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-btn"
                >
                  Apply Now
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
