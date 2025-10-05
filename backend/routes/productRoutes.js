import express from 'express';
import { getProductos, getProductoPorId, getOfertas } from '../controllers/productController.js';
import { getSubcategoriasPorCategoria } from '../controllers/productController.js';
//Importa tres funciones del controlador:
//getProductos: para obtener productos filtrados por categoría y subcategoría.
//getProductoPorId: para obtener el detalle de un producto específico.
//getSubcategoriasPorCategoria: para obtener las subcategorías disponibles de una categoría.


const router = express.Router();

router.get('/productos', getProductos); // Define la ruta GET /api/productos.
//El controlador getProductos se encarga de devolver productos filtrados según los parámetros categoria y subcategoria que se envían desde el frontend.

router.get('/categorias/:nombre/subcategorias', getSubcategoriasPorCategoria); //Define la ruta GET /api/categorias/:nombre/subcategorias.
//El controlador getSubcategoriasPorCategoria busca en la base de datos todas las subcategorías que pertenecen a la categoría indicada en :nombre.

// Nuevo endpoint para traer un producto por id
router.get('/productos/:id', getProductoPorId); //Define la ruta GET /api/productos/:id.
// El controlador getProductoPorId devuelve los datos completos de un producto específico, útil para una vista de detalle o modal.

// Endpoint para obtener ofertas desde la base de datos
router.get('/ofertas', getOfertas); //Define la ruta GET /api/ofertas.
// El controlador getOfertas busca en la base de datos productos que tienen ofertas activas y devuelve los datos formateados.

export default router;
