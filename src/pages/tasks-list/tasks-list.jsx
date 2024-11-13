import React, { useEffect, useState } from "react";
import TaskItem from "./../../components/task/task-item.jsx";
import { useNavigate, Link } from "react-router-dom";
import "./tasks-list.css";
import api from "../../services/api";
import Header from "../../components/common/header/header";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [filterModel, setFilterModel] = useState({
    ComplexityIds: ["8e8430e9-3c53-4cd7-b7e6-4d50b9d75d85"],
    TaskTypeIdIds: ["5d34d28b-cdbf-4801-ac1e-086007f424c6"],
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
        <h1 className="task-list-title">Всі Завдання</h1>

        <div className="filters">
          <select onChange={(e) => handleComplexityChange([e.target.value])}>
            <option value="">Виберіть Складність</option>
            {/* Додайте опції складності тут */}
          </select>

          <select onChange={(e) => handleTaskTypeChange([e.target.value])}>
            <option value="">Виберіть Тип Завдання</option>
            {/* Додайте опції типу завдань тут */}
          </select>

          <select onChange={(e) => handleSortingChange(e.target.value)}>
            <option value="">Сортувати За</option>
            <option value="DateCreated">Дата Створення</option>
            <option value="Priority">Пріоритет</option>
            {/* Додайте інші опції сортування за потреби */}
          </select>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link to={`/task/${task.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <TaskItem task={task} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TaskList;
