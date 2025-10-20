import crypto from 'crypto';

/**
 * Middleware para validar la firma de los webhooks de MercadoPago
 * Documentación: https://www.mercadopago.com.ar/developers/es/docs/checkout-api/additional-content/security/signature
 */
export const validarSignatureMercadoPago = (req, res, next) => {
  try {
    // 1. Extraer headers de MercadoPago
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];

    // 2. Si no hay firma, logueamos pero continuamos (para desarrollo)
    if (!xSignature || !xRequestId) {
      console.warn('⚠️ Webhook sin firma de seguridad (solo permitido en desarrollo)');
      
      // En producción, deberías descomentar estas líneas:
      // return res.status(401).json({
      //   success: false,
      //   error: 'Webhook sin firma de seguridad'
      // });
      
      return next(); // Permitir en desarrollo
    }

    // 3. Parsear la firma
    // Formato: "ts=123456789,v1=abc123def456..."
    const parts = xSignature.split(',');
    let ts, hash;

    parts.forEach(part => {
      const [key, value] = part.split('=');
      if (key === 'ts') ts = value;
      if (key === 'v1') hash = value;
    });

    if (!ts || !hash) {
      console.warn('⚠️ Formato de firma inválido');
      return next(); // Permitir en desarrollo
    }

    // 4. Obtener el secret de MercadoPago
    // IMPORTANTE: Este secret se obtiene del panel de MercadoPago
    // en la sección de "Webhooks" cuando configures la URL
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    if (!secret) {
      console.warn('⚠️ MERCADOPAGO_WEBHOOK_SECRET no configurado');
      return next(); // Permitir en desarrollo
    }

    // 5. Construir el string a validar
    // Formato: "id=<payment_id>;request-id=<request_id>;ts=<timestamp>"
    const dataId = req.body.data?.id || '';
    const manifest = `id=${dataId};request-id=${xRequestId};ts=${ts}`;

    // 6. Calcular el hash esperado usando HMAC-SHA256
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    // 7. Comparar hashes
    if (expectedHash !== hash) {
      console.error('❌ Firma de webhook inválida');
      console.error('Expected:', expectedHash);
      console.error('Received:', hash);
      
      // En producción, deberías descomentar estas líneas:
      // return res.status(401).json({
      //   success: false,
      //   error: 'Firma de webhook inválida'
      // });
      
      return next(); // Permitir en desarrollo
    }

    // 8. Validación exitosa
    console.log('✅ Firma de webhook válida');
    next();

  } catch (error) {
    console.error('Error validando firma de webhook:', error);
    
    // En caso de error, logueamos pero permitimos continuar en desarrollo
    next();
  }
};

/**
 * Middleware para verificar que la IP viene de MercadoPago (seguridad adicional)
 */
export const validarIPMercadoPago = (req, res, next) => {
  // IPs oficiales de MercadoPago (Argentina)
  const mercadopagoIPs = [
    '209.225.49.0/24',
    '216.33.196.0/24',
    '216.33.197.0/24',
    '209.225.48.0/24'
  ];

  // Obtener IP del request
  const clientIP = req.ip || req.connection.remoteAddress;

  // Por ahora solo logueamos (en producción podrías validar)
  console.log(`📍 Webhook recibido desde IP: ${clientIP}`);

  // Continuar
  next();
};

/**
 * Middleware para limitar la tasa de webhooks (rate limiting)
 */
export const limitarWebhooks = (req, res, next) => {
  // Implementación básica de rate limiting
  // En producción, usa un paquete como 'express-rate-limit'
  
  const webhookLimits = new Map(); // Debería ser Redis en producción
  const ip = req.ip;
  const now = Date.now();
  const limit = 100; // Máximo 100 webhooks por minuto por IP
  const window = 60000; // 1 minuto

  if (!webhookLimits.has(ip)) {
    webhookLimits.set(ip, [now]);
    return next();
  }

  const requests = webhookLimits.get(ip).filter(time => now - time < window);
  requests.push(now);
  webhookLimits.set(ip, requests);

  if (requests.length > limit) {
    console.warn(`⚠️ Rate limit excedido para IP: ${ip}`);
    return res.status(429).json({
      success: false,
      error: 'Demasiadas peticiones'
    });
  }

  next();
};

export default {
  validarSignatureMercadoPago,
  validarIPMercadoPago,
  limitarWebhooks
};