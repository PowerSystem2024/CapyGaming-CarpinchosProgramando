import pool from '../bd/pool.js';

// Obtener el carrito del usuario
export const getCart = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.id_carrito,
        c.id_producto,
        c.cantidad,
        p.nombre,
        p.precio,
        p.stock,
        p.marca,
        (SELECT url_imagen FROM imagen_producto WHERE id_producto = p.id_producto LIMIT 1) as imagen
      FROM carrito c
      JOIN producto p ON c.id_producto = p.id_producto
      WHERE c.dni_usuario = $1
      ORDER BY c.fecha_agregado DESC
    `, [req.user.userId]);

    res.json({ items: result.rows });
  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    res.status(500).json({ error: 'Error al obtener el carrito' });
  }
};

// Agregar producto al carrito
export const addToCart = async (req, res) => {
  const { id_producto, cantidad = 1 } = req.body;

  try {
    // Verificar que el producto existe y hay stock
    const productResult = await pool.query(
      'SELECT stock FROM producto WHERE id_producto = $1',
      [id_producto]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const stock = productResult.rows[0].stock;

    // Verificar si el producto ya está en el carrito
    const existingItem = await pool.query(
      'SELECT cantidad FROM carrito WHERE dni_usuario = $1 AND id_producto = $2',
      [req.user.userId, id_producto]
    );

    if (existingItem.rows.length > 0) {
      const nuevaCantidad = existingItem.rows[0].cantidad + cantidad;

      if (nuevaCantidad > stock) {
        return res.status(400).json({
          error: `Stock insuficiente. Disponible: ${stock}`
        });
      }

      // Actualizar cantidad
      await pool.query(
        'UPDATE carrito SET cantidad = $1 WHERE dni_usuario = $2 AND id_producto = $3',
        [nuevaCantidad, req.user.userId, id_producto]
      );

      return res.json({
        message: 'Cantidad actualizada',
        cantidad: nuevaCantidad
      });
    }

    // Verificar stock antes de agregar
    if (cantidad > stock) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${stock}`
      });
    }

    // Agregar nuevo producto al carrito
    await pool.query(
      'INSERT INTO carrito (dni_usuario, id_producto, cantidad) VALUES ($1, $2, $3)',
      [req.user.userId, id_producto, cantidad]
    );

    res.status(201).json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error agregando al carrito:', error);
    res.status(500).json({ error: 'Error al agregar producto al carrito' });
  }
};

// Actualizar cantidad de un producto en el carrito
export const updateCartItem = async (req, res) => {
  const { id_producto } = req.params;
  const { cantidad } = req.body;

  if (cantidad < 1) {
    return res.status(400).json({ error: 'La cantidad debe ser al menos 1' });
  }

  try {
    // Verificar stock disponible
    const productResult = await pool.query(
      'SELECT stock FROM producto WHERE id_producto = $1',
      [id_producto]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const stock = productResult.rows[0].stock;

    if (cantidad > stock) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${stock}`
      });
    }

    // Actualizar cantidad
    const result = await pool.query(
      'UPDATE carrito SET cantidad = $1 WHERE dni_usuario = $2 AND id_producto = $3 RETURNING *',
      [cantidad, req.user.userId, id_producto]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    res.json({
      message: 'Cantidad actualizada',
      cantidad: result.rows[0].cantidad
    });
  } catch (error) {
    console.error('Error actualizando carrito:', error);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
};

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
  const { id_producto } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM carrito WHERE dni_usuario = $1 AND id_producto = $2 RETURNING *',
      [req.user.userId, id_producto]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
    }

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error eliminando del carrito:', error);
    res.status(500).json({ error: 'Error al eliminar producto del carrito' });
  }
};

// Sincronizar carrito desde localStorage (cuando el usuario se registra/logea)
export const syncCart = async (req, res) => {
  const { items } = req.body; // Array de { id_producto, cantidad }

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Formato inválido. Se esperaba un array de items' });
  }

  try {
    await pool.query('BEGIN');

    for (const item of items) {
      const { id_producto, cantidad } = item;

      // Verificar que el producto existe y hay stock
      const productResult = await pool.query(
        'SELECT stock FROM producto WHERE id_producto = $1',
        [id_producto]
      );

      if (productResult.rows.length === 0) {
        console.warn(`Producto ${id_producto} no encontrado, omitiendo`);
        continue;
      }

      const stock = productResult.rows[0].stock;

      // Verificar si ya existe en el carrito
      const existingItem = await pool.query(
        'SELECT cantidad FROM carrito WHERE dni_usuario = $1 AND id_producto = $2',
        [req.user.userId, id_producto]
      );

      if (existingItem.rows.length > 0) {
        // Si ya existe, sumar las cantidades (pero no exceder el stock)
        const nuevaCantidad = Math.min(
          existingItem.rows[0].cantidad + cantidad,
          stock
        );

        await pool.query(
          'UPDATE carrito SET cantidad = $1 WHERE dni_usuario = $2 AND id_producto = $3',
          [nuevaCantidad, req.user.userId, id_producto]
        );
      } else {
        // Si no existe, agregar (pero no exceder el stock)
        const cantidadFinal = Math.min(cantidad, stock);

        await pool.query(
          'INSERT INTO carrito (dni_usuario, id_producto, cantidad) VALUES ($1, $2, $3)',
          [req.user.userId, id_producto, cantidadFinal]
        );
      }
    }

    await pool.query('COMMIT');

    // Devolver el carrito actualizado
    const cartResult = await pool.query(`
      SELECT
        c.id_carrito,
        c.id_producto,
        c.cantidad,
        p.nombre,
        p.precio,
        p.stock,
        (SELECT url_imagen FROM imagen_producto WHERE id_producto = p.id_producto LIMIT 1) as imagen
      FROM carrito c
      JOIN producto p ON c.id_producto = p.id_producto
      WHERE c.dni_usuario = $1
    `, [req.user.userId]);

    res.json({
      message: 'Carrito sincronizado exitosamente',
      items: cartResult.rows
    });
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error sincronizando carrito:', error);
    res.status(500).json({ error: 'Error al sincronizar el carrito' });
  }
};

// Limpiar carrito completo
export const clearCart = async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM carrito WHERE dni_usuario = $1',
      [req.user.userId]
    );

    res.json({ message: 'Carrito vaciado exitosamente' });
  } catch (error) {
    console.error('Error limpiando carrito:', error);
    res.status(500).json({ error: 'Error al limpiar el carrito' });
  }
};
