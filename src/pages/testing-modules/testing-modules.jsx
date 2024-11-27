import React from 'react';
import { Link } from 'react-router-dom';
import './testing-modules.css';

const TestingModules = () => {
    const testingModules = [
        { id: 1, name: "Unit Testing", path: "/modules/testing/unit" },
        { id: 2, name: "Security Testing", path: "/login" },
        { id: 3, name: "UI Testing", path: "/modules/testing/ui"},
        { id: 4, name: "Load Testing", path: "/modules/testing/load" },
        { id: 5, name: "Cross-platform Testing", path: "/modules/testing/cross-platform"}
    ];

    return (
        <div className="testing-modules-container">
            <h1 className="testing-modules-title">Testing Modules</h1>
            <ul className="testing-modules-list">
                {testingModules.map((module) => (
                    <li key={module.id} className="testing-module-item">
                        <Link to={module.path} className="testing-module-link">
                            {module.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestingModules;
