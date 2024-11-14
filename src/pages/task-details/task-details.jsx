import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from "../../services/api"; // Імпортуємо API для роботи з бекендом
import './task-details.css'; // Стилі для сторінки
import Header from '../../components/common/header/header';

const TaskDetails = () => {
    const { id } = useParams(); // Отримуємо ID завдання з URL
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answer, setAnswer] = useState(''); // Стан для відповіді користувача
    const [result, setResult] = useState(null); // Стан для результату перевірки

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await api.get(`/TestTasks/${id}`);
                console.log(response); // Для перевірки відповіді сервера
                setTask(response.data);
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

        try {
            // Надсилаємо відповідь користувача на бекенд для перевірки
            const response = await api.post(`/TestTasks/CheckAnswer`, {
                taskId: id,
                userAnswer: answer
            });
            console.log(response); // Для перевірки відповіді сервера
            setResult(response.data); // Припускаємо, що бекенд повертає результат перевірки
        } catch (error) {
            console.error("Error submitting answer:", error);
            setResult({ success: false, message: 'Помилка при надсиланні відповіді' });
        }
    };

    if (loading) {
        return <div>Завантаження...</div>;
    }

    if (!task) {
        return <div>Завдання не знайдено</div>;
    }

    return (
      <div>
        <Header />
        <div className="task-details-container">
          <h1 className="task-title">{task.title}</h1>
          <p className="task-description">{task.description}</p>
          <div className="task-meta">
            <p>
              <strong>Підказка:</strong> {task.prompt}
            </p>
            <p>
              <strong>Складність:</strong> {task.complexity}
            </p>
            <p>
              <strong>Тип:</strong> {task.type}
            </p>
          </div>

          {/* Форма для введення відповіді */}
          <form onSubmit={handleSubmit} className="answer-form">
            <label htmlFor="answer">Ваша відповідь:</label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows="5"
              required
            ></textarea>
            <button type="submit">Надіслати відповідь</button>
          </form>

          {/* Відображення результату */}
          {result && (
            <div
              className={`result-message ${
                result.success ? "success" : "error"
              }`}
            >
              {result.message}
            </div>
          )}
        </div>
      </div>
    );
};

export default TaskDetails;
