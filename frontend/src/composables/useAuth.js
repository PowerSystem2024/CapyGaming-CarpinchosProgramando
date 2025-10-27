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
    const result = await AuthService.requestPasswordReset(email);
    return { success: true, message: result.message };
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