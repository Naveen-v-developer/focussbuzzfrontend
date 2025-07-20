import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login'); // change this path if your login route is different
  };

  return (
    <div className="home-container">
      <header className="home-header">🎯 FocusBuzz</header>
      <p className="home-subtitle">
        Boost your productivity with intelligent focus tracking and smart break suggestions.
      </p>

      <div className="feature-section">
        <div className="feature-card">
          <h3>⏱️ Smart Focus Timer</h3>
          <p>Track your study or work sessions with a distraction-free timer.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Real-Time Feedback</h3>
          <p>Submit feedback after each session to improve future recommendations.</p>
        </div>
        <div className="feature-card">
          <h3>🤖 AI Break Suggestions</h3>
          <p>Get custom break durations based on your session length and focus rating.</p>
        </div>
        <div className="feature-card">
          <h3>📈 Progress Dashboard</h3>
          <p>Visualize your focus history and track your improvement over time.</p>
        </div>
        <div className="feature-card">
          <h3>🔒 Secure & Simple</h3>
          <p>Just log in and go — your data is stored safely and privately.</p>
        </div>
        <div className="feature-card">
          <h3>✅ Task Management</h3>
          <p>Organize your daily tasks, mark them complete, and stay on top of your goals.</p>
        </div>
      </div>

      <section className="info-section">
        <h2>✨ How It Works</h2>
        <ol>
          <li>Start a session when you're ready to focus.</li>
          <li>Work without distractions.</li>
          <li>End the session and rate your experience.</li>
          <li>Receive a recommended break duration instantly.</li>
          <li>Review your focus sessions anytime on the charts dashboard.</li>
        </ol>
      </section>

      <section className="login-call">
        <h2>🔐 Login to Continue Your Journey</h2>
        <p>
          "Every focused minute takes you one step closer to your goals — 
          log in and take control of your time."
        </p>
        <button className="get-started-button" onClick={handleGetStarted}>
          🚀 Get Started
        </button>
      </section>

      <footer className="home-footer">
        <p>🚀 Start your journey with FocusBuzz and master your focus!</p>
        <small>Made with ❤️ for students and professionals</small>
      </footer>
    </div>
  );
};

export default HomePage;
