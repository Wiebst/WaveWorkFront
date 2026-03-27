import React from 'react';
import { useNavigate } from 'react-router-dom';

function TaskCard({ task }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/task/${task.id}`);
  };

  const formatSalary = (salary) => {
    if (!salary && salary !== 0) return 'не указана';
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
        <button className="swipe-action" onClick={handleNavigate}>
          ➡️ Подробнее
        </button>
      </div>
    </div>
  );
}

export default TaskCard;
