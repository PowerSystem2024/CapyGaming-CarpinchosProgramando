import express from 'express';
import { getProductos, getProductoPorId } from '../controllers/productController.js';

const router = express.Router();

router.get('/productos', getProductos);

// Nuevo endpoint para traer un producto por id
router.get('/productos/:id', getProductoPorId);

export default router;
