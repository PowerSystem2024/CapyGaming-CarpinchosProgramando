import express from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart, 
  syncCart 
} from '../controllers/cartController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/cart - Obtener carrito del usuario
router.get('/', getCart);

// POST /api/cart - Agregar producto al carrito
router.post('/', addToCart);

// PUT /api/cart - Actualizar cantidad de producto
router.put('/', updateCartItem);

// DELETE /api/cart/:producto_id - Eliminar producto del carrito
router.delete('/:producto_id', removeFromCart);

// DELETE /api/cart - Vaciar carrito completo
router.delete('/', clearCart);

// POST /api/cart/sync - Sincronizar carrito local con BD
router.post('/sync', syncCart);

export default router;