import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header>
      <div>
        <h1>VLPI</h1>
      </div>
      {!isAuthPage && (
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/task">Tasks</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>
            Logout
          </button>
        </nav>
      )}
    </header>
  );
};

export default Header;
