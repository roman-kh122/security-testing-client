import React, { useState } from "react";
import api from "../../services/api";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/common/header/header";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.get("/Users/Authorize", {
        params: { userName, password },
      });
      const token = response.data;
      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate("/task");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <Header />
      <div className="login">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
