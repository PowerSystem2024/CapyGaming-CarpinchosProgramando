import express from 'express';
import { getOfertas } from '../controllers/ofertasController.js';

const router = express.Router();

// Ruta para obtener las ofertas
router.get('/', getOfertas);

export default router;
