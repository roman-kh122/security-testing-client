import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login.jsx";
import Register from "./pages/register/register.jsx";
import TaskList from "./pages/tasks-list/tasks-list.jsx";
import TaskDetails from "./pages/task-details/task-details.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Register route */}
        <Route path="/task" element={<TaskList />} /> {/* Task route */}
        <Route path="/task/:id" element={<TaskDetails />} /> {/* Маршрут для TaskDetails */}
      </Routes>
    </Router>
  );
}

export default App;
