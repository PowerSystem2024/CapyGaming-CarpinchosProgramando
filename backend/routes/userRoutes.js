// Rutas para operaciones de usuario
import express from 'express';
import { getProfile, updateProfile, validateProfileUpdate } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users/profile
 * Obtener perfil del usuario autenticado
 * Requiere autenticación (JWT)
 */
router.get('/profile', verifyToken, getProfile);

/**
 * PUT /api/users/profile
 * Actualizar perfil del usuario autenticado
 * Requiere autenticación (JWT)
 * Body: { nombre, apellido, email, telefono?, direccion? }
 */
router.put('/profile', verifyToken, validateProfileUpdate, updateProfile);

export default router;
