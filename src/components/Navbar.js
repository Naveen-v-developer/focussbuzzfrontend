import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";
import popup from "../assets/popup.wav";

// 🔊 Sound playback utility
function play() {
  const audio = new Audio(popup);
  audio.play().catch((error) => {
    console.error("❌ Failed to play sound:", error);
  });
}

function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setUserName(user.name);
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      await fetch("https://focussbuzzbackend-4.onrender.com/api/session/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await fetch("https://focussbuzzbackend-4.onrender.com/api/auth/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (error) {
      alert("Something went wrong during logout");
    }
  };

  // ❌ Hide navbar on /dashboard
  if (location.pathname === "/dashboard") return null;

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <Link to="/" className="navbar-logo" onClick={play}>
          🎯 FocusBuzz
        </Link>

        <button className="navbar-toggle" onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>

      <div className={`navbar-links ${isOpen ? "open" : ""}`}>
        <button className="nav-link" onClick={() => { play(); navigate("/"); }}>Home</button>
        <button className="nav-link" onClick={() => { play(); navigate("/login"); }}>Login</button>
        <button className="nav-link" onClick={() => { play(); navigate("/register"); }}>Register</button>
        <button className="nav-link" onClick={() => { play(); navigate("/dashboard"); }}>Dashboard</button>

        {token && (
          <button className="nav-link logout-btn" onClick={() => { play(); handleLogout(); }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
