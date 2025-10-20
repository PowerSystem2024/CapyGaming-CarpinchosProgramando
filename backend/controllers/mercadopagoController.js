// El controller es el que coordina todo: recibe peticiones, valida datos, usa el servicio, maneja la bd y responde
import pool from '../bd/pool.js';
import * as mercadopagoService from '../services/mercadopagoService.js';

/**
 * Crear preferencia de pago en MercadoPago
 * Endpoint: POST /api/pagos/crear-preferencia

Lo que devuelve al frontend:
{
  "success": true,
  "preferenceId": "123456-abc-def",
  "initPoint": "https://www.mercadopago.com.ar/checkout/...",
  "orderId": "ORDEN-123456"
}
 */
export const crearPreferencia = async (req, res) => {
  const { items, payer, orderId } = req.body;

  try {
    // 1. Validar que los datos necesarios estén presentes
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Se requiere al menos un item en el pedido'
      });
    }

    if (!payer || !payer.email || !payer.name) {
      return res.status(400).json({
        success: false,
        error: 'Información del comprador incompleta'
      });
    }

    // 2. Calcular total del pedido
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.unit_price) * parseInt(item.quantity));
    }, 0);

    // 3. Generar orderId único si no viene del frontend
    const ordenIdFinal = orderId || `ORDEN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 4. Guardar la orden en la base de datos
    const ordenResult = await pool.query(
      `INSERT INTO orden_pago (orden_id, dni_usuario, total, estado)
       VALUES ($1, $2, $3, $4)
       RETURNING id_orden, orden_id`,
      [ordenIdFinal, payer.dni || null, total, 'pending']
    );

    const idOrden = ordenResult.rows[0].id_orden;

    // 5. Guardar los items de la orden
    for (const item of items) {
      await pool.query(
        `INSERT INTO item_orden (id_orden, producto_id, nombre, cantidad, precio_unitario, precio_total, imagen_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          idOrden,
          item.id || null,
          item.title,
          item.quantity,
          item.unit_price,
          item.unit_price * item.quantity,
          item.picture_url || null
        ]
      );
    }

    // 6. Crear preferencia en MercadoPago usando el servicio
    const preferenciaData = {
      items: items,
      payer: payer,
      orderId: ordenIdFinal
    };

    const mpResponse = await mercadopagoService.crearPreferencia(preferenciaData);

    // 7. Guardar la preferencia en la base de datos con initPoint
    await pool.query(
      `INSERT INTO pago_mercadopago (id_orden, preference_id, external_reference, currency_id, status)
       VALUES ($1, $2, $3, $4, $5)`,
      [idOrden, mpResponse.preferenceId, ordenIdFinal, 'ARS', 'pending']
    );

    // 8. Responder al frontend con los datos necesarios
    res.status(200).json({
      success: true,
      preferenceId: mpResponse.preferenceId,
      initPoint: mpResponse.initPoint,
      sandboxInitPoint: mpResponse.sandboxInitPoint,
      orderId: ordenIdFinal
    });

  } catch (error) {
    console.error('Error en crearPreferencia:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear la preferencia de pago',
      message: error.message
    });
  }
};

/**
 * Consultar estado de un pago/orden
 * Endpoint: GET /api/pagos/estado/:orderId
 
 Responde:
{
  "success": true,
  "orderId": "ORDEN-123456",
  "status": "approved",
  "statusDetail": "accredited",
  "transactionAmount": 15000
}
 */
export const consultarEstado = async (req, res) => {
  const { orderId } = req.params;

  try {
    // 1. Buscar la orden en la base de datos
    const ordenResult = await pool.query(
      `SELECT op.*, pm.payment_id, pm.status, pm.status_detail, 
              pm.payment_method, pm.transaction_amount
       FROM orden_pago op
       LEFT JOIN pago_mercadopago pm ON op.id_orden = pm.id_orden
       WHERE op.orden_id = $1`,
      [orderId]
    );

    if (ordenResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
    }

    const orden = ordenResult.rows[0];

    // 2. Si hay payment_id, consultar estado actualizado en MercadoPago
    let estadoActualizado = {
      orderId: orden.orden_id,
      status: orden.status || 'pending',
      total: parseFloat(orden.total)
    };

    if (orden.payment_id) {
      try {
        const mpPayment = await mercadopagoService.obtenerPago(orden.payment_id);
        
        // Actualizar estado en la base de datos si cambió
        if (mpPayment.payment.status !== orden.status) {
          await pool.query(
            `UPDATE pago_mercadopago 
             SET status = $1, status_detail = $2, fecha_actualizacion = NOW()
             WHERE payment_id = $3`,
            [mpPayment.payment.status, mpPayment.payment.status_detail, orden.payment_id]
          );

          await pool.query(
            `UPDATE orden_pago 
             SET estado = $1, fecha_actualizacion = NOW()
             WHERE orden_id = $2`,
            [mpPayment.payment.status, orderId]
          );
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
 * Endpoint: POST /api/webhooks/mercadopago
 */
export const webhookNotification = async (req, res) => {
  try {
    const { type, data } = req.body;

    // 1. Registrar el evento del webhook en la base de datos
    await pool.query(
      `INSERT INTO webhook_evento (tipo_evento, payment_id, data_json, procesado)
       VALUES ($1, $2, $3, $4)`,
      [type, data?.id || null, JSON.stringify(req.body), false]
    );

    // 2. Procesar solo eventos de tipo "payment"
    if (type === 'payment') {
      const paymentId = data.id;

      // 3. Consultar información del pago en MercadoPago
      const mpPayment = await mercadopagoService.obtenerPago(paymentId);
      
      const externalReference = mpPayment.payment.external_reference;
      const status = mpPayment.payment.status;
      const statusDetail = mpPayment.payment.status_detail;

      // 4. Actualizar el pago en la base de datos
      const pagoUpdateResult = await pool.query(
        `UPDATE pago_mercadopago 
         SET payment_id = $1, status = $2, status_detail = $3, 
             transaction_amount = $4, payment_method = $5, fecha_actualizacion = NOW()
         WHERE external_reference = $6
         RETURNING id_orden`,
        [
          paymentId,
          status,
          statusDetail,
          mpPayment.payment.transaction_amount,
          mpPayment.payment.payment_method_id,
          externalReference
        ]
      );

      // 5. Actualizar el estado de la orden
      if (pagoUpdateResult.rows.length > 0) {
        await pool.query(
          `UPDATE orden_pago 
           SET estado = $1, fecha_actualizacion = NOW()
           WHERE id_orden = $2`,
          [status, pagoUpdateResult.rows[0].id_orden]
        );

        // Marcar webhook como procesado
        await pool.query(
          `UPDATE webhook_evento 
           SET procesado = TRUE 
           WHERE payment_id = $1 AND tipo_evento = $2`,
          [paymentId, type]
        );
      }
    }

    // 6. IMPORTANTE: Siempre responder 200 a MercadoPago
    res.status(200).json({ received: true });

  } catch (error) {
    console.error('Error en webhookNotification:', error);
    // Aunque haya error, responder 200 para que MP no reintente
    res.status(200).json({ received: true, error: error.message });
  }
};

export default {
  crearPreferencia,
  consultarEstado,
  webhookNotification
};