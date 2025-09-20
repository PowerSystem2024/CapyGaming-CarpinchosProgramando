import express from 'express';
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
} from '../middleware/validation.js';

const router = express.Router();

// Rutas públicas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password', recoveryValidation, requestPasswordReset);

// Rutas protegidas
router.get('/profile', authenticateToken, getProfile);

export default router;