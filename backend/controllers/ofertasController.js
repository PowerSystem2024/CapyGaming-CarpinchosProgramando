import pool from '../bd/pool.js';

export const getOfertas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id_producto AS id,
             nombre AS title,
             precio AS newprice,
             marca,
             stock
      FROM producto
      WHERE precio IS NOT NULL
      ORDER BY id_producto ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Error al obtener las ofertas:', error.message);
    res.status(500).json({ error: 'Error al obtener las ofertas' });
  }
};
