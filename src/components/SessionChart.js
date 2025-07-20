import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SessionChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://focussbuzzbackend-4.onrender.com/api/session/history", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const grouped = {};
        res.data.forEach((session) => {
          const date = new Date(session.startTime).toLocaleDateString();
          grouped[date] = (grouped[date] || 0) + 1;
        });

        const chartData = Object.entries(grouped).map(([date, count]) => ({
          date,
          sessions: count,
        }));

        setData(chartData);
      } catch (err) {
        console.error("❌ Error fetching session data:", err);
      }
    };

    fetchSessionData();
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 700, margin: "auto", padding: "1rem" }}>
      <h2 style={{ textAlign: "center" }}>📊 Daily Focus Sessions</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="sessions" fill="#0072ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SessionChart;
