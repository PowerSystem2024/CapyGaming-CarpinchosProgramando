import { ref, computed } from 'vue';
import AuthService from '../services/authService.js';

  const user = ref(AuthService.getCurrentUser());
  const isAuthenticated = ref(AuthService.isAuthenticated());

  export function useAuth() {
  const login = async (email, password) => {
    try {
      const data = await AuthService.login({ email, password });
      user.value = data.user;
      isAuthenticated.value = true;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await AuthService.register(userData);
      user.value = data.user;
      isAuthenticated.value = true;
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    AuthService.logout();
    user.value = null;
    isAuthenticated.value = false;
  };

  // Recuperación de contraseña
  const forgotPassword = async (email) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la recuperación');
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  return {
    user: computed(() => user.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    login,
    register,
    logout,
    forgotPassword
  };
}