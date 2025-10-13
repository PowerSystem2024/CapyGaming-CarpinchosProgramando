import pool from '../bd/pool.js';

export const getOfertas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos'); // o la tabla que uses
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener las ofertas:', error);
    res.status(500).json({ error: 'Error al obtener las ofertas' });
  }
};

