import React, { useState, useEffect } from "react";
import "./TaskPage.css";
import popup from '../assets/popup.wav';



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

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ text: "", estimatedTime: "" });
  const [editingId, setEditingId] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const token = localStorage.getItem("token");

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(true);
    setTimeout(() => {
      setPopupVisible(false);
      setPopupMessage("");
    }, 3000);
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("https://focussbuzzbackend-4.onrender.com/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Fetch tasks failed:", err);
      showPopup("Failed to fetch tasks.");
    }
  };

  const handleAdd = async () => {
play()

    const { text, estimatedTime } = newTask;
    if (!text.trim() || !estimatedTime || isNaN(Number(estimatedTime))) {
        
      showPopup("Please enter valid task and time.");
      
      return;
    }

    try {
      const res = await fetch("https://focussbuzzbackend-4.onrender.com/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: text.trim(),
          estimatedTime: Number(estimatedTime),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showPopup(data.message || "Failed to add task.");
        return;
      }

      setNewTask({ text: "", estimatedTime: "" });
      fetchTasks();
      showPopup("Task added successfully!");
    
    } catch (err) {
      console.error("Add task error:", err);
      showPopup("Error adding task.");
    }
  };

 const handleDelete = async (id) => {

 
  
  try {
    await fetch(`https://focussbuzzbackend-4.onrender.com/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTasks();
    showPopup("Task deleted!");
    play();
     
   
  } catch (err) {
    showPopup("Failed to delete task.");
    
  }
};

  const handleUpdate = async (id) => {
    try {
      await fetch(`https://focussbuzzbackend-4.onrender.com/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: newTask.text.trim(),
          estimatedTime: Number(newTask.estimatedTime),
        }),
      });
      setEditingId(null);
      setNewTask({ text: "", estimatedTime: "" });
      fetchTasks();
      showPopup("Task updated!");
      play();
    } catch (err) {
      showPopup("Failed to update task.");
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await fetch(`https://focussbuzzbackend-4.onrender.com/api/tasks/${id}/complete`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      showPopup("Task Status Changed");
      play();
    } catch (err) {
      showPopup("Failed to toggle task.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="task-page">
      <h2>Task Manager Dashboard</h2>

      <div className="task-form">
        <input
          type="text"
          placeholder="Task"
          value={newTask.text}
          onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
        />
        <input
          type="number"
          placeholder="Time Estimate (min)"
          value={newTask.estimatedTime}
          onChange={(e) =>
            setNewTask({ ...newTask, estimatedTime: e.target.value })
          }
        />
        {editingId ? (
          <button className="btn update-btn" onClick={() => handleUpdate(editingId)}>
            Update
          </button>
        ) : (
          <button className="btn add-btn" onClick={handleAdd}>
            Add Task
          </button>
        )}
      </div>

      <div className="task-section">
        <h3>Pending Tasks</h3>
        <ul className="task-list">
          {pendingTasks.map((task) => (
            <li key={task._id}>
              <div className="task-info">
                <span className="task-text">{task.text}</span>
                <span className="task-time">⏱ {task.estimatedTime} min</span>
              </div>
              <div className="task-actions">
                <button
                  className="btn edit"
                  onClick={() => {
                    setEditingId(task._id);
                    setNewTask({
                      text: task.text,
                      estimatedTime: task.estimatedTime,
                    });
                  }}
                >
                  Edit
                </button>
                <button className="btn delete" onClick={() => handleDelete(task._id)}>
                  Delete
                </button>
                <button className="btn complete" onClick={() => handleToggleComplete(task._id)}>
                  Completed
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="task-section">
        <h3>Completed Tasks</h3>
        <ul className="task-list completed">
          {completedTasks.map((task) => (
            <li key={task._id}>
              <div className="task-info">
                <span className="task-text completed-text">{task.text}</span>
                <span className="task-time">⏱ {task.estimatedTime} min</span>
              </div>
              <div className="task-actions">
                <button className="btn delete" onClick={() => handleDelete(task._id)}>
                  Delete
                </button>
                <button className="btn revert" onClick={() => handleToggleComplete(task._id)}>
                  Revert
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {popupVisible && (
        <div className="popup">
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default TaskPage;
