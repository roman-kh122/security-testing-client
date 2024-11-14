import React from "react";
import "./task-item.css";

const TaskItem = ({ task, isCompleted, onClick }) => (
  <div
    onClick={onClick}
    className={`task-card ${isCompleted ? "completed" : ""}`}
  >
    <div className="task-header">
      <h2 className="task-title">{task.title}</h2>
      {isCompleted && <div className="completion-mark">✓</div>}
    </div>
    <p className="task-description">{task.description}</p>
  </div>
);

export default TaskItem;
