import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./profile.css";
import Header from "../../components/common/header/header";

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
      <div className="profile">
        <h2>Profile</h2>
        {user ? (
          <>
            <p>
              <strong>Username:</strong> {user.userName}
            </p>
            <p>
              <strong>Role:</strong> {user.role}
            </p>
            <h3>Completed Tasks:</h3>
            {completedTasks.length > 0 ? (
              <ul>
                {completedTasks.map((task) => (
                  <li key={task.id}>
                    <Link to={`/task/${task.taskId}`}>
                      {tasksDetails[task.taskId]?.description || "Loading..."}
                    </Link>
                    <p>Score: {task.score}</p>
                    <p>Passed: {task.isPassed ? "Yes" : "No"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No completed tasks found.</p>
            )}
          </>
        ) : (
          <p>Loading profile data...</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
