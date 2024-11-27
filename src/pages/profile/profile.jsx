import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { jwtDecode } from "jwt-decode";
import Header from "../../components/common/header/header";
import "./profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [tasksDetails, setTasksDetails] = useState({});

  useEffect(() => {
    const fetchUserDataAndTasks = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const userData = {
            userName:
              decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
              ],
            userId:
              decoded[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
              ],
            role: decoded[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ],
          };
          setUser(userData);

          // Fetch completed tasks for the user
          const response = await api.get(
            `/CompletedTasks/GetByUser/${userData.userId}`
          );
          const tasks = response.data || [];
          setCompletedTasks(tasks);

          // Fetch detailed info for each task
          const taskDetailsPromises = tasks.map((task) =>
            api.get(`/TestTasks/${task.taskId}`)
          );
          const taskDetails = await Promise.all(taskDetailsPromises);
          const taskDetailsMap = taskDetails.reduce((acc, curr, index) => {
            acc[tasks[index].taskId] = curr.data;
            return acc;
          }, {});
          setTasksDetails(taskDetailsMap);
        } catch (error) {
          console.error("Error fetching user data or tasks:", error);
        }
      }
    };

    fetchUserDataAndTasks();
  }, []);

  return (
    <div>
      <Header />
      <div className="profile-container">
        <div className="profile-info">
          <h1>User Profile</h1>
          {user ? (
            <>
              <p>
                <strong>Username:</strong> {user.userName}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
              <h1>Completion Tries:</h1>
            </>
          ) : (
            <p>Loading user information...</p>
          )}
        </div>

        <div className="completed-tasks">
          {completedTasks.length > 0 ? (
            <ul className="task-list">
              {completedTasks.map((task) => (
                <li key={task.id}>
                  <div
                    className={`task-item ${
                      task.isPassed ? "completed" : "failed"
                    }`}
                  >
                    <Link to={`/task/${task.taskId}`}>
                      <h3>
                        {tasksDetails[task.taskId]?.title ||
                          "Loading task details..."}
                      </h3>
                    </Link>
                    <p>Score: {task.score}</p>
                    <p>Passed: {task.isPassed ? "Yes" : "No"}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No completed tasks found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
