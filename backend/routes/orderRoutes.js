import express from 'express';
import pool from '../bd/pool.js';

const router = express.Router();

// Crear nuevo pedido
router.post('/create', async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      usuario,
      items,
      datosEnvio,
      metodoPago,
      montoTotal,
      costoEnvio
    } = req.body;

    // Validaciones básicas
    if (!usuario || !usuario.dni) {
      throw new Error('DNI del usuario es requerido');
    }

    if (!items || items.length === 0) {
      throw new Error('El pedido debe contener al menos un producto');
    }

    if (!montoTotal || montoTotal <= 0) {
      throw new Error('El monto total debe ser mayor a 0');
    }

    console.log('📝 Creando pedido para usuario:', usuario);
    console.log('🛒 Items del pedido:', items);
    console.log('💰 Monto total:', montoTotal);

    // Iniciar transacción
    await client.query('BEGIN');

    // Crear el pedido principal
    const pedidoQuery = `
      INSERT INTO pedido (
        id_usuario,
        fecha,
        estado,
        estado_pago,
        monto_total
      ) VALUES ($1, CURRENT_DATE, false, false, $2)
      RETURNING id_pedido
    `;

    // Convertir DNI a número ya que la BD lo espera como bigint
    const dniNumerico = parseInt(usuario.dni, 10);

    if (isNaN(dniNumerico)) {
      throw new Error('El DNI debe ser un número válido');
    }

    const pedidoResult = await client.query(pedidoQuery, [
      dniNumerico,
      montoTotal
    ]);

    const idPedido = pedidoResult.rows[0].id_pedido;

    // Insertar detalles del pedido
    console.log('📦 Insertando detalles del pedido...');
    for (const item of items) {
      const detalleQuery = `
        INSERT INTO detalle_pedido (
          id_pedido,
          id_producto,
          cantidad,
          precio_unitario,
          subtotal
        ) VALUES ($1, $2, $3, $4, $5)
      `;

      // Usar el id_producto si existe, sino usar NULL
      const productoId = item.id_producto || null;
      const cantidad = item.quantity || item.cantidad || 1;
      const precio = item.precio || 0;

      await client.query(detalleQuery, [
        idPedido,
        productoId,
        cantidad,
        precio,
        precio * cantidad
      ]);

      console.log(`   ✓ Producto agregado: ${item.nombre || 'Sin nombre'} x${cantidad}`);
    }
    console.log('✅ Detalles del pedido insertados');

    // Confirmar transacción
    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      idPedido,
      data: {
        id_pedido: idPedido,
        monto_total: montoTotal,
        fecha: new Date().toISOString(),
        estado: 'pendiente'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error detallado al crear pedido:', error);
    console.error('Stack trace:', error.stack);

    // Mejorar el mensaje de error según el tipo
    let errorMessage = 'Error al crear el pedido';
    let statusCode = 500;

    if (error.code === '23503') {
      errorMessage = 'El usuario no existe en la base de datos. Por favor, regístrate primero.';
      statusCode = 400;
    } else if (error.code === '23505') {
      errorMessage = 'Ya existe un pedido con estos datos.';
      statusCode = 409;
    } else if (error.code === '42P01') {
      errorMessage = 'Error de configuración de base de datos. Contacta al administrador.';
      statusCode = 500;
    } else if (error.message.includes('DNI')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('producto')) {
      errorMessage = error.message;
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: error.message,
      detail: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    client.release();
  }
});

// Obtener pedidos de un usuario
router.get('/user/:dni', async (req, res) => {
  try {
    const { dni } = req.params;

    const query = `
      SELECT
        p.id_pedido,
        p.fecha,
        p.estado,
        p.estado_pago,
        p.monto_total,
        COUNT(dp.id_detalle) as total_items
      FROM pedido p
      LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
      WHERE p.id_usuario = $1
      GROUP BY p.id_pedido
      ORDER BY p.fecha DESC
    `;

    const result = await pool.query(query, [dni]);

    res.json({
      success: true,
      pedidos: result.rows
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los pedidos',
      error: error.message
    });
  }
});

// Obtener detalles de un pedido específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener información del pedido
    const pedidoQuery = `
      SELECT
        p.*,
        u.nombre,
        u.apellido,
        u.email
      FROM pedido p
      JOIN usuario u ON p.id_usuario = u.dni
      WHERE p.id_pedido = $1
    `;

    const pedidoResult = await pool.query(pedidoQuery, [id]);

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    // Obtener detalles del pedido
    const detallesQuery = `
      SELECT
        dp.*,
        pr.nombre as producto_nombre,
        pr.descripcion as producto_descripcion
      FROM detalle_pedido dp
      JOIN producto pr ON dp.id_producto = pr.id_producto
      WHERE dp.id_pedido = $1
    `;

    const detallesResult = await pool.query(detallesQuery, [id]);

    res.json({
      success: true,
      pedido: pedidoResult.rows[0],
      detalles: detallesResult.rows
    });

  } catch (error) {
    console.error('Error al obtener detalles del pedido:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los detalles del pedido',
      error: error.message
    });
  }
});

// Actualizar estado de pago después de confirmar con MercadoPago
router.put('/:id/payment-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId, status, paymentMethod } = req.body;

    const query = `
      UPDATE pedido
      SET
        estado_pago = $1,
        id_mercadopago = $2
      WHERE id_pedido = $3
      RETURNING *
    `;

    const result = await pool.query(query, [
      status === 'approved',
      paymentId,
      id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Estado de pago actualizado',
      pedido: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar estado de pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado de pago',
      error: error.message
    });
  }
});

export default router;