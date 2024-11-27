import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Header from "../../components/common/header/header";
import "./task-creation.css";

const TaskCreation = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [complexityId, setComplexityId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [complexities, setComplexities] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        // Fetch complexities and task types
        const complexitiesResponse = await api.get("/Complexities");
        const taskTypesResponse = await api.get("/TaskTypes");
        setComplexities(complexitiesResponse.data);
        setTaskTypes(taskTypesResponse.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newTask = {
      title,
      description,
      prompt,
      complexityId,
      typeId,
    };

    try {
      await api.post("/TestTasks", newTask);
      alert("Task created successfully!");
      navigate("/testing/security"); // Redirect to the task list page
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  return (
    <div>
      <Header />
      <div className="task-creation-container">
        <h1>Create New Task</h1>
        <form className="task-creation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <br />
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              className="answer-input"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="prompt">Prompt:</label>
            <textarea
              className="answer-input"
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="complexity">Complexity:</label>
            <br />
            <select
              className="custom-select"
              id="complexity"
              value={complexityId}
              onChange={(e) => setComplexityId(e.target.value)}
              required
            >
              <option value="">Select Complexity</option>
              {complexities.map((complexity) => (
                <option key={complexity.id} value={complexity.id}>
                  {complexity.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Task Type:</label>
            <br />
            <select
              className="custom-select"
              id="type"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              required
            >
              <option value="">Select Task Type</option>
              {taskTypes.map((taskType) => (
                <option key={taskType.id} value={taskType.id}>
                  {taskType.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskCreation;
