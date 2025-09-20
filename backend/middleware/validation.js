import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').notEmpty().withMessage('El apellido es requerido'),
  body('email').isEmail().withMessage('Email debe ser válido'),
  body('telefono').isLength({ min: 9, max: 13 }).withMessage('Teléfono debe tener entre 9 y 13 caracteres'),
  body('dni').isLength({ min: 7, max: 8 }).withMessage('DNI debe tener entre 7 y 8 caracteres'),
  body('password').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
  body('direccion').notEmpty().withMessage('La dirección es requerida'),
  handleValidationErrors
];

export const loginValidation = [
  body('email').isEmail().withMessage('Email debe ser válido'),
  body('password').notEmpty().withMessage('Contraseña es requerida'),
  handleValidationErrors
];

export const recoveryValidation = [
  body('email').isEmail().withMessage('Email debe ser válido'),
  handleValidationErrors
];