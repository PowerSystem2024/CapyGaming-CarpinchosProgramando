import pool from '../bd/pool.js';

/**
 * Service para manejar la lógica de órdenes y persistencia en BD
 * Implementa transacciones para garantizar integridad de datos
 *
 * Basado en:
 * - PostgreSQL Transactions: https://www.postgresql.org/docs/current/tutorial-transactions.html
 * - MercadoPago Best Practices
 */

/**
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

        // 🆕 VALIDACIÓN DE STOCK DISPONIBLE
    console.log('🔍 Validando stock disponible...');
    
    for (const item of items) {
      const stockQuery = `
        SELECT stock, nombre
        FROM producto
        WHERE id_producto = $1
      `;
      const stockResult = await client.query(stockQuery, [item.id]);
      
      if (stockResult.rows.length === 0) {
        throw new Error(`Producto con ID ${item.id} no existe`);
      }
      
      const { stock, nombre } = stockResult.rows[0];
      
      if (stock < item.quantity) {
        throw new Error(
          `Stock insuficiente para ${nombre}. ` +
          `Disponible: ${stock}, Solicitado: ${item.quantity}`
        );
      }
      
      console.log(`✅ ${nombre}: Stock OK (${stock} disponibles, ${item.quantity} solicitados)`);
    }

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

/**
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

/**
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

/**
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

    // Si el pago fue aprobado, actualizamos el stock
    if (paymentData.status === 'approved') {
      console.log('💰 Pago aprobado! Actualizando stock...');
      
      // Obtener los items de la orden
      const itemsQuery = `
        SELECT producto_id, cantidad
        FROM item_orden
        WHERE id_orden = $1
      `;
      const itemsResult = await client.query(itemsQuery, [idOrden]);
      
      // Actualizar stock de cada producto
      await updateProductStock(itemsResult.rows, client);
    }

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

/**
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

/**
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

async function updateProductStock(items, client) {
  console.log('🔄 Actualizando stock de productos...');

  for (const item of items) {
    const { producto_id, cantidad } = item;
    // Query para restar del stock
    const updateStockQuery = `
      UPDATE producto
      SET stock = stock - $1
      WHERE id_producto = $2
      RETURNING stock, nombre
    `;
    const result = await client.query(updateStockQuery, [cantidad, producto_id]);

    if (result.rows.length > 0) {
      const { stock, nombre } = result.rows[0];
      console.log(`✅ Stock actualizado: ${nombre} - Stock restante: ${stock}`);
    }
  }
}

/**
 * Obtener todos los pedidos de un usuario
 * @param {number} dniUsuario - DNI del usuario
 * @returns {Promise<Array>} - Lista de pedidos con items
 */
export const getOrdersByUserId = async (dniUsuario) => {
  try {
    const query = `
      SELECT
        op.id_orden,
        op.orden_id,
        op.total,
        op.estado as status,
        op.fecha_creacion as created_at,
        op.fecha_actualizacion as updated_at,
        pm.payment_id,
        pm.status as payment_status,
        pm.status_detail,
        pm.payment_method,
        pm.transaction_amount,
        json_agg(
          json_build_object(
            'id', io.id_item,
            'producto_id', io.producto_id,
            'title', io.nombre,
            'quantity', io.cantidad,
            'unit_price', io.precio_unitario,
            'total', io.precio_total,
            'picture_url', io.imagen_url
          ) ORDER BY io.id_item
        ) as items
      FROM orden_pago op
      LEFT JOIN pago_mercadopago pm ON op.id_orden = pm.id_orden
      LEFT JOIN item_orden io ON op.id_orden = io.id_orden
      WHERE op.dni_usuario = $1
      GROUP BY op.id_orden, pm.id_pago
      ORDER BY op.fecha_creacion DESC
    `;

    const result = await pool.query(query, [dniUsuario]);
    return result.rows;

  } catch (error) {
    console.error('Error en getOrdersByUserId:', error);
    throw new Error(`Error al obtener pedidos del usuario: ${error.message}`);
  }
};

/**
 * Obtener detalle completo de un pedido específico
 * @param {string} orderId - ID de la orden (orden_id)
 * @param {number} dniUsuario - DNI del usuario (para validar pertenencia)
 * @returns {Promise<Object|null>} - Detalle completo del pedido o null
 */
export const getOrderDetailById = async (orderId, dniUsuario) => {
  try {
    const query = `
      SELECT
        op.id_orden,
        op.orden_id,
        op.dni_usuario,
        op.total,
        op.estado as status,
        op.fecha_creacion as created_at,
        op.fecha_actualizacion as updated_at,
        pm.payment_id,
        pm.preference_id,
        pm.status as payment_status,
        pm.status_detail,
        pm.payment_method,
        pm.transaction_amount,
        pm.currency_id,
        u.nombre as usuario_nombre,
        u.apellido as usuario_apellido,
        u.email as usuario_email,
        u.telefono as usuario_telefono,
        u.direccion as usuario_direccion,
        json_agg(
          json_build_object(
            'id', io.id_item,
            'producto_id', io.producto_id,
            'title', io.nombre,
            'quantity', io.cantidad,
            'unit_price', io.precio_unitario,
            'total', io.precio_total,
            'picture_url', io.imagen_url
          ) ORDER BY io.id_item
        ) as items
      FROM orden_pago op
      LEFT JOIN pago_mercadopago pm ON op.id_orden = pm.id_orden
      LEFT JOIN item_orden io ON op.id_orden = io.id_orden
      LEFT JOIN usuario u ON op.dni_usuario = u.dni
      WHERE op.orden_id = $1 AND op.dni_usuario = $2
      GROUP BY op.id_orden, pm.id_pago, u.dni
    `;

    const result = await pool.query(query, [orderId, dniUsuario]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];

  } catch (error) {
    console.error('Error en getOrderDetailById:', error);
    throw new Error(`Error al obtener detalle del pedido: ${error.message}`);
  }
};

export default {
  createOrder,
  updateOrderWithPreferenceId,
  getOrderById,
  updateOrderPaymentStatus,
  logWebhookEvent,
  markWebhookAsProcessed,
  updateProductStock,
  getOrdersByUserId,
  getOrderDetailById
};
