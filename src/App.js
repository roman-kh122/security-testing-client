import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/login.jsx";
import Register from "./pages/register/register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* Register route */}
        <Route path="/main" element={<Login />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
