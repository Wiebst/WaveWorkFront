import React, { useState, useEffect, useCallback } from 'react';
import TaskCardResponse from '../components/TaskCardResponse';
import AddTaskModal from '../components/AddTaskModal';
import { taskService } from '../services/taskService';
import { proposalService } from '../services/proposalService';

function RepliesPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadUserTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await taskService.getUserTasks();
      const tasksData = response.items || response;
      setTasks(tasksData);
      await loadProposalsForTasks(tasksData);
    } catch (err) {
      setError(err.message || 'Ошибка загрузки ваших задач');
      console.error('Failed to load user tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserTasks();
  }, [loadUserTasks]);

  const loadProposalsForTasks = async (tasksList) => {
    try {
      const tasksWithProposals = await Promise.all(
        tasksList.map(async (task) => {
          try {
            const proposalsResponse = await proposalService.getTaskProposals(task.id, 1, 100);
            const proposals = proposalsResponse.items || proposalsResponse;
            return { ...task, responses: proposals };
          } catch (err) {
            console.error(`Failed to load proposals for task ${task.id}:`, err);
            return { ...task, responses: [] };
          }
        }),
      );
      setTasks(tasksWithProposals);
    } catch (err) {
      console.error('Error loading proposals:', err);
    }
  };

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleAddTaskSubmit = async (taskData) => {
    try {
      const createdTask = await taskService.createTask(taskData);
      if (currentPage === 1) {
        setTasks((prevTasks) => [createdTask, ...prevTasks]);
      }
      setTotalItems((prev) => prev + 1);
      alert('✅ Задача успешно добавлена!');

      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        await loadUserTasks();
      }
    } catch (err) {
      alert('Ошибка добавления задачи: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      setTotalItems((prev) => prev - 1);
      alert('✅ Задача успешно удалена!');

      // Если после удаления страница пуста и это не первая страница, переходим на предыдущую
      if (tasks.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await loadUserTasks();
      }
    } catch (err) {
      alert('Ошибка удаления задачи: ' + err.message);
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const result = await taskService.updateTask(updatedTask.id, updatedTask);
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === result.id ? result : task)));
      alert('✅ Задача успешно обновлена!');
    } catch (err) {
      alert('Ошибка обновления задачи: ' + err.message);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination">
        <button
          className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Назад
        </button>

        {startPage > 1 && (
          <>
            <button className="page-btn" onClick={() => handlePageChange(1)}>
              1
            </button>
            {startPage > 2 && <span className="page-dots">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="page-dots">...</span>}
            <button className="page-btn" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        )}

        <button
          className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Вперед →
        </button>
      </div>
    );
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
        <>
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

          <div className="pagination-info">
            Показано {tasks.length} из {totalItems} задач
          </div>

          {renderPagination()}
        </>
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
