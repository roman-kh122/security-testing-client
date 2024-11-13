import React, { useEffect, useState } from "react";
import TaskItem from "./../../components/task/task-item.jsx";
import { useNavigate } from "react-router-dom";
import "./tasks-list.css";
import api from "../../services/api";
import Header from "../../components/common/header/header";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filterModel, setFilterModel] = useState({
    ComplexityIds: ["121afbc7-e25b-48dc-b2d1-600a0663a0b9"],
    TaskTypeIdIds: ["121afbc7-e25b-48dc-b2d1-600a0663a0b9"],
    SortingOption: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [filterModel]);

  const fetchTasks = async () => {
    try {
      const response = await api.post("/TestTasks/GetAllFiltered", filterModel);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Handlers to set filter options
  const handleComplexityChange = (ids) => {
    setFilterModel((prev) => ({ ...prev, ComplexityIds: ids }));
  };

  const handleTaskTypeChange = (ids) => {
    setFilterModel((prev) => ({ ...prev, TaskTypeIdIds: ids }));
  };

  const handleSortingChange = (option) => {
    setFilterModel((prev) => ({ ...prev, SortingOption: option }));
  };

  return (
    <div>
      <Header />
      <div className="task-list-container">
        <h1 className="task-list-title">All Tasks</h1>

        <div className="filters">
          <select onChange={(e) => handleComplexityChange([e.target.value])}>
            <option value="">Select Complexity</option>
            {/* Add complexity options here */}
          </select>

          <select onChange={(e) => handleTaskTypeChange([e.target.value])}>
            <option value="">Select Task Type</option>
            {/* Add task type options here */}
          </select>

          <select onChange={(e) => handleSortingChange(e.target.value)}>
            <option value="">Sort By</option>
            <option value="DateCreated">Date Created</option>
            <option value="Priority">Priority</option>
            {/* Add other sorting options as needed */}
          </select>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskItem
                task={task}
                onClick={() => navigate(`/task/${task.id}`)}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
