import express from 'express';
<<<<<<< HEAD
import {
  register,
  login,
  requestPasswordReset,
  getProfile
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  recoveryValidation
=======
import { 
  register, 
  login, 
  requestPasswordReset, 
  getProfile 
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { 
  registerValidation, 
  loginValidation, 
  recoveryValidation 
>>>>>>> 5beacc4079cd22d27b035928717b8d98d456a4ce
} from '../middleware/validation.js';

const router = express.Router();

// Rutas públicas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', recoveryValidation, requestPasswordReset);

// Rutas protegidas
router.get('/profile', authenticateToken, getProfile);

export default router;