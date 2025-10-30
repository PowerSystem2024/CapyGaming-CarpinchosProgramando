// Servicio para manejar lógica de negocio de usuarios
import pool from '../bd/pool.js';

/**
 * Obtener usuario por DNI
 * @param {number} dni - DNI del usuario
 * @returns {Promise<Object>} - Datos del usuario (sin contraseña)
 */
export const getUserByDni = async (dni) => {
  try {
    const result = await pool.query(
      `SELECT dni, nombre, apellido, email, telefono, direccion, fecha_registro
       FROM usuario
       WHERE dni = $1`,
      [dni]
    );

    if (result.rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error en getUserByDni:', error);
    throw error;
  }
};

/**
 * Verificar si un email ya está en uso por otro usuario
 * @param {string} email - Email a verificar
 * @param {number} excludeDni - DNI a excluir de la búsqueda (usuario actual)
 * @returns {Promise<boolean>} - True si el email ya está en uso
 */
export const isEmailTaken = async (email, excludeDni) => {
  try {
    const result = await pool.query(
      'SELECT dni FROM usuario WHERE email = $1 AND dni != $2',
      [email, excludeDni]
    );

    return result.rows.length > 0;
  } catch (error) {
    console.error('Error en isEmailTaken:', error);
    throw error;
  }
};

/**
 * Actualizar perfil de usuario
 * @param {number} dni - DNI del usuario
 * @param {Object} updateData - Datos a actualizar (nombre, apellido, email, telefono, direccion)
 * @returns {Promise<Object>} - Usuario actualizado
 */
export const updateUserProfile = async (dni, updateData) => {
  try {
    const { nombre, apellido, email, telefono, direccion } = updateData;

    // Verificar que el usuario existe
    const userExists = await pool.query('SELECT dni FROM usuario WHERE dni = $1', [dni]);
    if (userExists.rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar si el email está en uso por otro usuario
    if (email) {
      const emailTaken = await isEmailTaken(email, dni);
      if (emailTaken) {
        const error = new Error('El email ya está en uso por otro usuario');
        error.code = 'EMAIL_TAKEN';
        throw error;
      }
    }

    // Actualizar usuario
    const result = await pool.query(
      `UPDATE usuario
       SET nombre = $1,
           apellido = $2,
           email = $3,
           telefono = $4,
           direccion = $5
       WHERE dni = $6
       RETURNING dni, nombre, apellido, email, telefono, direccion, fecha_registro`,
      [nombre, apellido, email, telefono || null, direccion || null, dni]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error en updateUserProfile:', error);
    throw error;
  }
};

export default {
  getUserByDni,
  isEmailTaken,
  updateUserProfile
};
