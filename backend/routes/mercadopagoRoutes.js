import express from 'express';

// Importar middleware de validación
import {
  validarCrearPreferencia,
  validarConsultarEstado,
  validarWebhook
} from '../middleware/mercadopagoValidation.js';

// Importar middleware de seguridad
import {
  validarSignatureMercadoPago,
  validarIPMercadoPago,
  limitarWebhooks
} from '../middleware/webhookSecurity.js';

// Importar controllers
import {
  crearPreferencia,
  consultarEstado,
  webhookNotification
} from '../controllers/mercadopagoController.js';

const router = express.Router();

// ============================================
// RUTAS DE PAGOS
// ============================================

/**
 * POST /api/pagos/crear-preferencia
 * Crear una preferencia de pago en MercadoPago
 * 
 * Middleware aplicado:
 * - validarCrearPreferencia: Valida items, payer, orderId
 * 
 * Body esperado:
 * {
 *   items: [{ title, quantity, unit_price, ... }],
 *   payer: { name, surname, email, ... },
 *   orderId: "ORDEN-123" (opcional)
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   preferenceId: "...",
 *   initPoint: "https://...",
 *   orderId: "..."
 * }
 */
router.post(
  '/crear-preferencia',
  validarCrearPreferencia,  // Middleware de validación
  crearPreferencia          // Controller
);

/**
 * GET /api/pagos/estado/:orderId
 * Consultar el estado de un pago/orden
 * 
 * Middleware aplicado:
 * - validarConsultarEstado: Valida formato del orderId
 * 
 * Params:
 * - orderId: ID único de la orden
 * 
 * Response:
 * {
 *   success: true,
 *   orderId: "...",
 *   status: "approved|pending|rejected",
 *   statusDetail: "...",
 *   transactionAmount: 15000
 * }
 */
router.get(
  '/estado/:orderId',
  validarConsultarEstado,   // Middleware de validación
  consultarEstado           // Controller
);

// ============================================
// WEBHOOKS DE MERCADOPAGO
// ============================================

/**
 * POST /api/webhooks/mercadopago
 * Recibir notificaciones de MercadoPago sobre cambios en pagos
 * 
 * Middleware aplicado (en orden):
 * 1. validarSignatureMercadoPago: Valida firma HMAC-SHA256
 * 2. validarIPMercadoPago: Loguea IP de origen
 * 3. limitarWebhooks: Rate limiting (100/min por IP)
 * 4. validarWebhook: Valida estructura del body
 * 
 * Headers requeridos:
 * - x-signature: "ts=...,v1=..."
 * - x-request-id: "unique-request-id"
 * 
 * Body esperado:
 * {
 *   type: "payment",
 *   data: { id: "123456789" }
 * }
 * 
 * Response:
 * { received: true }
 */
router.post(
  '/webhook',
  validarSignatureMercadoPago,  // 1. Seguridad criptográfica
  validarIPMercadoPago,         // 2. Log de IP
  limitarWebhooks,              // 3. Rate limiting
  validarWebhook,               // 4. Validación de estructura
  webhookNotification           // 5. Controller
);

export default router;