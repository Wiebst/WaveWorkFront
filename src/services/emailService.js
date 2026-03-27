const API_BASE_URL = 'https://03ba-192-124-209-165.ngrok-free.app';

export const emailService = {
  async sendConfirmationCode(email) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/notification/bind/send-email-confirm?email=${encodeURIComponent(email)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка отправки кода');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending confirmation code:', error);
      throw error;
    }
  },

  async confirmEmailCode(code) {
    try {
      const response = await fetch(`${API_BASE_URL}/notification/bind/confirm-email-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Неверный код подтверждения');
      }

      return await response.json();
    } catch (error) {
      console.error('Error confirming email code:', error);
      throw error;
    }
  },
};
