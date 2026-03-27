import React, { useState, useEffect } from 'react';
import TaskCardResponse from '../components/TaskCardResponse';
import AddTaskModal from '../components/AddTaskModal';
// import { taskService } from '../services/taskService'; // бэкенд
import { tasks as mockTasks } from '../data/tasks'; // локальные данные

function RepliesPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadUserTasks();
  }, []);

  const loadUserTasks = async () => {
    setLoading(true);
    setError('');
    try {
      // ========== БЭКЕНД ==========
      // const data = await taskService.getUserTasks();
      // setTasks(data);
      // ========== ЛОКАЛЬНЫЕ ДАННЫЕ ==========
      setTimeout(() => {
        setTasks(mockTasks);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки ваших задач');
      console.error('Failed to load user tasks:', err);
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleAddTaskSubmit = async (taskData) => {
    try {
      // ========== БЭКЕНД ==========
      // const createdTask = await taskService.createTask(taskData);
      // setTasks((prevTasks) => [createdTask, ...prevTasks]);

      // ========== ЛОКАЛЬНЫЕ ДАННЫЕ ==========
      const getRandomLogo = () => {
        const logos = ['💻', '🎨', '🤖', '📱', '🚀', '⚡', '🎯', '💡', '🔧', '📊'];
        return logos[Math.floor(Math.random() * logos.length)];
      };

      const createdTask = {
        ...taskData,
        id: Date.now(),
        logo: getRandomLogo(),
        responses: [],
      };
      setTasks((prevTasks) => [createdTask, ...prevTasks]);
      alert('✅ Задача успешно добавлена!');
    } catch (err) {
      alert('Ошибка добавления задачи: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // ========== БЭКЕНД ==========
      // await taskService.deleteTask(taskId);

      // ========== ЛОКАЛЬНЫЕ ДАННЫЕ ==========
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      alert('✅ Задача успешно удалена!');
    } catch (err) {
      alert('Ошибка удаления задачи: ' + err.message);
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      // ========== БЭКЕНД ==========
      // const result = await taskService.updateTask(updatedTask.id, updatedTask);
      // setTasks((prevTasks) => prevTasks.map((task) => (task.id === result.id ? result : task)));

      // ========== ЛОКАЛЬНЫЕ ДАННЫЕ ==========
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
      );
      alert('✅ Задача успешно обновлена!');
    } catch (err) {
      alert('Ошибка обновления задачи: ' + err.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="page-header">
          <div className="page-title">📋 Мои задачи</div>
          <div className="page-subtitle">Загрузка ваших задач...</div>
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
          <div className="page-title">📋 Мои задачи</div>
          <div className="page-subtitle">Ошибка загрузки</div>
        </div>
        <div className="vacancies-empty">
          <div className="vacancies-empty-icon">⚠️</div>
          <div className="vacancies-empty-title">Ошибка загрузки</div>
          <div className="vacancies-empty-text">{error}</div>
          <button className="btn-primary" onClick={loadUserTasks} style={{ marginTop: '20px' }}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div className="page-title">📋 Мои задачи</div>
        <div className="page-subtitle">
          Здесь отображаются все ваши опубликованные задачи и отклики соискателей
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="vacancies-empty">
          <div className="vacancies-empty-icon">📭</div>
          <div className="vacancies-empty-title">У вас пока нет задач</div>
          <div className="vacancies-empty-text">
            Нажмите кнопку "Добавить задачу", чтобы создать первую задачу
          </div>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <TaskCardResponse
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}

      <div className="add-task-container">
        <button className="btn-add-task" onClick={handleAddTask}>
          ➕ Добавить задачу
        </button>
      </div>

      <AddTaskModal isOpen={isModalOpen} onClose={handleCloseModal} onAdd={handleAddTaskSubmit} />
    </div>
  );
}

export default RepliesPage;
