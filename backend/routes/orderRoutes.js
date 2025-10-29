import express from 'express';

// Importar middleware de autenticación
import { verifyToken } from '../middleware/auth.js';

// Importar controllers
import {
  obtenerMisPedidos,
  obtenerDetallePedido
} from '../controllers/orderController.js';

const router = express.Router();

// ============================================
// RUTAS DE PEDIDOS
// ============================================

/**
 * GET /api/pedidos/mis-pedidos
 * Obtener todos los pedidos del usuario autenticado
 *
 * Middleware aplicado:
 * - verifyToken: Valida token JWT y extrae datos del usuario (req.user)
 *
 * Headers requeridos:
 * - Authorization: "Bearer <token>"
 *
 * Response:
 * {
 *   success: true,
 *   pedidos: [
 *     {
 *       id_orden: 1,
 *       orden_id: "ORDEN-123456",
 *       total: 15000,
 *       estado: "approved",
 *       fecha_creacion: "2025-01-15T10:30:00",
 *       items: [...],
 *       payment_id: "123456789",
 *       status: "approved"
 *     }
 *   ],
 *   total: 5
 * }
 */
router.get(
  '/mis-pedidos',
  verifyToken,          // Middleware de autenticación
  obtenerMisPedidos     // Controller
);

/**
 * GET /api/pedidos/:orderId
 * Obtener el detalle completo de un pedido específico
 *
 * Middleware aplicado:
 * - verifyToken: Valida token JWT y extrae datos del usuario (req.user)
 *
 * Headers requeridos:
 * - Authorization: "Bearer <token>"
 *
 * Params:
 * - orderId: ID único de la orden (orden_id)
 *
 * Response:
 * {
 *   success: true,
 *   pedido: {
 *     id_orden: 1,
 *     orden_id: "ORDEN-123456",
 *     total: 15000,
 *     estado: "approved",
 *     fecha_creacion: "2025-01-15T10:30:00",
 *     usuario_nombre: "Juan",
 *     usuario_apellido: "Pérez",
 *     usuario_email: "juan@example.com",
 *     items: [...],
 *     payment_id: "123456789",
 *     status: "approved",
 *     status_detail: "accredited"
 *   }
 * }
 */
router.get(
  '/:orderId',
  verifyToken,            // Middleware de autenticación
  obtenerDetallePedido    // Controller
);

export default router;
