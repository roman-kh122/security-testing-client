import React, { useState } from "react";
import api from "../../services/api";
import "./login.css";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/common/header/header";
import { Snackbar, Alert } from "@mui/material";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls Snackbar visibility
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.get("/Users/Authorize", {
        params: { userName, password },
      });
      const token = response.data;
      localStorage.setItem("token", token);
      setSuccess(true);
      setSnackbarOpen(true); // Show success Snackbar
      setTimeout(() => {
        navigate("/task"); // Redirect after a short delay
      }, 1500);
    } catch (err) {
      setError("Invalid username or password");
      setSuccess(false);
      setSnackbarOpen(true); // Show error Snackbar
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="register-link">
            Register
          </Link>
        </p>
      </div>
      {/* Snackbar for success and error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {success ? (
          <Alert
            onClose={handleCloseSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            Login successful!
          </Alert>
        ) : (
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default Login;
