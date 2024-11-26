import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Header from "../../components/common/header/header";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const id = uuidv4();
      const roles = ["bfe91bfd-12c9-41d4-8aa0-19e46e640d67"];
      await api.post("/Users", {
        id,
        userName,
        password,
        roles,
      });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError("Registration failed: " + err.response?.data || err.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="register">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Have an account?{" "}
          <Link to="/login" className="register-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
