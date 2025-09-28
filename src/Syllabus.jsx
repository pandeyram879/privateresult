import React, { useState } from "react";
import "./Syllabus.css";

const syllabusTopics = [
  {
    title: "Programming & Problem Solving",
    description:
      "Basics of programming, algorithms, data structures, and logical problem-solving.",
    links: [
      { name: "GeeksforGeeks - Data Structures", url: "https://www.geeksforgeeks.org/data-structures/" },
      { name: "LeetCode - Practice Problems", url: "https://leetcode.com/problemset/all/" },
      { name: "HackerRank - Algorithms", url: "https://www.hackerrank.com/domains/algorithms" },
    ],
  },
  {
    title: "Database & SQL",
    description: "Understanding relational databases, SQL queries, and basic database design.",
    links: [
      { name: "SQL Tutorial", url: "https://www.w3schools.com/sql/" },
      { name: "LeetCode SQL Problems", url: "https://leetcode.com/problemset/database/" },
    ],
  },
  {
    title: "Computer Fundamentals & Networking",
    description: "Basics of computer architecture, operating systems, networking, and cloud concepts.",
    links: [
      { name: "Computer Fundamentals - TutorialsPoint", url: "https://www.tutorialspoint.com/computer_fundamentals/index.htm" },
      { name: "AWS Cloud Concepts", url: "https://aws.amazon.com/training/" },
    ],
  },
  {
    title: "Web Development Basics",
    description: "HTML, CSS, JavaScript, and basic front-end frameworks.",
    links: [
      { name: "MDN Web Docs", url: "https://developer.mozilla.org/en-US/docs/Learn" },
      { name: "FreeCodeCamp Web Dev", url: "https://www.freecodecamp.org/learn/" },
    ],
  },
  {
    title: "Software Testing & QA Basics",
    description: "Understanding software testing life cycle, manual and automated testing basics.",
    links: [
      { name: "Software Testing Tutorial", url: "https://www.guru99.com/software-testing.html" },
      { name: "Selenium Automation", url: "https://www.selenium.dev/documentation/" },
    ],
  },
  {
    title: "Aptitude & Logical Reasoning",
    description: "Quantitative aptitude, logical reasoning, and analytical thinking for interviews.",
    links: [
      { name: "IndiaBIX Aptitude", url: "https://www.indiabix.com/" },
      { name: "CareerRide Logical Reasoning", url: "https://www.careerride.com/" },
    ],
  },
  {
    title: "English & Communication Skills",
    description: "Grammar, professional communication, email writing, and interview preparation.",
    links: [
      { name: "Grammarly Blog", url: "https://www.grammarly.com/blog/" },
      { name: "English Speaking Practice", url: "https://www.talkenglish.com/" },
    ],
  },
];

const Syllabus = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="syllabus-container">
      <h1>📚 IT Sector Job Syllabus</h1>
      <div className="syllabus-grid">
        {syllabusTopics.map((topic, index) => (
          <div key={index} className="syllabus-card">
            <h2>{topic.title}</h2>
            <button className="more-btn" onClick={() => toggleDetails(index)}>
              {openIndex === index ? "Less Details ▲" : "More Details ▼"}
            </button>
            {openIndex === index && (
              <div className="syllabus-details">
                <p>{topic.description}</p>
                <h4>Important Links:</h4>
                <ul>
                  {topic.links.map((link, idx) => (
                    <li key={idx}>
                      <a href={link.url} target="_blank" rel="noopener noreferrer">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Syllabus;
