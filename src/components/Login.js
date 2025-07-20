import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import popup from "../assets/popup.wav";

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

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    
  e.preventDefault();
  setError("");

  console.log("🔄 Sending login request...", formData);

  try {
    const res = await fetch("https://focussbuzzbackend-3.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log("📦 Response received:", data);

    if (!res.ok) {
      console.warn("❌ Login failed:", data.msg || "Unknown error");
      setError(data.msg || "Login failed");
      return;
    }

    console.log("✅ Login successful. Token:", data.token);
    play()
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user._id); // ✅ Store userId

    navigate("/dashboard");
  } catch (err) {
    console.error("🚨 Login error:", err);
    setError("Something went wrong");
  }
};

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="login-error">{error}</p>}
        <div className="switch-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}

export default Login;
