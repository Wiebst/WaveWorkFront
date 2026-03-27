import React, { useState, useEffect } from 'react';
import TaskCard from '../components/TaskCard';
// import { taskService } from '../services/taskService'; // бэкенд
import { tasks as mockTasks } from '../data/tasks'; // локальные данные

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    setError('');
    try {
      // ========== БЭКЕНД ==========
      // const data = await taskService.getAllTasks();
      // setTasks(data);
      // ========== ЛОКАЛЬНЫЕ ДАННЫЕ ==========
      setTimeout(() => {
        setTasks(mockTasks);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки задач');
      console.error('Failed to load tasks:', err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <div className="page-title">📋 Доступные задачи</div>
          <div className="page-subtitle">Загрузка задач...</div>
        </div>
        <div className="vacancies-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка задач...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="page-header">
          <div className="page-title">📋 Доступные задачи</div>
          <div className="page-subtitle">Ошибка загрузки</div>
        </div>
        <div className="vacancies-empty">
          <div className="vacancies-empty-icon">⚠️</div>
          <div className="vacancies-empty-title">Ошибка загрузки</div>
          <div className="vacancies-empty-text">{error}</div>
          <button className="btn-primary" onClick={loadTasks} style={{ marginTop: '20px' }}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-title">📋 Доступные задачи</div>
        <div className="page-subtitle">Здесь отображаются все доступные задачи</div>
      </div>

      {tasks.length === 0 ? (
        <div className="vacancies-empty">
          <div className="vacancies-empty-icon">📭</div>
          <div className="vacancies-empty-title">Нет доступных задач</div>
          <div className="vacancies-empty-text">Пока нет ни одной задачи. Загляните позже!</div>
        </div>
      ) : (
        <>
          <div className="vacancies-grid">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
          <div
            style={{
              textAlign: 'center',
              margin: '20px 0 10px',
              color: '#9d93cb',
              fontSize: '0.85rem',
            }}
          >
            🔍 Найдено <span>{tasks.length}</span> предложений
          </div>
        </>
      )}
    </div>
  );
}

export default TasksPage;
