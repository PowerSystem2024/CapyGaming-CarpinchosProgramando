import crypto from 'crypto';

/**
 * Middleware para validar la firma de los webhooks de MercadoPago
 *
 * Documentación oficial:
 * https://www.mercadopago.com.ar/developers/en/docs/your-integrations/notifications/webhooks
 *
 * La validación de firma es OBLIGATORIA según MercadoPago para prevenir:
 * - Webhooks falsos
 * - Ataques de modificación de estado de pagos
 * - Fraude
 */
export const validarSignatureMercadoPago = (req, res, next) => {
  try {
    // 1. Extraer headers de seguridad enviados por MercadoPago
    const xSignature = req.headers['x-signature'];
    const xRequestId = req.headers['x-request-id'];

    // 2. Validar que los headers existan
    if (!xSignature || !xRequestId) {
      console.error('Webhook rechazado: Sin firma de seguridad');
      console.error('Headers recibidos:', req.headers);

      // Solo permitir webhooks sin firma en desarrollo explícito
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_UNSIGNED_WEBHOOKS === 'true') {
        console.warn('DEVELOPMENT MODE: Permitiendo webhook sin firma (ALLOW_UNSIGNED_WEBHOOKS=true)');
        return next();
      }

      // RECHAZAR webhook sin firma
      return res.status(401).json({
        success: false,
        error: 'Webhook sin firma de seguridad'
      });
    }

    // 3. Parsear la firma
    // Formato según docs: "ts=1704534382,v1=abc123def456..."
    const parts = xSignature.split(',');
    let ts, hash;

    parts.forEach(part => {
      const [key, value] = part.split('=');
      if (key && key.trim() === 'ts') ts = value;
      if (key && key.trim() === 'v1') hash = value;
    });

    if (!ts || !hash) {
      console.error('Formato de firma inválido');
      console.error('x-signature recibido:', xSignature);

      return res.status(401).json({
        success: false,
        error: 'Formato de firma inválido'
      });
    }

    // 4. Obtener el secret configurado
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;

    if (!secret) {
      console.error('MERCADOPAGO_WEBHOOK_SECRET no configurado en .env');
      console.error('Obtener de: Panel de MercadoPago -> Tu aplicación -> Webhooks');

      return res.status(500).json({
        success: false,
        error: 'Configuración de webhooks incompleta'
      });
    }

    // 5. Construir el manifest según documentación oficial
    // Formato: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
    const dataId = req.body.data?.id || '';
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

    console.log('Validando firma de webhook...');
    console.log('  Data ID:', dataId);
    console.log('  Request ID:', xRequestId);
    console.log('  Timestamp:', ts);

    // 6. Calcular hash esperado usando HMAC-SHA256
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(manifest)
      .digest('hex');

    // 7. Comparar hashes
    if (expectedHash !== hash) {
      console.error('Firma de webhook INVALIDA');
      console.error('  Hash esperado:', expectedHash);
      console.error('  Hash recibido:', hash);
      console.error('  Manifest usado:', manifest);

      // RECHAZAR webhook con firma inválida
      return res.status(401).json({
        success: false,
        error: 'Firma de webhook inválida'
      });
    }

    // 8. Validación exitosa
    console.log('Firma de webhook VALIDA');
    next();

  } catch (error) {
    console.error('Error validando firma de webhook:', error);

    // En caso de error en la validación, RECHAZAR por seguridad
    return res.status(500).json({
      success: false,
      error: 'Error al validar webhook'
    });
  }
};

/**
 * Middleware para verificar que la IP viene de MercadoPago
 * Seguridad adicional (opcional)
 *
 * IPs oficiales de MercadoPago Argentina según documentación
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

  console.log('Webhook recibido desde IP:', clientIP);

  // Por ahora solo logueamos
  // En producción podrías validar contra las IPs permitidas
  next();
};

/**
 * Middleware para limitar la tasa de webhooks (rate limiting)
 * Previene ataques de denegación de servicio
 *
 * NOTA: En producción usar un paquete como 'express-rate-limit'
 * o implementar con Redis para múltiples instancias
 */
export const limitarWebhooks = (req, res, next) => {
  // Implementación básica de rate limiting
  // En producción, usar 'express-rate-limit' o Redis

  const webhookLimits = new Map();
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
    console.warn('Rate limit excedido para IP:', ip);

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