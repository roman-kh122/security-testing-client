import React from "react";
import { Link } from "react-router-dom";
import "./testing-modules.css";
import Header from "../../components/common/header/header";

const TestingModules = () => {
  const testingModules = [
    { id: 1, name: "Unit Testing", path: "/modules/testing/unit" },
    { id: 2, name: "Security Testing", path: "/testing/security" },
    { id: 3, name: "UI Testing", path: "/modules/testing/ui" },
    { id: 4, name: "Load Testing", path: "/modules/testing/load" },
    {
      id: 5,
      name: "Cross-platform Testing",
      path: "/modules/testing/cross-platform",
    },
  ];

  return (
    <div>
      <Header />
      <div className="testing-modules-container">
        <h1 className="testing-modules-title">Testing Modules</h1>
        <ul className="testing-modules-list">
          {testingModules.map((module) => (
            <Link to={module.path} className="testing-module-link">
              <li key={module.id} className="testing-module-item">
                {module.name}
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestingModules;
