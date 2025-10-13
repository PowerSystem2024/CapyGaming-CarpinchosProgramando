// backend/routes/ofertasRoutes.js
import express from 'express';
import { getOfertas } from '../controllers/ofertasController.js';

const router = express.Router();

// GET /api/ofertas
router.get('/', getOfertas);

export default router;
