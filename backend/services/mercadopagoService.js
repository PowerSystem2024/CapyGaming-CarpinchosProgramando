// Este es el corazón de la integración. Aquí se encapsula toda la lógica de comunicación con la API de MercadoPago.
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { request } from 'http';

dotenv.config();

// CODIGO HARDCODEADO - 
// Configurar cliente de MercadoPago (SDK v2.x)
// const client = new MercadoPagoConfig({
//   accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
//   options: {
//     timeout: 5000,
//     idempotencyKey: 'abc'
//   }
// });

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: {
    timeout: 15000,   
  }
});

// Crear instancias de los recursos
const preference = new Preference(client);
const payment = new Payment(client);


/*/
 * Crear una preferencia de pago en MercadoPago
 * @param {Object} preferenceData - Datos de la preferencia
 * @returns {Promise<Object>} - Respuesta de MercadoPago con preferenceId e initPoint

crearPreferencia():
- Recibe los datos del pedido (items, payer, orderId)
- Los formatea según lo que MercadoPago espera
- Configura las URLs de retorno (éxito, fallo, pendiente)
- Configura la URL del webhook para notificaciones
- Devuelve el preferenceId y el initPoint (URL de pago)

*/

export const createPreference = async (preferenceData) => {
  try {
    // Generar clave de idempotencia única para esta solicitud, de tal forma que si se repite no se creen cargos duplicados
    const idempotencyKey = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
    const body = {
      items: preferenceData.items.map(item => ({
        id: String(item.id || ''),
        title: item.title,
        quantity: Number(item.quantity),
        unit_price: Number(item.unit_price),
        currency_id: 'ARS',
        picture_url: item.picture_url || undefined,
        description: item.description || ''
      })),
      payer: {
        name: preferenceData.payer.name,
        surname: preferenceData.payer.surname,
        email: preferenceData.payer.email,
        phone: preferenceData.payer.phone || undefined,
        identification: preferenceData.payer.identification || undefined
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL}/payment/success`,
        failure: `${process.env.FRONTEND_URL}/payment/failure`,
        pending: `${process.env.FRONTEND_URL}/payment/pending`
      },
      // auto_return: 'approved', Solo redirige automáticamente si el pago es aprobado , tiene que redirigir siempre
      auto_return: 'all', // Redirige automaticamente en todos los casos
      external_reference: preferenceData.orderId,
      notification_url: `${process.env.BACKEND_URL}/api/webhooks/webhook`,
      statement_descriptor: 'CapyGaming'
    };

    //const response = await preference.create({ body });


    const response = await preference.create({ 
      body,
      requestOptions: {
        idempotencyKey: idempotencyKey
      }
    });

    return {
      success: true,
      preferenceId: response.id,
      initPoint: response.init_point,
      sandboxInitPoint: response.sandbox_init_point
    };

  } catch (error) {
    console.error('Error creando preferencia de MercadoPago:', error);
    throw new Error(`Error al crear preferencia: ${error.message || 'Error desconocido'}`);


  }
};

/*/
 * Consultar información de un pago específico
 * @param {String} paymentId - ID del pago en MercadoPago
 * @returns {Promise<Object>} - Información del pago

obtenerPago():
- Consulta el estado de un pago específico
- Devuelve toda la información relevante del pago
- Se usa cuando recibes un webhook o necesitas verificar el estado
 */

export const obtenerPago = async (paymentId) => {
  try {
    const response = await payment.get({ id: paymentId });

    return {
      success: true,
      payment: {
        id: response.id,
        status: response.status,
        status_detail: response.status_detail,
        transaction_amount: response.transaction_amount,
        currency_id: response.currency_id,
        payment_method_id: response.payment_method_id,
        payment_type_id: response.payment_type_id,
        date_created: response.date_created,
        date_approved: response.date_approved,
        external_reference: response.external_reference,
        payer: response.payer
      }
    };

  } catch (error) {
    console.error('Error obteniendo pago de MercadoPago:', error);
    throw new Error(`Error al obtener pago: ${error.message || 'Error desconocido'}`);
  }
};

/*/
 * Validar firma del webhook de MercadoPago
 * @param {Object} headers - Headers de la request
 * @param {Object} body - Body de la request
 * @returns {Boolean} - True si la firma es válida
validarWebhookSignature():
- Por ahora solo retorna true
- La implementación real estará en el middleware
 */

export const validarWebhookSignature = (headers, body) => {
  // Esta función será implementada en el middleware webhookSecurity.js
  // Aquí solo retornamos true para pruebas iniciales
  return true;
};

export default {
  createPreference,
  obtenerPago,
  validarWebhookSignature
};