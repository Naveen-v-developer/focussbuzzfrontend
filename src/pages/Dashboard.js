import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer";
import SessionChart from "../components/SessionChart";
import TaskPage from "./TaskPage";
import popup from "../assets/popup.wav";

import "./Dashboard.css";

// 🔊 Sound playback utility
function play() {
  const audio = new Audio(popup);
  audio.play()
    .then(() => {
      console.log("🔊 Sound played successfully.");
    })
    .catch((error) => {
      console.error("❌ Failed to play sound:", error);
    });
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [predictedBreak, setPredictedBreak] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await fetch("https://focussbuzzbackend-4.onrender.com/api/session/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Error ending session:", error.message);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="dashboard">
      {/* 🔷 Navbar */}
      <nav className="navbar">
        <div className="nav-left">📘 FocusBuzz</div>
        <div className="nav-center"></div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <div className={`nav-right ${menuOpen ? "open" : ""}`}>
          <span>👋 Hi Naveen</span>
          <button className="action-button" onClick={() => { play(); navigate("/tasks"); }}>
            📌 Your Tasks
          </button>
          <button className="action-button" onClick={() => { play(); navigate("/"); }}>
            🏠 Home
          </button>
          <button className="action-button logout-btn" onClick={() => { play(); handleLogout(); }}>
            🔓 Logout
          </button>
        </div>
      </nav>

      {/* 🔵 Timer Panel */}
      <section className="timer-panel">
        <div className="timer-card">
          <h2>🎯 Focus Session</h2>
          <Timer
            initialMinutes={25}
            initialSeconds={0}
            setPredictedBreak={setPredictedBreak}
          />
        </div>
      </section>

      {/* 📊 Productivity Chart */}
      <div className="productivity-chart">
        <SessionChart />
      </div>

      {/* ✅ Task Manager */}
      <div className="task-page-container">
        <TaskPage />
      </div>

      {/* ⏬ Footer Section */}
      <footer className="dashboard-footer">
        <p>💡 Stay consistent. Progress, not perfection.</p>
        <p>🧠 Take regular breaks to boost focus and productivity.</p>
        <p>© {new Date().getFullYear()} FocusBuzz. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
