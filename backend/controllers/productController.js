import pool from '../bd/pool.js';

export const getProductos = async (req, res) => {
  const { categoria, subcategoria } = req.query;

/* Selecciona los datos del producto junto con su categoría, subcategoría y todas sus imágenes.
Usa LEFT JOIN para incluir productos aunque no tengan subcategoría o imágenes.*/
  let query = `  
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
  `;

  //Filtros condicionales
  /* Si se recibe una categoría o subcategoría, se agregan condiciones al WHERE.
Se usa LOWER() para hacer la comparación insensible a mayúsculas. */
  const conditions = [];
  const values = [];

  if (categoria) {
    conditions.push(`LOWER(c.nombre) = LOWER($${values.length + 1})`);
    values.push(categoria);
  }

  if (subcategoria) {
    conditions.push(`LOWER(s.nombre) = LOWER($${values.length + 1})`);
    values.push(subcategoria);
  }

  // Aplicacion de condiciones y agrupamiento
  /* Si hay condiciones, se agregan al WHERE.
Se agrupa por producto y nombres de categoría/subcategoría para que ARRAY_AGG funcione correctamente.
Se ordena por categoría, subcategoría y nombre de producto. */
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` GROUP BY p.id_producto, c.nombre, s.nombre ORDER BY c.nombre, s.nombre, p.nombre`;


  /* - Ejecuta la consulta con los valores dinámicos.
- Devuelve los productos filtrados como JSON.
- Si hay error, lo muestra en consola y responde con estado 500. */
  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error al traer productos filtrados:', err.message);
    res.status(500).json({ error: 'Error al traer productos' });
  }
};

// Controlador: getSubcategoriasPorCategoria: Extrae el nombre de la categoria desde la URL (/categoria/:nombre/subcategorias)
export const getSubcategoriasPorCategoria = async (req, res) => {
  const nombreCategoria = req.params.nombre;

  try { //Busca todas las subcategorias que pertenecen a esa categoria. Usa LOWER() para evitar errores por mayusculas. Ordena alfabeticamente
    const result = await pool.query(`
      SELECT s.nombre AS subcategoria
      FROM subcategoria s
      JOIN categoria c ON s.id_categoria = c.id_categoria
      WHERE LOWER(c.nombre) = LOWER($1)
      ORDER BY s.nombre
    `, [nombreCategoria]);

    //Devuelve un array plano con lso nombres de las categorias
    const subcategorias = result.rows.map(row => row.subcategoria);
    res.json(subcategorias);
  } catch (err) {
    console.error('Error al traer subcategorías:', err.message);
    res.status(500).json({ error: 'Error al traer subcategorías' });
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
    `, [id]); //Busca el producto por ID  y trae todos su datos, incluyendo imagenes

    if (result.rows.length === 0) {  //si no se encuentra el producto, responde con 404
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]); // si existe, devuelve el producto como JSON
  } catch (err) {
    console.error('Error al traer producto por id:', err.message);
    res.status(500).json({ error: 'Error al traer producto' });
  }
};

export const buscarProductosPorNombre = async (req, res) => {
  const { nombre } = req.query;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ error: 'Debe proporcionar un nombre para buscar' });
  }

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
      WHERE LOWER(p.nombre) ILIKE LOWER($1)
      GROUP BY p.id_producto, c.nombre, s.nombre
      ORDER BY p.nombre
    `, [`%${nombre}%`]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error al buscar productos por nombre:', err.stack);
    res.status(500).json({ error: 'Error al buscar productos' });
  }
};

// Obtener productos en oferta (descuento > 0)
export const getOfertas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_producto AS id,
        p.nombre AS title,
        p.precio AS newprice,
        p.descuento,
        p.marca,
        p.stock,
        ARRAY_AGG(ip.url_imagen) AS imagenes
      FROM producto p
      LEFT JOIN imagen_producto ip ON p.id_producto = ip.id_producto
      WHERE p.descuento > 0 AND p.stock > 0
      GROUP BY p.id_producto, p.nombre, p.precio, p.descuento, p.marca, p.stock
      ORDER BY p.descuento DESC
      LIMIT 10
    `);

    // Adaptamos el formato para que coincida con lo que espera el frontend
    const ofertas = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      newprice: row.newprice,
      descuento: row.descuento,
      marca: row.marca,
      stock: row.stock,
      image_url: row.imagenes && row.imagenes.length > 0 ? row.imagenes[0] : null
    }));

    res.json(ofertas);
  } catch (error) {
    console.error('Error al obtener ofertas:', error);
    res.status(500).json({ error: 'Error al obtener ofertas' });
  }
};

// Obtener productos destacados aleatorios
export const getProductosDestacados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id_producto,
        p.nombre,
        p.precio,
        p.stock,
        p.marca,
        p.descuento,
        c.nombre AS categoria,
        s.nombre AS subcategoria,
        ARRAY_AGG(ip.url_imagen ORDER BY ip.orden) AS imagenes
      FROM producto p
      LEFT JOIN categoria c ON p.id_categoria = c.id_categoria
      LEFT JOIN subcategoria s ON p.id_subcategoria = s.id_subcategoria
      LEFT JOIN imagen_producto ip ON p.id_producto = ip.id_producto
      WHERE p.stock > 0
      GROUP BY p.id_producto, c.nombre, s.nombre
      ORDER BY RANDOM()
      LIMIT 6
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({ error: 'Error al obtener productos destacados' });
  }
};