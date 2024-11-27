import React from "react";
import "./info-tag.css";

const TaskComplexityTag = ({ complexity }) => {
  const validComplexities = ["easy", "normal", "hard"];
  const isValidComplexity = validComplexities.includes(
    complexity.toLowerCase()
  );
  const complexityClass = `complexity-tag complexity-${
    isValidComplexity ? complexity.toLowerCase() : "unknown"
  }`;

  return (
    <small className={complexityClass}>
      {complexity.charAt(0).toUpperCase() + complexity.slice(1)}
    </small>
  );
};

export default TaskComplexityTag;
