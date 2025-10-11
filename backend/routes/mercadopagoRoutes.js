import express from 'express';
import mercadopago from 'mercadopago';
import pool from '../bd/pool.js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const router = express.Router();

// Configurar MercadoPago con tu Access Token
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-8676695061727804-101112-e7c1b14e70eab74a4c5a23ee6c14b1c4-759675577'
});

// Crear preferencia de pago
router.post('/create-preference', async (req, res) => {
  try {
    const { items, payer, orderId } = req.body;

    // Debug: Verificar que el token esté configurado
    console.log('MercadoPago Access Token configurado:', process.env.MERCADOPAGO_ACCESS_TOKEN ? 'Sí' : 'No');
    console.log('Token primeros 20 caracteres:', process.env.MERCADOPAGO_ACCESS_TOKEN?.substring(0, 20));

    const preferenceData = {
      items: items.map(item => ({
        id: item.id_producto?.toString() || item.id?.toString() || 'PROD_' + Date.now(),
        title: item.nombre || item.title || 'Producto sin nombre',
        description: item.descripcion || item.description || '',
        category_id: item.categoria || 'others',
        quantity: parseInt(item.quantity) || parseInt(item.cantidad) || 1,
        unit_price: parseFloat(item.precio || item.price || 0),
        currency_id: 'ARS',
        picture_url: item.imagen ? `http://localhost:5173/images/${item.imagen}` : null
      })),
      payer: {
        name: payer.name || '',
        surname: payer.surname || '',
        email: payer.email || '',
        phone: {
          area_code: payer.phone?.area_code || '11',
          number: parseInt(payer.phone?.number || '12345678')
        },
        address: {
          street_name: payer.address?.street_name || '',
          street_number: parseInt(payer.address?.street_number) || 0,
          zip_code: payer.address?.zip_code || ''
        }
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/success`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/failure`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/payment/pending`
      },
      // auto_return: 'approved', // Comentado por ahora, requiere URLs HTTPS
      external_reference: orderId?.toString() || '',
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/mercadopago/webhook`,
      statement_descriptor: 'CAPYGAMING'
    };

    console.log('Creando preferencia con datos:', JSON.stringify(preferenceData, null, 2));

    // Crear la preferencia con la API v1.5
    const response = await mercadopago.preferences.create(preferenceData);

    console.log('Preferencia creada exitosamente:', response.body.id);

    res.json({
      success: true,
      preferenceId: response.body.id,
      initPoint: response.body.init_point,
      sandboxInitPoint: response.body.sandbox_init_point
    });

  } catch (error) {
    console.error('Error creando preferencia de MercadoPago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la preferencia de pago',
      error: error.message || error
    });
  }
});

// Webhook para notificaciones de MercadoPago
router.post('/webhook', async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log('Webhook recibido:', { type, data });

    if (type === 'payment') {
      // Obtener información del pago
      const paymentData = await mercadopago.payment.get(data.id);

      console.log('Datos del pago:', paymentData.body);

      // Actualizar estado del pedido en la base de datos
      if (paymentData.body.external_reference) {
        const updateQuery = `
          UPDATE pedido
          SET
            estado_pago = $1,
            id_mercadopago = $2
          WHERE id_pedido = $3
        `;

        await pool.query(updateQuery, [
          paymentData.body.status === 'approved',
          data.id,
          paymentData.body.external_reference
        ]);

        console.log(`Pedido ${paymentData.body.external_reference} actualizado con estado de pago: ${paymentData.body.status}`);
      }
    }

    res.status(200).send('OK');

  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({
      success: false,
      message: 'Error procesando webhook',
      error: error.message
    });
  }
});

// Obtener estado de un pago
router.get('/payment/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const paymentData = await mercadopago.payment.get(id);

    res.json({
      success: true,
      payment: {
        id: paymentData.body.id,
        status: paymentData.body.status,
        status_detail: paymentData.body.status_detail,
        payment_type: paymentData.body.payment_type_id,
        amount: paymentData.body.transaction_amount,
        date_approved: paymentData.body.date_approved,
        external_reference: paymentData.body.external_reference
      }
    });

  } catch (error) {
    console.error('Error obteniendo información del pago:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener información del pago',
      error: error.message
    });
  }
});

export default router;