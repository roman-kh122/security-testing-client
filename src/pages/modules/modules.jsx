import React from 'react';
import { Link } from 'react-router-dom';
import './modules.css';

const Modules = () => {
    const modules = [
        { id: 1, name: "Modelling", path: "/modules/modelling" },
        { id: 2, name: "Testing", path: "/modules/testing" },
        { id: 3, name: "Software engineering", path: "/modules/emgineering" },
        { id: 4, name: "Requirement analysis", path: "/modules/requirement-analysis" },
    ];

    return (
        <div className="modules-container">
            <h1 className="modules-title">Learning Modules</h1>
            <ul className="modules-list">
                {modules.map((module) => (
                    <li key={module.id} className="module-item">
                        <Link to={module.path} className="module-link">
                            {module.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Modules;
