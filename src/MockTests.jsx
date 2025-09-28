import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MockTests() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlvlIBlI07jW0y8UMSL1vo3tY7ts7elq1lSl0nX3--kjTHd4N0IodO9CAmkWVrWdczz3HJCjWw2ooo/pub?gid=0&single=true&output=csv";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(CSV_URL);
        const text = await response.text();
        const rows = text.split("\n").map((r) => r.split(","));
        const headers = rows[0];
        const data = rows.slice(1).map((row) =>
          headers.reduce((acc, header, i) => {
            acc[header.trim()] = row[i]?.trim();
            return acc;
          }, {})
        );

        // सिर्फ़ 8 ही दिखाएँ (Cognizant तक) – बाकी brief page पर
        const limited = data
          .filter((item) => item["COMPANY NAME"] && item["LINK"])
          .slice(0, 6);

        setTests(limited);
      } catch (err) {
        console.error("Error fetching CSV:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mock-tests-container">
      <h2 className="section-title">MOCK - TESTS</h2>

      <div className="mock-tests">
        {loading ? (
          <p>Loading mock tests...</p>
        ) : (
          <>
            <ul>
              {tests.map((test, idx) => (
                <li key={idx}>
                  <a
                    href={test["LINK"]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {test["COMPANY NAME"]} - Practice Now
                  </a>
                </li>
              ))}
            </ul>

            {/* View More बटन को हमेशा नीचे फिक्स करें */}
            <div className="view-more-wrapper">
              <button
                className="view-more-btn"
                onClick={() => navigate("/mocktestsbrief")}
              >
                View More
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
