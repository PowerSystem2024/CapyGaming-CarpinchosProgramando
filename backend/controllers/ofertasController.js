import pool from '../bd/pool.js';

export const getOfertas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.id AS id,
        p.nombre AS title,
        p.precio AS newprice,
        p.marca,
        p.stock,
        o.descuento,
        o.fecha_inicio,
        o.fecha_fin
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
