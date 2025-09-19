/*const pool = require('./pool');
const productos = require('../frontend/src/assets/data/productsData');

(async () => {
    for (const p of productos) {
        try {
        await pool.query('BEGIN');

        // Obtener o insertar categoría
        const catRes = await pool.query(
            'SELECT id_categoria FROM categoria WHERE nombre = $1',
            [p.categoria]
        );
        let id_categoria;
        if (catRes.rows.length > 0) {
            id_categoria = catRes.rows[0].id_categoria;
        } else {
            const insertCat = await pool.query(
            'INSERT INTO categoria (nombre) VALUES ($1) RETURNING id_categoria',
            [p.categoria]
            );
            id_categoria = insertCat.rows[0].id_categoria;
        }

        // Obtener o insertar subcategoría (si existe)
        let id_subcategoria = null;
        if (p.subcategoria) {
            const subRes = await pool.query(
            'SELECT id_subcategoria FROM subcategoria WHERE nombre = $1 AND id_categoria = $2',
            [p.subcategoria, id_categoria]
            );
            if (subRes.rows.length > 0) {
            id_subcategoria = subRes.rows[0].id_subcategoria;
            } else {
            const insertSub = await pool.query(
                'INSERT INTO subcategoria (nombre, id_categoria) VALUES ($1, $2) RETURNING id_subcategoria',
                [p.subcategoria, id_categoria]
            );
            id_subcategoria = insertSub.rows[0].id_subcategoria;
            }
        }

        // Validación: evitar duplicados por nombre
        const existe = await pool.query(
            'SELECT id_producto FROM producto WHERE nombre = $1',
            [p.nombre]
        );
        if (existe.rows.length > 0) {
            console.log(`Producto duplicado: ${p.nombre}`);
            await pool.query('ROLLBACK');
            continue;
        }
        // Insertar producto
        const res = await pool.query(
            `INSERT INTO producto (nombre, precio, stock, marca, id_categoria, id_subcategoria)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_producto`,
            [p.nombre, p.precio, p.stock, p.marca, id_categoria, id_subcategoria]
        );
        const id_producto = res.rows[0].id_producto;
        // Insertar imágenes
        for (const url of p.imagenes) {
            await pool.query(
            'INSERT INTO imagen_producto (id_producto, url) VALUES ($1, $2)',
            [id_producto, url]
            );
        }
        await pool.query('COMMIT');
        console.log(`Producto insertado: ${p.nombre}`);
        } catch (err) {
        await pool.query('ROLLBACK');
        console.error(`Error al insertar ${p.nombre}:`, err.message);
        }
    }
    await pool.end();
})();*/

const pool = require('./pool');
const { productos } = require('../../frontend/src/assets/data/productsData');
const subset = productos.slice(0, 5); // Solo los primeros 5

(async () => {
    for (const p of productos) {
        try {
        await pool.query('BEGIN');
        // Insertar o recuperar categoría
        const catRes = await pool.query(
            'SELECT id_categoria FROM categoria WHERE nombre = $1',
            [p.categoria]
        );
        let id_categoria;
        if (catRes.rows.length > 0) {
            id_categoria = catRes.rows[0].id_categoria;
        } else {
            const insertCat = await pool.query(
            'INSERT INTO categoria (nombre) VALUES ($1) RETURNING id_categoria',
            [p.categoria]
            );
            id_categoria = insertCat.rows[0].id_categoria;
        }
        // Insertar o recuperar subcategoría (si existe)
        let id_subcategoria = null;
        if (p.subcategoria) {
            const subRes = await pool.query(
            'SELECT id_subcategoria FROM subcategoria WHERE nombre = $1 AND id_categoria = $2',
            [p.subcategoria, id_categoria]
            );
            if (subRes.rows.length > 0) {
            id_subcategoria = subRes.rows[0].id_subcategoria;
            } else {
            const insertSub = await pool.query(
                'INSERT INTO subcategoria (nombre, id_categoria) VALUES ($1, $2) RETURNING id_subcategoria',
                [p.subcategoria, id_categoria]
            );
            id_subcategoria = insertSub.rows[0].id_subcategoria;
            }
        }
        // Validar duplicado por nombre
        const existe = await pool.query(
            'SELECT id_producto FROM producto WHERE nombre = $1',
            [p.nombre]
        );
        if (existe.rows.length > 0) {
            console.log(`Producto duplicado: ${p.nombre}`);
            await pool.query('ROLLBACK');
            continue;
        }
        // Insertar producto
        const res = await pool.query(
            `INSERT INTO producto (nombre, precio, stock, marca, id_categoria, id_subcategoria)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id_producto`,
            [p.nombre, p.precio, p.stock, p.marca, id_categoria, id_subcategoria]
        );
        const id_producto = res.rows[0].id_producto;
        // Insertar imágenes
        for (const url of p.imagenes) {
            await pool.query(
            'INSERT INTO imagen_producto (id_producto, url_imagen) VALUES ($1, $2)',
            [id_producto, url]
            );
        }
        await pool.query('COMMIT');
        console.log(`✅ Producto insertado: ${p.nombre}`);
        } catch (err) {
        await pool.query('ROLLBACK');
        console.error(`❌ Error al insertar ${p.nombre}:`, err.message);
        }
    }
    await pool.end();
})();