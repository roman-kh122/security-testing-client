import React from "react";
import "./task-item.css";

const TaskItem = ({ task, onClick }) => (
  <div onClick={onClick} className="task-card">
    <h2 className="task-title">{task.title}</h2>
    <p className="task-description">{task.description}</p>
  </div>
);

export default TaskItem;
