import pool from '../bd/pool.js';

export const getProductos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.precio,
        p.stock,
        p.marca,
        c.nombre AS categoria,
        s.nombre AS subcategoria,
        ARRAY_AGG(ip.url_imagen) AS imagenes
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      LEFT JOIN subcategoria s ON p.id_subcategoria = s.id_subcategoria
      LEFT JOIN imagen_producto ip ON p.id_producto = ip.id_producto
      GROUP BY p.id_producto, c.nombre, s.nombre
      ORDER BY c.nombre, s.nombre, p.nombre;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al traer productos:', err.message);
    res.status(500).json({ error: 'Error al traer productos' });
  }
};

// Trae un producto por id
export const getProductoPorId = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(`
      SELECT 
        p.id_producto,
        p.nombre,
        p.precio,
        p.stock,
        p.marca,
        c.nombre AS categoria,
        s.nombre AS subcategoria,
        ARRAY_AGG(ip.url_imagen) AS imagenes
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      LEFT JOIN subcategoria s ON p.id_subcategoria = s.id_subcategoria
      LEFT JOIN imagen_producto ip ON p.id_producto = ip.id_producto
      WHERE p.id_producto = $1
      GROUP BY p.id_producto, c.nombre, s.nombre;
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al traer producto por id:', err.message);
    res.status(500).json({ error: 'Error al traer producto' });
  }
};