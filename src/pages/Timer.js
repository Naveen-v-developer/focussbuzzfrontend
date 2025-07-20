import React, { useState, useEffect, useRef } from "react";
import "./Timer.css";
import popup from "../assets/popup.wav";

// 🔊 Sound playback utility
function play() {
  const audio = new Audio(popup);
  audio.play().catch((err) => {
    console.error("❌ Sound play failed:", err);
  });
}

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [ended, setEnded] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [showRating, setShowRating] = useState(false);
  const [breakPrediction, setBreakPrediction] = useState(null);
  const [message, setMessage] = useState("");
  const [isBreakTime, setIsBreakTime] = useState(false);
  const [showStartNewButton, setShowStartNewButton] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [loadingRating, setLoadingRating] = useState(false);

  const intervalRef = useRef(null);

  const formatTime = (totalSec) => {
    const mins = String(Math.floor(totalSec / 60)).padStart(2, "0");
    const secs = String(totalSec % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const showTimedPopup = (text) => {
    setPopupMessage(text);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const clearTimer = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setEnded(false);
    setSeconds(0);
  };

  const handleStart = async () => {
    play();
    clearTimer();
    setRatingSubmitted(false);
    setBreakPrediction(null);
    setIsBreakTime(false);
    setShowStartNewButton(false);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://focussbuzzbackend-4.onrender.com/api/session/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        showTimedPopup("🎯 Focus session started!");
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
          setSeconds((prev) => prev + 1);
        }, 1000);
      } else {
        const data = await res.json();
        setMessage(data.message || "Failed to start session.");
      }
    } catch (err) {
      console.error("Start error:", err);
      setMessage("Start failed");
    }
  };

  const handleEnd = async () => {
    play();
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setEnded(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://focussbuzzbackend-4.onrender.com/api/session/end", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        showTimedPopup("✅ Focus session ended!");
        setMessage(`✅ Session Ended: ${data.duration} minutes`);
        setShowRating(true);
      } else {
        setMessage(data.message || "Failed to end session.");
      }
    } catch (err) {
      console.error("End error:", err);
      setMessage("End failed");
    }
  };

  const handleRatingSubmit = async (ratingValue) => {
    if (loadingRating) return;

    play();
    setLoadingRating(true);
    setMessage("⏳ Submitting rating...");

    try {
      const token = localStorage.getItem("token");

      const sessionRes = await fetch("https://focussbuzzbackend-4.onrender.com/api/session/history", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sessionData = await sessionRes.json();
      const latestSession = sessionData[0];

      const predictRes = await fetch("https://focussbuzzml.onrender.com/api/predict/break-duration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionLength: latestSession.durationMinutes,
          rating: ratingValue,
        }),
      });

      const prediction = await predictRes.json();
      const breakDuration = prediction.recommended_break_duration;

      setBreakPrediction(breakDuration);
      setShowRating(false);
      setRatingSubmitted(true);
      setMessage("⭐ Rating submitted!");
      showTimedPopup("⭐ Rating submitted!");

      startBreak(breakDuration);
    } catch (error) {
      console.error("Rating submission error:", error);
      showTimedPopup("❌ Failed to submit rating.");
    } finally {
      setLoadingRating(false);
    }
  };

  const startBreak = (duration) => {
    const totalBreakSeconds = Math.floor(duration * 60);
    setIsBreakTime(true);
    setSeconds(0);
    setMessage(`🧘 Break Started: ${duration.toFixed(2)} min`);

    showTimedPopup(`🧘 Break for ${duration.toFixed(2)} min`);

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev + 1 >= totalBreakSeconds) {
          clearInterval(intervalRef.current);
          setIsBreakTime(false);
          setMessage("✅ Break completed!");
          showTimedPopup("✅ Break done! Ready to refocus?");
          setShowStartNewButton(true);
        }
        return prev + 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="timer">
      {showPopup && <div className="popup"><p>{popupMessage}</p></div>}
      {message && <p className="message-text">{message}</p>}

      {!ended && (
        <>
          <h2 className="session-type">
            {isBreakTime ? "🌿 Break Time" : "💼 Stay Focussed"}
          </h2>
          <h1 className="time-display">{formatTime(seconds)}</h1>
        </>
      )}

      {!ended && !isBreakTime && (
        <div className="timer-buttons">
          <button onClick={handleStart} disabled={isRunning}>▶ Start</button>
          <button onClick={handleEnd} disabled={!isRunning}>⏹ End</button>
        </div>
      )}

      {isBreakTime && (
        <div className="break-info">
          <p>Take a walk, stretch, or grab a drink! ⏳</p>
        </div>
      )}

      {ended && !ratingSubmitted && (
        <div className="session-ended">
          <h3>✅ Session Completed!</h3>
          <p>Reflect on your progress. Ready to rate your focus?</p>
        </div>
      )}

      {showRating && (
        <div className="rating-popup">
          <h3>🌟 Rate your focus session</h3>
          <div className="rating-buttons">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => handleRatingSubmit(num)}
                disabled={loadingRating}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      )}

      {ratingSubmitted && breakPrediction !== null && (
        <div className="break-duration-box">
          <h3>🧘 Recommended Break</h3>
          <p>{breakPrediction.toFixed(2)} minutes</p>
          {isBreakTime && (
            <small className="break-note">⏳ Your break is active. Relax and recharge!</small>
          )}
        </div>
      )}

      {showStartNewButton && (
        <div className="restart-session">
          <button onClick={handleStart}>▶ Start New Focus Session</button>
        </div>
      )}

      <div className="motivational-quote">
        <p>"Every minute focused is a step toward your goal. 🚀"</p>
      </div>
    </div>
  );
};

export default Timer;
