import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  syncCart,
  clearCart
} from '../controllers/cartController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas del carrito requieren autenticación
router.get('/carrito', verifyToken, getCart);
router.post('/carrito', verifyToken, addToCart);
router.put('/carrito/:id_producto', verifyToken, updateCartItem);
router.delete('/carrito/:id_producto', verifyToken, removeFromCart);
router.post('/carrito/sync', verifyToken, syncCart);
router.delete('/carrito', verifyToken, clearCart);

export default router;
