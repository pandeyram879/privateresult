import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import "./Playlists.css";

export default function Playlists() {
  const [videos, setVideos] = useState([]);
  const [topic, setTopic] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSAopUPVpmy_NtrYcg2kfDMd6qKdy7wpPocGsA2j_c--3L3lbw8KbjqiIZeF96sBlwJFuz83iVY4EPQ/pub?gid=0&single=true&output=csv&nocache=" +
    new Date().getTime();

  useEffect(() => {
    async function loadData() {
      try {
        const parsed = await new Promise((resolve, reject) =>
          Papa.parse(CSV_URL, {
            download: true,
            header: true,
            complete: resolve,
            error: reject,
          })
        );

        const rows = parsed.data.filter(r => r.VideoURL && r.VideoTitle);

        // ✅ fetch each playlist/video thumbnail via YouTube oEmbed
        const withThumbs = await Promise.all(
          rows.map(async r => {
            try {
              const res = await fetch(
                `https://www.youtube.com/oembed?url=${encodeURIComponent(
                  r.VideoURL
                )}&format=json`
              );
              const json = await res.json();
              return { ...r, Thumbnail: json.thumbnail_url || "" };
            } catch {
              return { ...r, Thumbnail: "" }; // fallback if private or error
            }
          })
        );

        setVideos(withThumbs);
      } catch (e) {
        console.error(e);
        setError("Failed to load playlists.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const topics = ["All", ...new Set(videos.map(v => v.Topic).filter(Boolean))];
  const filtered =
    topic === "All" ? videos : videos.filter(v => v.Topic === topic);

  if (loading) return <div className="loading">Loading Playlists…</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="playlists-page">
      <h1 className="playlists-title">🎬 YouTube Playlists</h1>

      <div className="playlist-filter">
        <label>Select Topic:</label>
        <select value={topic} onChange={e => setTopic(e.target.value)}>
          {topics.map(t => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="playlist-grid">
        {filtered.map((vid, idx) => (
          <a
            key={idx}
            href={vid.VideoURL}
            target="_blank"
            rel="noopener noreferrer"
            className="playlist-card"
          >
            {vid.Thumbnail && (
              <img
                src={vid.Thumbnail}
                alt={vid.VideoTitle}
                className="playlist-thumb"
                loading="lazy"
              />
            )}
            <span className="playlist-name">{vid.VideoTitle}</span>
            {vid.Topic && <span className="playlist-topic">{vid.Topic}</span>}
          </a>
        ))}
      </div>
    </div>
  );
}
