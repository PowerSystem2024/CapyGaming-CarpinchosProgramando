import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import pool from '../bd/pool.js';

// Configurar Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

const preference = new Preference(client);
const payment = new Payment(client);

// Crear preferencia de pago
export const createPreference = async (req, res) => {
  const { userId } = req.user;
  const { direccion_envio, telefono_contacto, notas } = req.body;

  try {
    // Obtener items del carrito
    const cartResult = await pool.query(`
      SELECT 
        c.producto_id,
        c.cantidad,
        c.precio_unitario,
        p.nombre,
        p.imagenes
      FROM carrito c
      LEFT JOIN producto p ON c.producto_id = p.id
      WHERE c.usuario_dni = $1
    `, [userId]);

    if (cartResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'El carrito está vacío'
      });
    }

    // Preparar items para Mercado Pago
    const items = cartResult.rows.map(item => ({
      id: item.producto_id.toString(),
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: parseFloat(item.precio_unitario),
      currency_id: 'ARS',
      picture_url: item.imagenes && item.imagenes[0] ? item.imagenes[0] : null
    }));

    const total = items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    // Obtener datos del usuario
    const userResult = await pool.query(
      'SELECT * FROM usuario WHERE dni = $1',
      [userId]
    );
    const user = userResult.rows[0];

    // Crear pedido en la base de datos
    const pedidoResult = await pool.query(`
      INSERT INTO pedido (
        usuario_dni, 
        total, 
        direccion_envio, 
        telefono_contacto, 
        notas
      ) VALUES ($1, $2, $3, $4, $5) 
      RETURNING id
    `, [userId, total, direccion_envio, telefono_contacto, notas]);

    const pedidoId = pedidoResult.rows[0].id;

    // Agregar items del pedido
    for (const cartItem of cartResult.rows) {
      const subtotal = cartItem.cantidad * parseFloat(cartItem.precio_unitario);
      await pool.query(`
        INSERT INTO pedido_item (
          pedido_id, 
          producto_id, 
          nombre_producto, 
          cantidad, 
          precio_unitario, 
          subtotal
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        pedidoId,
        cartItem.producto_id,
        cartItem.nombre,
        cartItem.cantidad,
        cartItem.precio_unitario,
        subtotal
      ]);
    }

    // Crear preferencia de Mercado Pago
    const preferenceData = {
      items: items,
      payer: {
        name: user.nombre,
        surname: user.apellido,
        email: user.email,
        phone: {
          number: telefono_contacto || user.telefono
        },
        identification: {
          type: 'DNI',
          number: user.dni
        }
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pago/success`,
        failure: `${process.env.FRONTEND_URL}/pago/failure`,
        pending: `${process.env.FRONTEND_URL}/pago/pending`
      },
      auto_return: 'approved',
      external_reference: pedidoId.toString(),
      notification_url: `${process.env.BACKEND_URL}/api/payments/webhook`,
      statement_descriptor: 'CAPYGAMING',
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
    };

    const preferenceResponse = await preference.create({ body: preferenceData });

    // Actualizar pedido con ID de preferencia
    await pool.query(
      'UPDATE pedido SET mercadopago_preference_id = $1 WHERE id = $2',
      [preferenceResponse.id, pedidoId]
    );

    // Registrar en historial
    await pool.query(`
      INSERT INTO pedido_historial (pedido_id, estado_nuevo, observaciones)
      VALUES ($1, 'pendiente', 'Preferencia de pago creada')
    `, [pedidoId]);

    res.json({
      success: true,
      preference_id: preferenceResponse.id,
      init_point: preferenceResponse.init_point,
      sandbox_init_point: preferenceResponse.sandbox_init_point,
      pedido_id: pedidoId
    });

  } catch (error) {
    console.error('Error al crear preferencia:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar el pago'
    });
  }
};

// Webhook para notificaciones de Mercado Pago
export const handleWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type === 'payment') {
      const paymentId = data.id;
      
      // Obtener información del pago
      const paymentInfo = await payment.get({ id: paymentId });
      
      const pedidoId = parseInt(paymentInfo.external_reference);
      
      // Actualizar estado del pedido según el estado del pago
      let nuevoEstado = '';
      let observaciones = '';

      switch (paymentInfo.status) {
        case 'approved':
          nuevoEstado = 'pagado';
          observaciones = `Pago aprobado. Payment ID: ${paymentId}`;
          
          // Limpiar carrito del usuario
          const pedido = await pool.query('SELECT usuario_dni FROM pedido WHERE id = $1', [pedidoId]);
          if (pedido.rows.length > 0) {
            await pool.query('DELETE FROM carrito WHERE usuario_dni = $1', [pedido.rows[0].usuario_dni]);
          }
          break;
          
        case 'rejected':
          nuevoEstado = 'cancelado';
          observaciones = `Pago rechazado. Motivo: ${paymentInfo.status_detail}`;
          break;
          
        case 'pending':
          nuevoEstado = 'pendiente';
          observaciones = `Pago pendiente. Motivo: ${paymentInfo.status_detail}`;
          break;
          
        case 'cancelled':
          nuevoEstado = 'cancelado';
          observaciones = 'Pago cancelado por el usuario';
          break;
          
        default:
          nuevoEstado = 'pendiente';
          observaciones = `Estado desconocido: ${paymentInfo.status}`;
      }

      // Actualizar pedido
      await pool.query(`
        UPDATE pedido 
        SET estado = $1, mercadopago_payment_id = $2, metodo_pago = $3
        WHERE id = $4
      `, [nuevoEstado, paymentId, paymentInfo.payment_method_id, pedidoId]);

      // Registrar en historial
      await pool.query(`
        INSERT INTO pedido_historial (pedido_id, estado_nuevo, observaciones)
        VALUES ($1, $2, $3)
      `, [pedidoId, nuevoEstado, observaciones]);

      console.log(`Pedido ${pedidoId} actualizado a estado: ${nuevoEstado}`);
    }

    res.status(200).send('OK');

  } catch (error) {
    console.error('Error en webhook:', error);
    res.status(500).send('Error');
  }
};

// Obtener estado del pedido
export const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.user;

  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        array_agg(
          json_build_object(
            'producto_id', pi.producto_id,
            'nombre_producto', pi.nombre_producto,
            'cantidad', pi.cantidad,
            'precio_unitario', pi.precio_unitario,
            'subtotal', pi.subtotal
          )
        ) as items
      FROM pedido p
      LEFT JOIN pedido_item pi ON p.id = pi.pedido_id
      WHERE p.id = $1 AND p.usuario_dni = $2
      GROUP BY p.id
    `, [orderId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    const pedido = result.rows[0];

    // Obtener historial
    const historialResult = await pool.query(`
      SELECT * FROM pedido_historial 
      WHERE pedido_id = $1 
      ORDER BY fecha_cambio DESC
    `, [orderId]);

    res.json({
      success: true,
      pedido: {
        id: pedido.id,
        total: parseFloat(pedido.total),
        estado: pedido.estado,
        fecha_creacion: pedido.fecha_creacion,
        fecha_actualizacion: pedido.fecha_actualizacion,
        direccion_envio: pedido.direccion_envio,
        telefono_contacto: pedido.telefono_contacto,
        items: pedido.items,
        historial: historialResult.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener estado del pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Obtener todos los pedidos del usuario
export const getUserOrders = async (req, res) => {
  const { userId } = req.user;

  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.total,
        p.estado,
        p.fecha_creacion,
        p.fecha_actualizacion,
        COUNT(pi.id) as total_items
      FROM pedido p
      LEFT JOIN pedido_item pi ON p.id = pi.pedido_id
      WHERE p.usuario_dni = $1
      GROUP BY p.id
      ORDER BY p.fecha_creacion DESC
    `, [userId]);

    res.json({
      success: true,
      pedidos: result.rows.map(pedido => ({
        id: pedido.id,
        total: parseFloat(pedido.total),
        estado: pedido.estado,
        fecha_creacion: pedido.fecha_creacion,
        fecha_actualizacion: pedido.fecha_actualizacion,
        total_items: parseInt(pedido.total_items)
      }))
    });

  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
};