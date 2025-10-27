// Los middleware son funciones que se ejecutan antes de que la petición llegue al controller. 
// Seguridad que validan y protegen tus endpoints.

// Valida el formato de los datos antes de llegar al controller
// Previene errores en la base de datos por datos inválidos
// Devuelve mensajes claros si algo está mal
// Usa express-validator 

import { body, param, validationResult } from 'express-validator';

/**
 * Middleware de validación para crear preferencia de pago
 */
export const validarCrearPreferencia = [
  // Validar que items sea un array no vacío
  body('items')
    .isArray({ min: 1 })
    .withMessage('Se requiere al menos un item en el pedido'),
  
  // Validar cada item del array
  body('items.*.title')
    .notEmpty()
    .withMessage('El título del producto es requerido')
    .isString()
    .withMessage('El título debe ser un string'),
  
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('La cantidad debe ser un número entero mayor a 0'),
  
  body('items.*.unit_price')
    .isFloat({ min: 0.01 })
    .withMessage('El precio debe ser un número mayor a 0'),
  
  body('items.*.id')
    .optional()
    .isString()
    .withMessage('El ID del producto debe ser un string'),
  
  body('items.*.picture_url')
    .optional()
    .isURL()
    .withMessage('La URL de la imagen debe ser válida'),

  // Validar datos del pagador
  body('payer.name')
    .notEmpty()
    .withMessage('El nombre del pagador es requerido')
    .isString()
    .withMessage('El nombre debe ser un string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('payer.surname')
    .notEmpty()
    .withMessage('El apellido del pagador es requerido')
    .isString()
    .withMessage('El apellido debe ser un string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El apellido debe tener entre 2 y 100 caracteres'),
  
  body('payer.email')
    .notEmpty()
    .withMessage('El email del pagador es requerido')
    .isEmail()
    .withMessage('Debe ser un email válido')
    .normalizeEmail(),
  
  body('payer.phone')
    .optional()
    .isObject()
    .withMessage('El teléfono debe ser un objeto'),
  
  body('payer.phone.area_code')
    .optional()
    .isString()
    .withMessage('El código de área debe ser un string'),
  
  body('payer.phone.number')
    .optional()
    .isString()
    .withMessage('El número de teléfono debe ser un string'),

  // Validar identification (estructura de MercadoPago)
  body('payer.identification')
    .optional()
    .isObject()
    .withMessage('La identificación debe ser un objeto'),

  body('payer.identification.type')
    .optional()
    .isString()
    .withMessage('El tipo de identificación debe ser un string')
    .isIn(['DNI', 'CI', 'LC', 'LE', 'Otro'])
    .withMessage('El tipo de identificación debe ser DNI, CI, LC, LE u Otro'),

  body('payer.identification.number')
    .optional()
    .isString()
    .withMessage('El número de identificación debe ser un string'),

  // Validar orderId (opcional)
  body('orderId')
    .optional()
    .isString()
    .withMessage('El ID de orden debe ser un string')
    .matches(/^[A-Z0-9\-_]+$/i)
    .withMessage('El ID de orden solo puede contener letras, números, guiones y guiones bajos'),

  // Middleware final que verifica los errores
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Errores de validación',
        details: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware de validación para consultar estado de pago
 */
export const validarConsultarEstado = [
  param('orderId')
    .notEmpty()
    .withMessage('El ID de orden es requerido')
    .isString()
    .withMessage('El ID de orden debe ser un string')
    .matches(/^[A-Z0-9\-_]+$/i)
    .withMessage('El ID de orden tiene un formato inválido'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Errores de validación',
        details: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware de validación para webhook
 */
export const validarWebhook = [
  body('type')
    .notEmpty()
    .withMessage('El tipo de evento es requerido')
    .isString()
    .withMessage('El tipo de evento debe ser un string'),
  
  body('data')
    .optional()
    .isObject()
    .withMessage('Data debe ser un objeto'),
  
  body('data.id')
    .optional()
    .isString()
    .withMessage('El ID del pago debe ser un string'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Para webhooks, logueamos pero no rechazamos
      console.warn('Webhook con errores de validación:', errors.array());
    }
    // Siempre continuamos para que el controller registre el evento
    next();
  }
];

export default {
  validarCrearPreferencia,
  validarConsultarEstado,
  validarWebhook
};