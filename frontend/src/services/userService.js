// Servicio para operaciones de usuario (perfil, actualización, etc.)
const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

class UserService {
  /**
   * Obtener perfil del usuario autenticado
   * @returns {Promise<Object>} Datos del usuario
   */
  async getProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No estás autenticado');
      }

      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener perfil');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Error en getProfile:', error);
      throw error;
    }
  }

  /**
   * Actualizar perfil del usuario autenticado
   * @param {Object} profileData - Datos del perfil a actualizar
   * @param {string} profileData.nombre - Nombre del usuario
   * @param {string} profileData.apellido - Apellido del usuario
   * @param {string} profileData.email - Email del usuario
   * @param {string} [profileData.telefono] - Teléfono del usuario (opcional)
   * @param {string} [profileData.direccion] - Dirección del usuario (opcional)
   * @returns {Promise<Object>} Usuario actualizado
   */
  async updateProfile(profileData) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No estás autenticado');
      }

      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Manejo de errores de validación
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(err => err.msg).join(', ');
          throw new Error(errorMessages);
        }

        throw new Error(errorData.error || 'Error al actualizar perfil');
      }

      const data = await response.json();

      // Actualizar localStorage con los nuevos datos
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      console.error('Error en updateProfile:', error);
      throw error;
    }
  }
}

export default new UserService();
