import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';
dotenv.config();


console.log('🔐 Token de Mercado Pago:', process.env.MERCADOPAGO_ACCESS_TOKEN);

// Configuración del cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

// Instancias para trabajar con preferencias y pagos
export const preference = new Preference(client);
export const payment = new Payment(client);

export default client;
