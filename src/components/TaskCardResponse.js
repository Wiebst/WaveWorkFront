import React, { useState } from 'react';
import ResponseItem from './ResponseItem';
import EditTaskModal from './EditTaskModal';

function TaskCardResponse({ task, onDelete, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const toggleResponses = () => {
    setIsOpen(!isOpen);
  };

  const handleDelete = () => {
    if (window.confirm(`Вы уверены, что хотите удалить задачу "${task.title}"?`)) {
      onDelete(task.id);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (updatedTask) => {
    onEdit(updatedTask);
    setIsEditModalOpen(false);
  };

  const formatSalary = (salary) => {
    if (!salary && salary !== 0) return 'не указана';
    if (typeof salary === 'string' && salary.includes('₽')) {
      return salary;
    }
    const num = typeof salary === 'number' ? salary : parseFloat(salary);
    if (isNaN(num)) return 'не указана';
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div className="task-card">
        <div className="card-header">
          <div className="company-logo">{task.logo || '📋'}</div>
          <div className="company-info">
            <div className="company-name">{task.title || 'Без названия'}</div>
            <div className="job-title">{task.specialization || 'Без специализации'}</div>
          </div>
          <div className="salary-badge">💰 {formatSalary(task.salary)}</div>
        </div>

        <div className="card-body">
          {task.tech && task.tech.length > 0 && (
            <div className="tech-stack">
              {task.tech.map((tech, index) => (
                <span className="tech-tag" key={index}>
                  {tech}
                </span>
              ))}
            </div>
          )}
          <div className="job-description">
            {task.description || task.desc || 'Описание отсутствует'}
          </div>
          {task.deadline && (
            <div className="deadline-info">⏰ Дедлайн: {formatDeadline(task.deadline)}</div>
          )}
        </div>

        <div className="card-footer">
          <div className="task-actions">
            <button className="edit-btn" onClick={handleEdit}>
              ✏️ Редактировать
            </button>
            <button className="responses-btn" onClick={toggleResponses}>
              📋 Отклики ({task.responses?.length || 0})
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              🗑️ Удалить
            </button>
          </div>
        </div>

        <div className={`responses-list ${isOpen ? 'open' : ''}`}>
          {task.responses && task.responses.length > 0 ? (
            task.responses.map((response, index) => (
              <ResponseItem key={index} response={response} />
            ))
          ) : (
            <div className="empty-responses">Нет откликов</div>
          )}
        </div>
      </div>

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditSubmit}
        task={task}
      />
    </>
  );
}

export default TaskCardResponse;
