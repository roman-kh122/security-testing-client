import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./task-details.css";
import Header from "../../components/common/header/header";
import { getToken } from "../../utils/token";
import TaskComplexityTag from "../../components/info-tags/info-tag";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [oldAnswers, setOldAnswers] = useState([]);
  const navigate = useNavigate();
  const [expandedAccordion, setExpandedAccordion] = useState(null); // Track expanded accordion

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await api.get(`/TestTasks/${id}`);
        const responseComplexity = await api.get(
          `/Complexities/${response.data.complexityId}`
        );
        const responseType = await api.get(
          `/TaskTypes/${response.data.typeId}`
        );
        let responseTask = response.data;
        responseTask.complexity = responseComplexity.data.name;
        responseTask.type = responseType.data.name;
        setTask(responseTask);

        const decoded = getToken();
        const responseAnswers = await api.get(
          `/CompletedTasks/GetByUser/${decoded.userId}`
        );

        // Filter answers related to the current task ID
        const filteredAnswers = responseAnswers.data.filter(
          (answer) => answer.taskId === id
        );

        setOldAnswers(filteredAnswers);
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const decoded = getToken();
    setSubmitting(true); // Start loading indicator

    try {
      const response = await api.post(`/CompletedTasks/ProcessAnswer`, {
        answer: answer,
        userId: decoded.userId,
        testTaskId: id,
      });

      const newAnswer = {
        id: response.data.id,
        taskId: id,
        answer: answer,
        score: response.data.score,
        feedback: response.data.feedback || "No feedback provided",
        isPassed: response.data.isPassed || false,
      };

      setOldAnswers((prevAnswers) => [newAnswer, ...prevAnswers]);
      setAnswer("");
      setExpandedAccordion(newAnswer.id); // Automatically open the new accordion
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setSubmitting(false); // Stop loading indicator
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  const handleDelete = async (e) => {
    try {
      e.preventDefault();
      const response = await api.delete(`/TestTasks/${id}`);
      alert("Task deleted successfully!");
      navigate("/testing/security");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const showDeleteButton = () => {
    const decoded = getToken();
    if(decoded.role === "Moderator") {
      return (
        <div>
          <button onClick={handleDelete}>
            Delete Task
          </button>
        </div>
      )
    }
  }

  return (
    <div>
      <Header />
      <div className="task-details-container">
        <div className="task-details-header">
          <h1 className="task-title">{task.title}</h1>
          <div className="task-tags">
            <TaskComplexityTag complexity={task.complexity} />
            <TaskComplexityTag complexity={task.type} />
          </div>
        </div>
        {showDeleteButton()}
        <div className="task-meta">
          <div className="task-description-container">
            <p
              className="task-description"
              dangerouslySetInnerHTML={{
                __html: task.description.replace(/\n/g, "<br>"),
              }}
            ></p>
          </div>
          <p>Your answer:</p>
          <div className="submit-answer">
            <textarea
              className="answer-input"
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="5"
              required
            ></textarea>
            <button type="submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>

        <div className="old-answers">
          <h3>Previous Answers</h3>
          {oldAnswers.length > 0 ? (
            oldAnswers.map((oldAnswer, index) => (
              <Accordion
                key={oldAnswer.id}
                expanded={expandedAccordion === oldAnswer.id} // Control which accordion is open
                onChange={() =>
                  setExpandedAccordion(
                    expandedAccordion === oldAnswer.id ? null : oldAnswer.id
                  )
                }
                style={{
                  backgroundColor: "#f9f9f9",
                  borderLeft: `4px solid ${
                    oldAnswer.isPassed ? "#4caf50" : "#f44336"
                  }`,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${index}-content`}
                  id={`panel-${index}-header`}
                >
                  <Typography>
                    <strong>Answer</strong>
                  </Typography>
                  {oldAnswer.isPassed ? (
                    <CheckCircleIcon
                      style={{ color: "#4caf50", marginLeft: "10px" }}
                      titleAccess="Passed"
                    />
                  ) : (
                    <CancelIcon
                      style={{ color: "#f44336", marginLeft: "10px" }}
                      titleAccess="Failed"
                    />
                  )}
                </AccordionSummary>
                <AccordionDetails>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "left",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography>
                      <strong>Answer:</strong>{" "}
                      {oldAnswer.answer || "No answer provided"}
                    </Typography>
                    <Typography>
                      <strong>Score:</strong> {oldAnswer.score}
                    </Typography>
                    <Typography>
                      <strong>Feedback:</strong> {oldAnswer.feedback}
                    </Typography>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <p>No previous answers for this task.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
