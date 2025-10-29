// Controlador para operaciones de usuario
import { updateUserProfile, getUserByDni } from '../services/userService.js';
import { body, validationResult } from 'express-validator';

/**
 * Obtener perfil del usuario actual
 * GET /api/users/profile
 */
export const getProfile = async (req, res) => {
  try {
    // req.user viene del middleware authMiddleware
    const user = await getUserByDni(req.user.userId);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error en getProfile:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener perfil de usuario'
    });
  }
};

/**
 * Actualizar perfil del usuario actual
 * PUT /api/users/profile
 */
export const updateProfile = async (req, res) => {
  try {
    // Validar errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { nombre, apellido, email, telefono, direccion } = req.body;
    const dni = req.user.userId; // DNI del usuario autenticado

    // Validar que los campos requeridos estén presentes
    if (!nombre || !apellido || !email) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, apellido y email son campos requeridos'
      });
    }

    // Actualizar perfil
    const updatedUser = await updateUserProfile(dni, {
      nombre,
      apellido,
      email,
      telefono,
      direccion
    });

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado correctamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error en updateProfile:', error);

    // Manejo de error específico para email duplicado
    if (error.code === 'EMAIL_TAKEN') {
      return res.status(400).json({
        success: false,
        error: 'El email ya está en uso por otro usuario'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Error al actualizar perfil de usuario'
    });
  }
};

/**
 * Validaciones para actualización de perfil
 */
export const validateProfileUpdate = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),

  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El apellido debe tener entre 2 y 100 caracteres'),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email debe ser válido')
    .normalizeEmail(),

  body('telefono')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[0-9\-\+\(\)\s]+$/).withMessage('El teléfono solo puede contener números y símbolos +, -, (), espacios')
    .isLength({ max: 20 }).withMessage('El teléfono no puede exceder 20 caracteres'),

  body('direccion')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('La dirección no puede exceder 255 caracteres')
];

export default {
  getProfile,
  updateProfile,
  validateProfileUpdate
};
