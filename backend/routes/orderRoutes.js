import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  mercadopagoWebhook,
  cancelOrder
} from '../controllers/orderController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas protegidas (requieren autenticación)
router.post('/pedidos', verifyToken, createOrder);
router.get('/pedidos', verifyToken, getUserOrders);
router.get('/pedidos/:id', verifyToken, getOrderById);
router.post('/pedidos/:id/cancelar', verifyToken, cancelOrder);

// Webhook de Mercado Pago (NO requiere autenticación)
router.post('/pedidos/webhook', mercadopagoWebhook);

export default router;
