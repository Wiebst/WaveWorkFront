import { API_BASE_URL } from './ApiConsts';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const userId = localStorage.getItem('userId');
  if (userId) {
    headers['X-User-Id'] = userId;
  }

  return headers;
};

export const taskService = {
  /**
   * Получение всех задач с пагинацией
   */
  async getAllTasks(page = 1, limit = 18) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки задач');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  /**
   * Получение задач пользователя с пагинацией
   */
  async getUserTasks(page = 1, limit = 18) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/user?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки ваших задач');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  },

  /**
   * Получение задачи по ID
   */
  async getTaskById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки задачи');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  /**
   * Создание новой задачи
   */
  async createTask(taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          budget: taskData.budget,
          category: taskData.category || null,
          specialization: taskData.specialization,
          technologies: taskData.technologies || [],
          deadline: taskData.deadline || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка создания задачи');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  /**
   * Обновление задачи
   */
  async updateTask(id, taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          budget: taskData.budget,
          category: taskData.category || null,
          specialization: taskData.specialization,
          technologies: taskData.technologies || [],
          deadline: taskData.deadline || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка обновления задачи');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  /**
   * Удаление задачи
   */
  async deleteTask(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка удаления задачи');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },
};
