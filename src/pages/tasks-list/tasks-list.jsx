import React, { useEffect, useState } from "react";
import TaskItem from "./../../components/task/task-item.jsx";
import { useNavigate } from "react-router-dom";
import "./tasks-list.css";
import api from "../../services/api";
import Header from "../../components/common/header/header";
import { jwtDecode } from "jwt-decode";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTaskIds, setCompletedTaskIds] = useState(new Set());
  const [filterModel, setFilterModel] = useState({
    ComplexityIds: ["121afbc7-e25b-48dc-b2d1-600a0663a0b9"],
    TaskTypeIdIds: ["121afbc7-e25b-48dc-b2d1-600a0663a0b9"],
    SortingOption: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  });

  const fetchTasks = async () => {
    try {
      // Get tasks
      const response = await api.post("/TestTasks/GetAllFiltered", filterModel);
      setTasks(response.data);

      // Get user data from token
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userData = {
        userName:
          decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
        userId:
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ],
        role: decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],
      };

      // Get completed tasks
      const completedTasksResponse = await api.get(
        `/CompletedTasks/GetByUser/${userData.userId}`
      );

      // Create a Set of completed task IDs for efficient lookup
      const completedIds = new Set(
        completedTasksResponse.data.map((task) => task.taskId)
      );
      setCompletedTaskIds(completedIds);
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
          </select>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <TaskItem
                task={task}
                isCompleted={completedTaskIds.has(task.id)}
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
