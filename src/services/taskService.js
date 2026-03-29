import { API_BASE_URL } from './ApiConsts';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    // 'ngrok-skip-browser-warning': 'true',
  };
};

export const taskService = {
  /**
   * Получение всех задач (для страницы "Задачи")
   * @returns {Promise} - Список задач
   */
  async getAllTasks() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
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
   * Получение задач пользователя (для страницы "Отклики")
   * @returns {Promise} - Список задач пользователя
   */
  async getUserTasks() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/user`, {
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
   * @param {string|number} id - ID задачи
   * @returns {Promise} - Данные задачи
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
   * @param {Object} taskData - Данные задачи
   * @returns {Promise} - Созданная задача
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
          category: taskData.category || 'null',
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
   * @param {string|number} id - ID задачи
   * @param {Object} taskData - Обновленные данные задачи
   * @returns {Promise} - Обновленная задача
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
          category: taskData.category || 'null',
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
   * @param {string|number} id - ID задачи
   * @returns {Promise} - Результат удаления
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

  /**
   * Получение откликов на задачу (для работодателя)
   * @param {string|number} taskId - ID задачи
   * @returns {Promise} - Список откликов
   */
  async getTaskProposals(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/proposals`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки откликов');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching task proposals:', error);
      throw error;
    }
  },
};
