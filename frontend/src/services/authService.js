const API_BASE = 'http://localhost:3001/api';

class AuthService {
  async register(userData) {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el registro');
      }

      const data = await response.json();
      
      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en el login');
      }

      const data = await response.json();
      
      // Guardar en localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('auth', JSON.stringify(data.user));
      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getProfile() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No hay token disponible');
    }

    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        this.logout();
        throw new Error('Sesión expirada');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('auth');
    window.location.href = '/inicioSesion';
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUser() {
    const user = localStorage.getItem('auth');
    return user ? JSON.parse(user) : null;
  }
}

export default new AuthService();