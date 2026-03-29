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

export const proposalService = {
  /**
   * Откликнуться на задачу
   */
  async createProposal(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/proposals`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          taskId: taskId,
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
   * Получение откликов на задачу с пагинацией
   */
  async getTaskProposals(taskId, page = 1, limit = 18) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/proposals/task/${taskId}?page=${page}&limit=${limit}`,
        {
          method: 'GET',
          headers: getHeaders(),
          credentials: 'include',
        },
      );

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

  /**
   * Получение моих откликов с пагинацией
   */
  async getUserProposals(page = 1, limit = 18) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/proposals/my?page=${page}&limit=${limit}`, {
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
