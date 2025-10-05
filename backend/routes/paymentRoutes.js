import express from 'express';
import { 
  createPreference, 
  handleWebhook, 
  getOrderStatus, 
  getUserOrders 
} from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/payments/create-preference - Crear preferencia de pago (requiere auth)
router.post('/create-preference', authenticateToken, createPreference);

// POST /api/payments/webhook - Webhook de Mercado Pago (NO requiere auth)
router.post('/webhook', handleWebhook);

// GET /api/payments/order/:orderId - Obtener estado del pedido (requiere auth)
router.get('/order/:orderId', authenticateToken, getOrderStatus);

// GET /api/payments/orders - Obtener todos los pedidos del usuario (requiere auth)
router.get('/orders', authenticateToken, getUserOrders);

export default router;