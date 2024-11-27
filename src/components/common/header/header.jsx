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
        <h1>
          <Link
            to="/modules"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            VLPI
          </Link>
        </h1>
      </div>
      {!isAuthPage && (
        <nav style={{ display: "flex", gap: "1rem" }}>
          <Link to="/modules">Modules</Link>
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