// Este es el corazón de la integración. Aquí se encapsula toda la lógica de comunicación con la API de MercadoPago.
import mercadopago, { Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

// Configurar credenciales de MercadoPago
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});


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

export const crearPreferencia = async (preferenceData) => {
    try{
        const preference = {
            items: preferenceData.items.map(item => ({
                id:item.id,
                title: item.title,
                quantity: item.quantity,
                unit_price: parseFloat(item.unit_price),
                currency_id: 'ARS',
                picture_url: item.picture_url || null,
                description: item.description || ''
            })),
            payer: {
                name: preferenceData.payer.name,
                surname: preferenceData.payer.surname,
                email: preferenceData.payer.email,
                phone: preferenceData.payer.phone || {},
                identification: preferenceData.payer.identification || {}
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/pago-exitoso`,
                failure: `${process.env.FRONTEND_URL}/pago-fallido`,
                pending: `${process.env.FRONTEND_URL}/pago-pendiente`
            },
            auto_return: 'approved',
            external_reference: preferenceData.orderId,
            notification_url: `${process.env.BACKEND_URL}/api/webhooks/mercadopago`,
            statement_descriptor: 'CapyGaming',
            expires: false
        };

        const response = await mercadopago.preferences.create(preference);

        return {
            success: true,
            preferenceId: response.body.id,
            initPoint: response.body.init_point,
            sandboxInitPoint: response.body.sandbox_init_point
        };

    } catch (error){
        console.error('Error creando preferencia de MercadoPago: ', error);
        throw {
            success: false,
            error: 'Error al crear preferencia de pago',
            details: error.message
        };
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
    try{
        const payment = await mercadopago.payment.get(paymentId);

        return {
            success: true,
            payment: {
                id: payment.body.id,
                status: payment.body.status,
                status_detail: payment.body.status_detail,
                transaction_amount: payment.body.transaction_amount,
                currency_id: payment.body.currency_id,
                payment_method_id: payment.body.payment_method_id,
                payment_type_id: payment.body.payment_type_id,
                date_created: payment.body.date_created,
                date_approved: payment.body.date_approved,
                external_reference: payment.body.external_reference,
                payer: payment.body.payer  
            }
        };
    } catch (error){
        console.error('Error obteniendo pago de MercadoPago: ', error);
        throw {
            success: false,
            error: 'Error al obtener información del pago',
            details: error.message
        };
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
  crearPreferencia,
  obtenerPago,
  validarWebhookSignature
};