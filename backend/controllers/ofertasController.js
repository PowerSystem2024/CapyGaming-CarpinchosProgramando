import pool from '../bd/pool.js';

export const getOfertas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id,
        p.id_producto AS id_producto,
        p.nombre AS title,
        p.precio AS newprice,
        p.marca,
        p.stock,
        o.descuento,
        o.fecha_inicio,
        o.fecha_fin,
        (
          SELECT i.url_imagen
          FROM imagen_producto i
          WHERE i.id_producto = p.id_producto
          LIMIT 1
        ) AS image_url
      FROM ofertas o
      JOIN producto p ON o.id_producto = p.id_producto
      ORDER BY o.id ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener las ofertas:', error.message);
    res.status(500).json({ error: 'Error al obtener las ofertas' });
  }
};
