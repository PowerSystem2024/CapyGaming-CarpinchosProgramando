import pool from '../bd/pool.js';

/**
 * Service para manejar la lógica de órdenes y persistencia en BD
 * Implementa transacciones para garantizar integridad de datos
 *
 * Basado en:
 * - PostgreSQL Transactions: https://www.postgresql.org/docs/current/tutorial-transactions.html
 * - MercadoPago Best Practices
 */

/*/*
 * Crear orden con items en una transacción atómica
 * @param {Object} orderData - Datos de la orden
 * @param {Array} orderData.items - Items del pedido
 * @param {Object} orderData.payer - Información del pagador
 * @param {number} orderData.total - Total de la orden
 * @param {string} orderData.orderId - ID único de la orden
 * @returns {Promise<Object>} - Orden creada con id_orden
 */
export const createOrder = async (orderData) => {
  const { items, payer, total, orderId } = orderData;

  // Obtener cliente de conexión para transacción
  const client = await pool.connect();

  try {
    // INICIAR TRANSACCIÓN
    await client.query('BEGIN');

    console.log('Iniciando transacción de BD para orden:', orderId);

    // 1. Insertar orden principal
    const ordenResult = await client.query(
      `INSERT INTO orden_pago (orden_id, dni_usuario, total, estado)
       VALUES ($1, $2, $3, $4)
       RETURNING id_orden, orden_id, fecha_creacion`,
      [
        orderId,
        payer.identification?.number || null,
        total,
        'pending'
      ]
    );

    const orden = ordenResult.rows[0];
    console.log('Orden insertada en BD:', orden.id_orden);

    // 2. Insertar items de la orden
    const itemsInsertados = [];

    for (const item of items) {
      const itemResult = await client.query(
        `INSERT INTO item_orden (id_orden, producto_id, nombre, cantidad, precio_unitario, precio_total, imagen_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id_item`,
        [
          orden.id_orden,
          item.id || null,
          item.title,
          item.quantity,
          item.unit_price,
          item.unit_price * item.quantity,
          item.picture_url || null
        ]
      );

      itemsInsertados.push(itemResult.rows[0].id_item);
    }

    console.log(`${itemsInsertados.length} items insertados`);

    // 3. Crear registro inicial de pago (sin preference_id aún)
    const pagoResult = await client.query(
      `INSERT INTO pago_mercadopago (id_orden, external_reference, currency_id, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id_pago`,
      [orden.id_orden, orderId, 'ARS', 'pending']
    );

    console.log('Registro de pago creado:', pagoResult.rows[0].id_pago);

    // CONFIRMAR TRANSACCIÓN
    await client.query('COMMIT');
    console.log('Transacción confirmada exitosamente');

    return {
      success: true,
      idOrden: orden.id_orden,
      ordenId: orden.orden_id,
      fechaCreacion: orden.fecha_creacion,
      itemsCount: itemsInsertados.length
    };

  } catch (error) {
    // REVERTIR TRANSACCIÓN en caso de error
    await client.query('ROLLBACK');
    console.error('Error en createOrder, rollback ejecutado:', error);

    throw new Error(`Error al crear orden en BD: ${error.message}`);

  } finally {
    // LIBERAR CONEXIÓN
    client.release();
  }
};

/*/*
 * Actualizar orden con preference_id de MercadoPago
 * @param {number} idOrden - ID interno de la orden
 * @param {string} preferenceId - ID de preferencia de MercadoPago
 * @returns {Promise<Object>}
 */
export const updateOrderWithPreferenceId = async (idOrden, preferenceId) => {
  try {
    const result = await pool.query(
      `UPDATE pago_mercadopago
       SET preference_id = $1, fecha_actualizacion = NOW()
       WHERE id_orden = $2
       RETURNING id_pago`,
      [preferenceId, idOrden]
    );

    if (result.rows.length === 0) {
      throw new Error('No se encontró el pago para actualizar');
    }

    console.log('Preference ID actualizado:', preferenceId);

    return {
      success: true,
      idPago: result.rows[0].id_pago
    };

  } catch (error) {
    console.error('Error en updateOrderWithPreferenceId:', error);
    throw new Error(`Error al actualizar preference_id: ${error.message}`);
  }
};

/*/*
 * Obtener orden por orden_id
 * @param {string} orderId - ID de la orden
 * @returns {Promise<Object>} - Datos de la orden
 */
export const getOrderById = async (orderId) => {
  try {
    const result = await pool.query(
      `SELECT op.*, pm.payment_id, pm.preference_id, pm.status, pm.status_detail,
              pm.payment_method, pm.transaction_amount
       FROM orden_pago op
       LEFT JOIN pago_mercadopago pm ON op.id_orden = pm.id_orden
       WHERE op.orden_id = $1`,
      [orderId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];

  } catch (error) {
    console.error('Error en getOrderById:', error);
    throw new Error(`Error al obtener orden: ${error.message}`);
  }
};

/*/*
 * Actualizar estado de orden y pago
 * @param {string} externalReference - Referencia externa (orden_id)
 * @param {Object} paymentData - Datos del pago
 * @returns {Promise<Object>}
 */
export const updateOrderPaymentStatus = async (externalReference, paymentData) => {
  const { paymentId, status, statusDetail, transactionAmount, paymentMethod } = paymentData;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Actualizar pago_mercadopago
    const pagoResult = await client.query(
      `UPDATE pago_mercadopago
       SET payment_id = $1, status = $2, status_detail = $3,
           transaction_amount = $4, payment_method = $5, fecha_actualizacion = NOW()
       WHERE external_reference = $6
       RETURNING id_orden`,
      [paymentId, status, statusDetail, transactionAmount, paymentMethod, externalReference]
    );

    if (pagoResult.rows.length === 0) {
      throw new Error('No se encontró pago con external_reference: ' + externalReference);
    }

    const idOrden = pagoResult.rows[0].id_orden;

    // Actualizar orden_pago
    await client.query(
      `UPDATE orden_pago
       SET estado = $1, fecha_actualizacion = NOW()
       WHERE id_orden = $2`,
      [status, idOrden]
    );

    await client.query('COMMIT');

    console.log('Estado de orden actualizado:', externalReference, status);

    return {
      success: true,
      idOrden: idOrden
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en updateOrderPaymentStatus, rollback ejecutado:', error);
    throw new Error(`Error al actualizar estado: ${error.message}`);

  } finally {
    client.release();
  }
};

/*/*
 * Registrar evento de webhook
 * @param {Object} webhookData - Datos del webhook
 * @returns {Promise<Object>}
 */
export const logWebhookEvent = async (webhookData) => {
  const { type, paymentId, data } = webhookData;

  try {
    const result = await pool.query(
      `INSERT INTO webhook_evento (tipo_evento, payment_id, data_json, procesado)
       VALUES ($1, $2, $3, $4)
       RETURNING id_evento`,
      [type, paymentId, JSON.stringify(data), false]
    );

    return {
      success: true,
      idEvento: result.rows[0].id_evento
    };

  } catch (error) {
    console.error('Error en logWebhookEvent:', error);
    throw new Error(`Error al registrar webhook: ${error.message}`);
  }
};

/*/*
 * Marcar webhook como procesado
 * @param {string} paymentId - ID del pago
 * @param {string} type - Tipo de evento
 * @returns {Promise<Object>}
 */
export const markWebhookAsProcessed = async (paymentId, type) => {
  try {
    await pool.query(
      `UPDATE webhook_evento
       SET procesado = TRUE
       WHERE payment_id = $1 AND tipo_evento = $2`,
      [paymentId, type]
    );

    return { success: true };

  } catch (error) {
    console.error('Error en markWebhookAsProcessed:', error);
    throw new Error(`Error al marcar webhook: ${error.message}`);
  }
};

export default {
  createOrder,
  updateOrderWithPreferenceId,
  getOrderById,
  updateOrderPaymentStatus,
  logWebhookEvent,
  markWebhookAsProcessed
};