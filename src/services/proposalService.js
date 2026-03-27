const API_BASE_URL = 'https://03ba-192-124-209-165.ngrok-free.app';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  const userId = localStorage.getItem('userId');
  if (userId) {
    headers['X-User-Id'] = userId;
  }

  return headers;
};

export const proposalService = {
  /**
   * Откликнуться на задачу
   * @param {string|number} taskId - ID задачи
   * @returns {Promise} - Результат отклика
   */
  async createProposal(taskId) {
    try {
      const executorId = localStorage.getItem('userId');

      if (!executorId) {
        throw new Error('Пользователь не авторизован');
      }

      const response = await fetch(`${API_BASE_URL}/api/proposals`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          taskId: taskId,
          executorId: executorId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка отправки отклика');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating proposal:', error);
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
      console.error('Error fetching proposals:', error);
      throw error;
    }
  },

  /**
   * Получение моих откликов (для исполнителя)
   * @returns {Promise} - Список откликов пользователя
   */
  async getUserProposals() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/proposals/my`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки ваших откликов');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user proposals:', error);
      throw error;
    }
  },
};
