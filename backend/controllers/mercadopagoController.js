// El controller coordina: recibe peticiones, valida datos, usa servicios y responde
// Toda la lógica de BD está en orderService (service layer pattern)
import * as mercadopagoService from '../services/mercadopagoService.js';
import * as orderService from '../services/orderService.js';

/**
 * Crear preferencia de pago en MercadoPago
 * Endpoint: POST /api/pagos/crear-preferencia
 *
 * Responde:
 * {
 *   "success": true,
 *   "preferenceId": "123456-abc-def",
 *   "initPoint": "https://www.mercadopago.com.ar/checkout/...",
 *   "orderId": "ORDEN-123456"
 * }
 */
export const crearPreferencia = async (req, res) => {
  const { items, payer } = req.body;

  try {
    // 1. Validaciones de entrada
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere al menos un item en el pedido'
      });
    }

    if (!payer || !payer.email || !payer.name || !payer.surname) {
      return res.status(400).json({
        success: false,
        error: 'Información del comprador incompleta (name, surname, email requeridos)'
      });
    }

    // 2. Calcular total
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.unit_price) * parseInt(item.quantity));
    }, 0);

    // 3. Generar orderId único
    const ordenId = `ORDEN-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    console.log('Creando orden:', ordenId, 'Total:', total);

    // 4. Crear orden en BD con transacción (orderService)
    const orderResult = await orderService.createOrder({
      items,
      payer,
      total,
      orderId: ordenId
    });

    console.log('Orden creada en BD:', orderResult.idOrden);

    // 5. Crear preferencia en MercadoPago
    const preferenciaData = {
      items: items,
      payer: payer,
      orderId: ordenId
    };

    const mpResponse = await mercadopagoService.createPreference(preferenciaData);

    console.log('Preferencia creada en MercadoPago:', mpResponse.preferenceId);

    // 6. Actualizar con preference_id
    await orderService.updateOrderWithPreferenceId(
      orderResult.idOrden,
      mpResponse.preferenceId
    );

    // 7. Responder al frontend
    res.status(200).json({
      success: true,
      preferenceId: mpResponse.preferenceId,
      initPoint: mpResponse.initPoint,
      sandboxInitPoint: mpResponse.sandboxInitPoint,
      orderId: ordenId
    });

  } catch (error) {
    console.error('Error en crearPreferencia:', error);

    res.status(500).json({
      success: false,
      error: 'Error al crear la preferencia de pago',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Consultar estado de un pago/orden
 * Endpoint: GET /api/pagos/estado/:orderId
 *
 * Responde:
 * {
 *   "success": true,
 *   "orderId": "ORDEN-123456",
 *   "status": "approved",
 *   "statusDetail": "accredited",
 *   "transactionAmount": 15000
 * }
 */
export const consultarEstado = async (req, res) => {
  const { orderId } = req.params;

  try {
    // 1. Buscar orden en BD
    const orden = await orderService.getOrderById(orderId);

    if (!orden) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }

    // 2. Preparar respuesta base
    let estadoActualizado = {
      orderId: orden.orden_id,
      status: orden.status || 'pending',
      total: parseFloat(orden.total)
    };

    // 3. Si hay payment_id, consultar estado actualizado en MercadoPago
    if (orden.payment_id) {
      try {
        const mpPayment = await mercadopagoService.obtenerPago(orden.payment_id);

        // Actualizar en BD si el estado cambió
        if (mpPayment.payment.status !== orden.status) {
          await orderService.updateOrderPaymentStatus(orden.orden_id, {
            paymentId: mpPayment.payment.id,
            status: mpPayment.payment.status,
            statusDetail: mpPayment.payment.status_detail,
            transactionAmount: mpPayment.payment.transaction_amount,
            paymentMethod: mpPayment.payment.payment_method_id
          });
        }

        estadoActualizado = {
          orderId: orden.orden_id,
          status: mpPayment.payment.status,
          statusDetail: mpPayment.payment.status_detail,
          paymentId: mpPayment.payment.id,
          transactionAmount: mpPayment.payment.transaction_amount,
          paymentMethod: mpPayment.payment.payment_method_id,
          dateApproved: mpPayment.payment.date_approved
        };

      } catch (mpError) {
        console.error('Error consultando MercadoPago:', mpError);
        // Si falla MP, devolvemos el estado de la BD
      }
    }

    res.json({
      success: true,
      ...estadoActualizado
    });

  } catch (error) {
    console.error('Error en consultarEstado:', error);
    res.status(500).json({
      success: false,
      error: 'Error al consultar el estado del pago'
    });
  }
};

/**
 * Webhook para recibir notificaciones de MercadoPago
 * Endpoint: POST /api/webhooks/webhook
 *
 * Documentación: https://www.mercadopago.com.ar/developers/en/docs/your-integrations/notifications/webhooks
 */
export const webhookNotification = async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Webhook recibido:', type, data?.id);

    // 1. Registrar evento del webhook
    await orderService.logWebhookEvent({
      type,
      paymentId: data?.id || null,
      data: req.body
    });

    // 2. Procesar solo eventos de tipo "payment"
    if (type === 'payment') {
      const paymentId = data.id;

      // 3. Consultar información del pago en MercadoPago
      const mpPayment = await mercadopagoService.obtenerPago(paymentId);

      const externalReference = mpPayment.payment.external_reference;
      const status = mpPayment.payment.status;
      const statusDetail = mpPayment.payment.status_detail;

      // 4. Validar que externalReference exista
      if (!externalReference) {
        console.error('Pago sin external_reference:', paymentId);
        return res.status(200).json({
          received: true,
          error: 'No external reference'
        });
      }

      console.log('Actualizando pago:', externalReference, status);

      // 5. Actualizar estado de orden y pago (con transacción)
      await orderService.updateOrderPaymentStatus(externalReference, {
        paymentId,
        status,
        statusDetail,
        transactionAmount: mpPayment.payment.transaction_amount,
        paymentMethod: mpPayment.payment.payment_method_id
      });

      // 6. Marcar webhook como procesado
      await orderService.markWebhookAsProcessed(paymentId, type);

      console.log('Webhook procesado exitosamente:', paymentId);
    }

    // 7. IMPORTANTE: Siempre responder 200 a MercadoPago
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error en webhookNotification:', error);
    // Aunque haya error, responder 200 para que MP no reintente
    res.status(200).json({ received: true, error: error.message });
  }
};

/**
 * Obtener la public key de MercadoPago
 * Endpoint: GET /api/pagos/public-key
 *
 * Responde:
 * {
 *   "success": true,
 *   "publicKey": "APP_USR-..."
 * }
 */
export const getPublicKey = async (req, res) => {
  try {
    const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;

    if (!publicKey) {
      return res.status(500).json({
        success: false,
        error: 'Public key no configurada'
      });
    }

    res.status(200).json({
      success: true,
      publicKey: publicKey
    });
  } catch (error) {
    console.error('Error obteniendo public key:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener public key'
    });
  }
};

export default {
  crearPreferencia,
  consultarEstado,
  webhookNotification,
  getPublicKey
};