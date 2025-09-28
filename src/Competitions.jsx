import React from "react";
import "./Competitions.css";

const competitions = [
  {
    level: "Easy",
    badgeClass: "badge-easy",
    list: [
      { name: "HackerRank 30 Days of Code", link: "https://www.hackerrank.com/domains/tutorials/30-days-of-code" },
      { name: "CodeChef Beginner Problems", link: "https://www.codechef.com/practice" },
      { name: "LeetCode Easy Problems", link: "https://leetcode.com/problemset/all/?difficulty=Easy" },
    ],
  },
  {
    level: "Medium",
    badgeClass: "badge-medium",
    list: [
      { name: "HackerRank Interview Prep Kit", link: "https://www.hackerrank.com/interview/interview-preparation-kit" },
      { name: "LeetCode Medium Problems", link: "https://leetcode.com/problemset/all/?difficulty=Medium" },
      { name: "Codeforces Div.2 Contests", link: "https://codeforces.com/contests" },
    ],
  },
  {
    level: "Hard",
    badgeClass: "badge-hard",
    list: [
      { name: "LeetCode Hard Problems", link: "https://leetcode.com/problemset/all/?difficulty=Hard" },
      { name: "Codeforces Div.1 Contests", link: "https://codeforces.com/contests" },
      { name: "Coding Ninjas Advanced Challenges", link: "https://www.codingninjas.com/codestudio/problems" },
    ],
  },
];

const Competitions = () => {
  return (
    <div className="competitions-container">
      <h1>🏆 Coding Competitions & Challenges</h1>

      <div className="competition-grid">
        {competitions.map((category, idx) => (
          <div key={idx} className="competition-card">
            <span className={`competition-badge ${category.badgeClass}`}>{category.level}</span>
            <h2>{category.level} Competitions</h2>
            <ul>
              {category.list.map((comp, index) => (
                <li key={index}>
                  <a href={comp.link} target="_blank" rel="noopener noreferrer">
                    {comp.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Competitions;
