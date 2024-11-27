import React from "react";
import { Link } from "react-router-dom";
import "./modules.css";
import Header from "../../components/common/header/header";

const Modules = () => {
  const modules = [
    {
      id: 41,
      name: "Requirements Analysis",
      path: "/modules/requirements-analysis",
    },
    { id: 42, name: "Design", path: "/modules/design" },
    { id: 43, name: "Modeling", path: "/modules/modeling" },
    { id: 44, name: "Development", path: "/modules/development" },
    { id: 45, name: "Testing", path: "/tesing" },
    {
      id: 46,
      name: "Skills Analysis & Learning Support",
      path: "/modules/skills-analysis",
    },
  ];

  return (
    <div>
      <Header />
      <div className="modules-container">
        <h1 className="modules-title">Learning Modules</h1>
        <ul className="modules-list">
          {modules.map((module) => (
            <Link to={module.path} className="module-link">
              <li key={module.id} className="module-item">
                {module.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Modules;
