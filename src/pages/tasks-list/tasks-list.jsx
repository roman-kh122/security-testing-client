import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./tasks-list.css";
import api from "../../services/api";
import Header from "../../components/common/header/header";
import { jwtDecode } from "jwt-decode";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [completedTaskIds, setCompletedTaskIds] = useState(new Set());
  const [filterModel, setFilterModel] = useState({
    ComplexityIds: [],
    TaskTypeIdIds: [],
    SortingOption: null, // Add sorting option to the state
  });
  const [complexities, setComplexities] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      // Fetch tasks based on filters and sorting option
      const response = await api.post("/TestTasks/GetAllFiltered", filterModel);
      setTasks(response.data);

      // Get user data from token
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId =
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ];

      // Fetch completed tasks
      const completedTasksResponse = await api.get(
        `/CompletedTasks/GetByUser/${userId}`
      );

      // Fetch complexities and task types
      const complexitiesResponse = await api.get(`/Complexities`);
      const taskTypesResponse = await api.get(`/TaskTypes`);

      setComplexities(complexitiesResponse.data);
      setTaskTypes(taskTypesResponse.data);

      // Create a Set of completed task IDs for efficient lookup
      const completedIds = new Set(
        completedTasksResponse.data.map((task) => task.taskId)
      );
      setCompletedTaskIds(completedIds);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [filterModel]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Update filter model when checkboxes are toggled
  const handleCheckboxChange = (type, id) => {
    setFilterModel((prev) => {
      const updatedList = prev[type].includes(id)
        ? prev[type].filter((item) => item !== id)
        : [...prev[type], id];
      return { ...prev, [type]: updatedList };
    });
  };

  // Function to get complexity name by id
  const getComplexityName = (id) => {
    const complexity = complexities.find((comp) => comp.id === id);
    return complexity ? complexity.name : "Unknown";
  };

  // Function to get task type name by id
  const getTaskTypeName = (id) => {
    const taskType = taskTypes.find((type) => type.id === id);
    return taskType ? taskType.name : "Unknown";
  };

  // Function to handle sorting order change
  const handleSortingChange = (event) => {
    setFilterModel((prev) => ({
      ...prev,
      SortingOption: event.target.value, // Update the sorting option
    }));
  };

  return (
    <div>
      <Header />
      <div className="task-list-container">
        <div className="filters">
          <div className="filter-group">
            <h3>Complexities</h3>
            {complexities.map((complexity) => (
              <div key={complexity.id} className="custom-checkbox">
                <input
                  type="checkbox"
                  id={`checkbox-${complexity.id}`}
                  className="checkbox-input"
                  checked={filterModel.ComplexityIds.includes(complexity.id)}
                  onChange={() =>
                    handleCheckboxChange("ComplexityIds", complexity.id)
                  }
                />
                <label
                  htmlFor={`checkbox-${complexity.id}`}
                  className="checkbox-label"
                />
                <span className="checkbox-text">{complexity.name}</span>
              </div>
            ))}
          </div>

          <div className="filter-group">
            <h3>Task Types</h3>
            {taskTypes.map((taskType) => (
              <div key={taskType.id} className="custom-checkbox">
                <input
                  type="checkbox"
                  id={`checkbox-${taskType.id}`}
                  className="checkbox-input"
                  checked={filterModel.TaskTypeIdIds.includes(taskType.id)}
                  onChange={() =>
                    handleCheckboxChange("TaskTypeIdIds", taskType.id)
                  }
                />
                <label
                  htmlFor={`checkbox-${taskType.id}`}
                  className="checkbox-label"
                />
                <span className="checkbox-text">{taskType.name}</span>
              </div>
            ))}
          </div>

          {/* Sorting options */}
          <div className="filter-group">
            <h3>Sort by Complexity</h3>
            <div className="custom-dropdown">
              <select
                onChange={handleSortingChange}
                value={filterModel.SortingOption}
                className="custom-select"
              >
                <option value={null}>Select Sorting Option</option>
                <option value="ComplexityAscending">Ascending</option>
                <option value="ComplexityDescending">Descending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="task-list-wrapper">
          <h1 className="task-list-title">Tasks</h1>
          <ul className="task-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <div
                  className={`task-item ${
                    completedTaskIds.has(task.id) ? "completed" : ""
                  }`}
                  onClick={() => navigate(`/task/${task.id}`)}
                >
                  <h3>{task.title}</h3>
                  <p>
                    <strong>Complexity:</strong>{" "}
                    {getComplexityName(task.complexityId)}
                  </p>
                  <p>
                    <strong>Type:</strong> {getTaskTypeName(task.typeId)}
                  </p>
                  {completedTaskIds.has(task.id) && (
                    <span className="task-completed-label">Completed</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
