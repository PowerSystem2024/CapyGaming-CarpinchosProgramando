import { ref, computed } from 'vue';
import AuthService from '../services/authService.js';

export function useAuth() {
  const user = ref(AuthService.getUser());
  const isAuthenticated = ref(AuthService.isAuthenticated());

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

  const checkAuth = async () => {
    if (isAuthenticated.value) {
      try {
        const data = await AuthService.getProfile();
        user.value = data.user;
      } catch (error) {
        logout();
      }
    }
  };

  return {
    user: computed(() => user.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    login,
    register,
    logout,
    checkAuth
  };
}