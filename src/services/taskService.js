import { API_BASE_URL } from './ApiConsts';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  return headers;
};

export const taskService = {
  async getAllTasks(page = 1, limit = 18) {
    try {
      const response = await fetch(`${API_BASE_URL}/work/api/tasks?page=${page}&limit=${limit}`, {
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

  async getUserTasks() {
    try {
      const response = await fetch(`${API_BASE_URL}/work/api/tasks/my`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка загрузки ваших задач');
      }

      const tasksData = await response.json();

      const tasksWithContacts = await Promise.all(
        tasksData.data.map(async (task) => {
          if (!task.executors) return task;

          // return {
          //       ...task,
          //       contact: {
          //         email: contactData.email,
          //         phone: contactData.phone,
          //         telegramUsername: contactData.telegramUsername,
          //       },
          try {
            const allContacts = await Promise.all(task.executors.map(async executorId => {
              const contactResponse = await fetch(`${API_BASE_URL}/profile/profiles/me/contact/${executorId}`, {
                method: 'GET',
                headers: getHeaders(),
                credentials: 'include',
              });

              if (contactResponse.ok) {
                const contactData = await contactResponse.json();
                return contactData;
              }
            }));

            return {
              ...task,
              contacts: allContacts
            };
          } catch (contactError) {
            console.warn(
              `Не удалось загрузить контакты для task.executors ${task.executors}:`,
              contactError,
            );
          }

          return task;
        }),
      );

      return {
        ...tasksData,
        data: tasksWithContacts,
      };
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      throw error;
    }
  },

  async getTaskById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/work/api/tasks/${id}`, {
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

  async createTask(taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/work/api/tasks`, {
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

  async updateTask(id, taskData) {
    try {
      const response = await fetch(`${API_BASE_URL}/work/api/tasks/${id}`, {
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

  async deleteTask(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/work/api/tasks/${id}`, {
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
