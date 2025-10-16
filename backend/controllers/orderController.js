import pool from '../bd/pool.js';
import { preference as mpPreference, payment as mpPayment } from '../config/mercadopago.js';

// Crear nuevo pedido
export const createOrder = async (req, res) => {
  const {
    // Datos de envío
    nombre_envio,
    apellido_envio,
    direccion_envio,
    ciudad_envio,
    provincia_envio,
    codigo_postal_envio,
    telefono_envio,
    // Datos de facturación
    nombre_facturacion,
    apellido_facturacion,
    direccion_facturacion,
    ciudad_facturacion,
    provincia_facturacion,
    codigo_postal_facturacion,
    // Detalles del pedido
    metodo_envio,
    costo_envio,
    comentarios,
    subtotal,
    descuento = 0,
    total,
    metodo_pago,
    // Items del carrito
    items // Array de { id_producto, cantidad }
  } = req.body;

  // Validaciones básicas
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'El carrito está vacío' });
  }

  if (!metodo_pago) {
    return res.status(400).json({ error: 'Debe seleccionar un método de pago' });
  }

  try {
    await pool.query('BEGIN');

    // 1. Validar stock y obtener información de productos
    const productosValidados = [];

    for (const item of items) {
      const productResult = await pool.query(`
        SELECT
          p.id_producto,
          p.nombre,
          p.precio,
          p.stock,
          (SELECT url_imagen FROM imagen_producto WHERE id_producto = p.id_producto LIMIT 1) as imagen
        FROM producto p
        WHERE p.id_producto = $1
      `, [item.id_producto]);

      if (productResult.rows.length === 0) {
        await pool.query('ROLLBACK');
        return res.status(404).json({
          error: `Producto con ID ${item.id_producto} no encontrado`
        });
      }

      const producto = productResult.rows[0];

      if (producto.stock < item.cantidad) {
        await pool.query('ROLLBACK');
        return res.status(400).json({
          error: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}`
        });
      }

      productosValidados.push({
        ...producto,
        cantidad: item.cantidad,
        subtotal: producto.precio * item.cantidad
      });
    }

    // 2. Crear el pedido
    const pedidoResult = await pool.query(`
      INSERT INTO pedido (
        dni_usuario,
        nombre_envio, apellido_envio, direccion_envio, ciudad_envio,
        provincia_envio, codigo_postal_envio, telefono_envio,
        nombre_facturacion, apellido_facturacion, direccion_facturacion,
        ciudad_facturacion, provincia_facturacion, codigo_postal_facturacion,
        metodo_envio, costo_envio, comentarios,
        subtotal, descuento, total,
        metodo_pago
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21
      ) RETURNING id_pedido, fecha_creacion
    `, [
      req.user.userId,
      nombre_envio, apellido_envio, direccion_envio, ciudad_envio,
      provincia_envio, codigo_postal_envio, telefono_envio,
      nombre_facturacion, apellido_facturacion, direccion_facturacion,
      ciudad_facturacion, provincia_facturacion, codigo_postal_facturacion,
      metodo_envio, costo_envio, comentarios || null,
      subtotal, descuento, total,
      metodo_pago
    ]);

    const id_pedido = pedidoResult.rows[0].id_pedido;

    // 3. Insertar detalle del pedido y reducir stock
    for (const producto of productosValidados) {
      // Insertar detalle
      await pool.query(`
        INSERT INTO detalle_pedido (
          id_pedido, id_producto, nombre_producto,
          precio_unitario, cantidad, subtotal, imagen_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        id_pedido,
        producto.id_producto,
        producto.nombre,
        producto.precio,
        producto.cantidad,
        producto.subtotal,
        producto.imagen
      ]);

      // Reducir stock
      await pool.query(
        'UPDATE producto SET stock = stock - $1 WHERE id_producto = $2',
        [producto.cantidad, producto.id_producto]
      );
    }

    // 4. Limpiar el carrito del usuario
    await pool.query(
      'DELETE FROM carrito WHERE dni_usuario = $1',
      [req.user.userId]
    );

    await pool.query('COMMIT');

    // 5. Si el método de pago es Mercado Pago, crear preferencia
    let mpData = null;

    if (metodo_pago === 'mercadopago') {
      try {
        const preferenceData = {
          body: {
            items: productosValidados.map(p => ({
              id: p.id_producto.toString(),
              title: p.nombre,
              quantity: p.cantidad,
              unit_price: parseFloat(p.precio),
              currency_id: 'ARS'
            })),
            shipments: {
              cost: parseFloat(costo_envio),
              mode: 'not_specified'
            },
            back_urls: {
              success: `${process.env.FRONTEND_URL}/pago/exitoso?pedido=${id_pedido}`,
              failure: `${process.env.FRONTEND_URL}/pago/fallido?pedido=${id_pedido}`,
              pending: `${process.env.FRONTEND_URL}/pago/pendiente?pedido=${id_pedido}`
            },
            
            external_reference: id_pedido.toString(),
            notification_url: `${process.env.BACKEND_URL}/api/pedidos/webhook`,
            statement_descriptor: 'CAPYGAMING',
            payer: {
              name: nombre_facturacion,
              surname: apellido_facturacion,
              email: req.user.email || 'cliente@capygaming.com'
            }
          }
        };
        console.log('🧪 Enviando preferencia a Mercado Pago:', preferenceData.body);
        try {
        const mpResponse = await mpPreference.create(preferenceData);
        console.log('🧾 Respuesta de Mercado Pago:', mpResponse);

          if (!mpResponse?.id) {
            console.error('❌ Preferencia sin ID. Respuesta:', mpResponse);
            return res.status(500).json({ error: 'No se pudo crear la preferencia de pago' });
          }
        // Guardar preference_id en el pedido
        await pool.query(
          'UPDATE pedido SET mp_preference_id = $1 WHERE id_pedido = $2',
          [mpResponse.id, id_pedido]
        );

        mpData = {
          preference_id: mpResponse.id,
          init_point: mpResponse.init_point,
          sandbox_init_point: mpResponse.sandbox_init_point
        };
        console.log('✅ Preferencia creada:', mpResponse.body);
      } catch (error) {
        console.error('❌ Error al crear preferencia:', error);
        return res.status(500).json({ error: 'Error al crear preferencia de Mercado Pago' });
      }

      } catch (mpError) {
        console.error('Error creando preferencia de Mercado Pago:', mpError);
        console.error('Error creando preferencia de Mercado Pago:', mpError.response?.data || mpError);
        // No fallar la orden si MP falla, pero notificar
        mpData = { error: 'No se pudo crear la preferencia de pago' };
      }
    }

    // 6. Responder con los datos del pedido
    res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedido: {
        id_pedido,
        fecha_creacion: pedidoResult.rows[0].fecha_creacion,
        total,
        estado: 'pendiente',
        items: productosValidados
      },
      mercadopago: mpData
    });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error creando pedido:', error);
    res.status(500).json({
      error: 'Error al crear el pedido',
      details: error.message
    });
  }
};

// Obtener pedidos del usuario
export const getUserOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_pedido,
        p.fecha_creacion,
        p.total,
        p.estado_pedido,
        p.estado_pago,
        p.metodo_pago,
        p.metodo_envio,
        COUNT(dp.id_detalle) as cantidad_productos
      FROM pedido p
      LEFT JOIN detalle_pedido dp ON p.id_pedido = dp.id_pedido
      WHERE p.dni_usuario = $1
      GROUP BY p.id_pedido
      ORDER BY p.fecha_creacion DESC
    `, [req.user.userId]);

    res.json({ pedidos: result.rows });
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

// Obtener detalle de un pedido específico
export const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    // Obtener información del pedido
    const pedidoResult = await pool.query(`
      SELECT * FROM pedido
      WHERE id_pedido = $1 AND dni_usuario = $2
    `, [id, req.user.userId]);

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // Obtener items del pedido
    const itemsResult = await pool.query(`
      SELECT * FROM detalle_pedido
      WHERE id_pedido = $1
      ORDER BY id_detalle
    `, [id]);

    res.json({
      pedido: pedidoResult.rows[0],
      items: itemsResult.rows
    });
  } catch (error) {
    console.error('Error obteniendo pedido:', error);
    res.status(500).json({ error: 'Error al obtener el pedido' });
  }
};

// Webhook de Mercado Pago (para notificaciones de pago)
export const mercadopagoWebhook = async (req, res) => {
  const { type, data } = req.body;

  console.log('📩 Webhook recibido de Mercado Pago:', { type, data });

  // Responder rápidamente a MP
  res.sendStatus(200);

  // Procesar la notificación de forma asíncrona
  if (type === 'payment') {
    try {
      const paymentId = data.id;

      // Obtener información completa del pago desde MP
      const paymentInfo = await mpPayment.get({ id: paymentId });

      const {
        status,
        status_detail,
        external_reference,
        transaction_amount
      } = paymentInfo;

      console.log('💳 Información del pago:', {
        status,
        status_detail,
        external_reference,
        transaction_amount
      });

      // Mapear estados de MP a nuestros estados
      let estado_pago = 'pendiente';
      let estado_pedido = 'pendiente';

      if (status === 'approved') {
        estado_pago = 'aprobado';
        estado_pedido = 'pagado';
      } else if (status === 'rejected') {
        estado_pago = 'rechazado';
        estado_pedido = 'cancelado';
      }

      // Actualizar el pedido en la base de datos
      await pool.query(`
        UPDATE pedido
        SET
          mp_payment_id = $1,
          mp_status = $2,
          mp_status_detail = $3,
          estado_pago = $4,
          estado_pedido = $5,
          fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id_pedido = $6
      `, [
        paymentId,
        status,
        status_detail,
        estado_pago,
        estado_pedido,
        external_reference
      ]);

      console.log(`✅ Pedido ${external_reference} actualizado a estado: ${estado_pedido}`);

    } catch (error) {
      console.error('❌ Error procesando webhook de MP:', error);
    }
  }
};

// Cancelar pedido (solo si no ha sido pagado/enviado)
export const cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar estado del pedido
    const pedidoResult = await pool.query(`
      SELECT estado_pedido, estado_pago
      FROM pedido
      WHERE id_pedido = $1 AND dni_usuario = $2
    `, [id, req.user.userId]);

    if (pedidoResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    const { estado_pedido, estado_pago } = pedidoResult.rows[0];

    // Solo se puede cancelar si está pendiente
    if (estado_pedido !== 'pendiente' || estado_pago === 'aprobado') {
      return res.status(400).json({
        error: 'No se puede cancelar un pedido que ya fue pagado o procesado'
      });
    }

    await pool.query('BEGIN');

    // Devolver el stock de los productos
    const itemsResult = await pool.query(`
      SELECT id_producto, cantidad
      FROM detalle_pedido
      WHERE id_pedido = $1
    `, [id]);

    for (const item of itemsResult.rows) {
      await pool.query(
        'UPDATE producto SET stock = stock + $1 WHERE id_producto = $2',
        [item.cantidad, item.id_producto]
      );
    }

    // Actualizar estado del pedido
    await pool.query(`
      UPDATE pedido
      SET estado_pedido = 'cancelado', fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id_pedido = $1
    `, [id]);

    await pool.query('COMMIT');

    res.json({ message: 'Pedido cancelado exitosamente' });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error cancelando pedido:', error);
    res.status(500).json({ error: 'Error al cancelar el pedido' });
  }
};
