import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login/login.jsx";
import Register from "./pages/register/register.jsx";
import TaskList from "./pages/tasks-list/tasks-list.jsx";

import TaskDetails from "./pages/task-details/task-details.jsx";
import Profile from "./pages/profile/profile.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Register route */}
        <Route path="/task" element={<TaskList />} /> {/* Task route */}
        <Route path="/task/:id" element={<TaskDetails />} />{" "}
        {/* Маршрут для TaskDetails */}
        <Route path="/profile" element={<Profile />} /> {/* Default route */}
      </Routes>
    </Router>
  );
}

export default App;
