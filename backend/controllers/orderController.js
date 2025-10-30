// Controller para manejar endpoints relacionados con pedidos/órdenes
// Sigue el patrón de mercadopagoController: coordinación, validación y respuesta
import * as orderService from '../services/orderService.js';

/**
 * Obtener todos los pedidos del usuario autenticado
 * Endpoint: GET /api/pedidos/mis-pedidos
 *
 * Requiere: Token JWT (middleware verifyToken)
 * req.user contiene: { userId: dni, email: email }
 *
 * Responde:
 * {
 *   "success": true,
 *   "pedidos": [
 *     {
 *       "id_orden": 1,
 *       "orden_id": "ORDEN-123456",
 *       "total": 15000,
 *       "estado": "approved",
 *       "fecha_creacion": "2025-01-15T10:30:00",
 *       "items": [...],
 *       "payment_id": "123456789",
 *       "status": "approved"
 *     }
 *   ]
 * }
 */
export const obtenerMisPedidos = async (req, res) => {
  try {
    // 1. Obtener DNI del usuario desde el token JWT
    const dniUsuario = req.user.userId;

    if (!dniUsuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    console.log('Obteniendo pedidos del usuario:', dniUsuario);

    // 2. Consultar pedidos en el service
    const pedidos = await orderService.getOrdersByUserId(dniUsuario);

    // 3. Responder con los pedidos
    res.status(200).json({
      success: true,
      pedidos: pedidos,
      total: pedidos.length
    });

  } catch (error) {
    console.error('Error en obtenerMisPedidos:', error);

    res.status(500).json({
      success: false,
      error: 'Error al obtener los pedidos',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtener detalle completo de un pedido específico
 * Endpoint: GET /api/pedidos/:orderId
 *
 * Requiere: Token JWT (middleware verifyToken)
 * req.user contiene: { userId: dni, email: email }
 *
 * Params:
 * - orderId: ID único de la orden (orden_id)
 *
 * Responde:
 * {
 *   "success": true,
 *   "pedido": {
 *     "id_orden": 1,
 *     "orden_id": "ORDEN-123456",
 *     "total": 15000,
 *     "estado": "approved",
 *     "fecha_creacion": "2025-01-15T10:30:00",
 *     "usuario_nombre": "Juan",
 *     "usuario_apellido": "Pérez",
 *     "usuario_email": "juan@example.com",
 *     "items": [...],
 *     "payment_id": "123456789",
 *     "status": "approved",
 *     "status_detail": "accredited"
 *   }
 * }
 */
export const obtenerDetallePedido = async (req, res) => {
  const { orderId } = req.params;

  try {
    // 1. Validar que orderId está presente
    if (!orderId) {
      return res.status(400).json({
        success: false,
        error: 'ID de pedido requerido'
      });
    }

    // 2. Obtener DNI del usuario desde el token JWT
    const dniUsuario = req.user.userId;

    if (!dniUsuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    console.log('Obteniendo detalle del pedido:', orderId, 'para usuario:', dniUsuario);

    // 3. Consultar detalle del pedido (valida que pertenezca al usuario)
    const pedido = await orderService.getOrderDetailById(orderId, dniUsuario);

    // 4. Validar si el pedido existe y pertenece al usuario
    if (!pedido) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado o no autorizado'
      });
    }

    // 5. Responder con el detalle completo
    res.status(200).json({
      success: true,
      pedido: pedido
    });

  } catch (error) {
    console.error('Error en obtenerDetallePedido:', error);

    res.status(500).json({
      success: false,
      error: 'Error al obtener el detalle del pedido',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export default {
  obtenerMisPedidos,
  obtenerDetallePedido
};
