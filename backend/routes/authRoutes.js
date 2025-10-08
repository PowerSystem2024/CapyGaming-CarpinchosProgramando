import express from 'express';
import { 
  register, 
  login, 
  requestPasswordReset, 
  getProfile,
  logout
} from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
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
router.post('/logout', verifyToken ,logout);

// Rutas protegidas
router.get('/profile', verifyToken, getProfile);

export default router;