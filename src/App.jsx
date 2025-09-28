import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Syllabus from "./Syllabus.jsx";
import Playlists from "./Playlists.jsx";
import Certifications from "./Certifications.jsx";
import Competitions from "./Competitions.jsx";
import CareerPages from "./CareerPages.jsx";
import JobListings from "./JobListings.jsx";
import MockTests from "./MockTests.jsx";
import MockTestsBrief from "./MockTestsBrief";
import JobListingsBrief from "./JobListingsBrief";
import ExpiredJobs from "./ExpiredJobs.jsx";
import MakeCV from "./MakeCV.jsx";
import ImportantUpdates from "./ImportantUpdates.jsx";
import InterviewQuestions from "./InterviewQuestions.jsx";

function App() {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Typing animation states for panel subheading
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  const panelText = "Private Jobs & Career Guideance Portal";

  useEffect(() => {
    if (currentIndex < panelText.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + panelText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 80); // Typing speed: 80ms per character
      
      return () => clearTimeout(timer);
    } else {
      setIsTypingComplete(true);
    }
  }, [currentIndex, panelText]);

  const searchIndex = useMemo(
    () => [
      { title: "Playlists — YouTube Topic Wise Videos", type: "route", url: "/playlists" },
      { title: "Syllabus — IT Sector Job Syllabus", type: "route", url: "/syllabus" },
      { title: "Competitions — Coding & DSA Contests", type: "route", url: "/competitions" },
      { title: "Certifications — Top Free & Paid Certs", type: "route", url: "/certifications" },
      { title: "Career Pages — Explore Companies", type: "route", url: "/careerpages" },
      { title: "HCL Tech — Senior Project Manager (Apply Now)", type: "external", url: "https://www.hcltech.com/jobs/senior-project-manager-2" },
      { title: "UPSC Civil Services Prelims Result 2025", type: "external", url: "#" },
      { title: "Railway Group D Admit Card 2025", type: "external", url: "#" },
      { title: "CTET July 2025 Registration Started", type: "external", url: "#" },
      { title: "IBPS PO 2025 Final Result Declared", type: "external", url: "#" },
      { title: "Roadmap.sh — Developer Roadmaps", type: "external", url: "https://roadmap.sh/" },
      { title: "Infosys Springboard Certification", type: "external", url: "https://infyspringboard.onwingspan.com/web/en/page/home" },
      { title: "HackerRank Competitions", type: "external", url: "https://www.hackerrank.com/contests" },
      { title: "LeetCode Weekly Contest", type: "external", url: "https://leetcode.com/contest/" },
    ],
    []
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex.filter((i) => i.title.toLowerCase().includes(q)).slice(0, 8);
  }, [query, searchIndex]);

  const handleSelect = (item) => {
    if (item.type === "route") {
      navigate(item.url);
    } else {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
    setShowDropdown(false);
    setActiveIndex(-1);
  };

  useEffect(() => {
    const onClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const onKeyDown = (e) => {
    if (!showDropdown || filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) handleSelect(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="header">
        <h1>PRIVATE RESULT</h1>
        <div>Welcome to Our Platform</div>
        <div className="panel">
          {displayText}
          {!isTypingComplete && (
            <span className="typing-cursor">|</span>
          )}
        </div>
      </div>

      {/* Navbar */}
      <div className="navbar">
        {/* Search Box */}
        <div className="nav-search glow-search" ref={searchRef}>
          <span className="nav-search-icon">🔍</span>
          <input
            className="nav-search-input"
            type="text"
            placeholder="Search playlists, syllabus…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(e.target.value.trim().length > 0);
              setActiveIndex(0);
            }}
            onFocus={() => setShowDropdown(query.trim().length > 0)}
            onKeyDown={onKeyDown}
            aria-label="Search"
          />

          {showDropdown && filtered.length > 0 && (
            <div className="nav-search-dropdown">
              {filtered.map((item, idx) => (
                <button
                  key={item.title + idx}
                  type="button"
                  className={`nav-search-item ${idx === activeIndex ? "active" : ""}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handleSelect(item)}
                >
                  <span className="nav-search-item-title">{item.title}</span>
                  <span className={`nav-search-badge ${item.type === "route" ? "badge-internal" : "badge-external"}`}>
                    {item.type === "route" ? "Page" : "Link"}
                  </span>
                </button>
              ))}
            </div>
          )}

          {showDropdown && filtered.length === 0 && (
            <div className="nav-search-dropdown empty">No results found</div>
          )}
        </div>

        <Link to="/">Home</Link>
        <a href="https://roadmap.sh/" target="_blank" rel="noopener noreferrer">Roadmap</a>
        <Link to="/syllabus">Syllabus</Link>
        <Link to="/competitions">Competitions</Link>
        <Link to="/certifications">Certifications</Link>
        <Link to="/careerpages">CareerPages</Link>
        <a
          href="https://www.instagram.com/the_kanpur_vibes?igsh=MWppcDZ1MXNIN3N2bw=="
          className="whatsapp-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/instagram.png"
            alt="Instagram logo link to follow Private Result on Instagram"
            className="whatsapp-logo"
          />
          Follow Us On Instagram
        </a>
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <div className="content-container">
              <MockTests />
              <JobListings /> {/* ✅ Keep Job Listings on home page */}

              <div>
                <h2 className="section-title">Quick Links</h2>
                <div className="quick-links">
                  <Link to="/syllabus">📝 Syllabus</Link>
                  <Link to="/MakeCV">👤 Make CV</Link>
                  <Link to="/careerpages">💼 Career Pages</Link>
                  <Link to="/expiredjobs">⛔ Expired Jobs</Link>
                  <Link to="/playlists">🎬 YouTube Playlists</Link>
                  <Link to="InterviewQuestions">📖 Interview Questions</Link>
                  <Link to="ImportantUpdates">📢 Important Updates</Link>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/syllabus" element={<Syllabus />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/competitions" element={<Competitions />} />
        <Route path="/careerpages" element={<CareerPages />} />
        <Route path="/joblistings" element={<JobListings />} />
        <Route path="/mocktests" element={<MockTests />} />
        <Route path="/mocktestsbrief" element={<MockTestsBrief />} />
        <Route path="/joblistingsbrief" element={<JobListingsBrief />} />
        <Route path="/expiredjobs" element={<ExpiredJobs />} />
        <Route path="/makecv" element={<MakeCV />} />
        <Route path="/importantupdates" element={<ImportantUpdates />} />
        <Route path="/interviewquestions" element={<InterviewQuestions />} />
      </Routes>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>
              Private Result is a smart centralized platform where you can access career pages from multiple companies in one place, build your CV, explore private job and many more — all in one hub.
            </p>
            <p>🚀 More features coming soon in the next upgrade .</p>
          </div>
          <div className="footer-section">
            <h3>Founder</h3>
            <p>@ Vikas Pandey</p>
            <p>➠ Full Stack Developer | Tech Enthusiast</p>
            <p>➠ Bachelors in Computer Science</p>
            <p>
            ➠ I love turning challenges into successes 
               and dedicated to delivering my best work
            </p>
          </div>
          <div className="footer-section">
            <h3>Important Message</h3>
            <p>📢 Private Result – Upcoming Upgrade
            Exciting news! The next version of Private Result is on its way.
            It will include Login / Register features and more powerful tools 
            to enhance your experience.
           </p>
           <p>⚙️ Next upgrade coming soon…</p>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@privateresult.com</p>
            <p>Phone: +91 98765 43210</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PrivateResult.com. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}