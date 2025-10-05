import pool from '../bd/pool.js';

// Obtener carrito del usuario
export const getCart = async (req, res) => {
  const { userId } = req.user; // userId viene del middleware de autenticación
  
  try {
    const result = await pool.query(`
      SELECT 
        c.id,
        c.producto_id,
        c.cantidad,
        c.precio_unitario,
        c.fecha_agregado,
        p.nombre,
        p.imagenes,
        p.stock,
        p.categoria,
        p.marca
      FROM carrito c
      LEFT JOIN producto p ON c.producto_id = p.id
      WHERE c.usuario_dni = $1
      ORDER BY c.fecha_agregado DESC
    `, [userId]);

    const cartItems = result.rows.map(item => ({
      id_producto: item.producto_id,
      id: item.producto_id,
      nombre: item.nombre,
      precio: parseFloat(item.precio_unitario),
      quantity: item.cantidad,
      imagenes: item.imagenes || [],
      stock: item.stock,
      categoria: item.categoria,
      marca: item.marca,
      fecha_agregado: item.fecha_agregado
    }));

    res.json({
      success: true,
      cart: cartItems,
      count: cartItems.reduce((total, item) => total + item.quantity, 0),
      total: cartItems.reduce((total, item) => total + (item.precio * item.quantity), 0)
    });

  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Agregar producto al carrito
export const addToCart = async (req, res) => {
  const { userId } = req.user;
  const { producto_id, cantidad = 1, precio_unitario } = req.body;

  try {
    // Verificar si el producto ya existe en el carrito
    const existingItem = await pool.query(
      'SELECT * FROM carrito WHERE usuario_dni = $1 AND producto_id = $2',
      [userId, producto_id]
    );

    if (existingItem.rows.length > 0) {
      // Actualizar cantidad
      const newQuantity = existingItem.rows[0].cantidad + cantidad;
      
      await pool.query(
        'UPDATE carrito SET cantidad = $1 WHERE usuario_dni = $2 AND producto_id = $3',
        [newQuantity, userId, producto_id]
      );

      res.json({
        success: true,
        message: 'Cantidad actualizada en el carrito',
        quantity: newQuantity
      });
    } else {
      // Agregar nuevo item
      await pool.query(
        'INSERT INTO carrito (usuario_dni, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [userId, producto_id, cantidad, precio_unitario]
      );

      res.json({
        success: true,
        message: 'Producto agregado al carrito'
      });
    }

  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Actualizar cantidad de producto
export const updateCartItem = async (req, res) => {
  const { userId } = req.user;
  const { producto_id, cantidad } = req.body;

  try {
    if (cantidad <= 0) {
      // Eliminar item si cantidad es 0 o negativa
      await pool.query(
        'DELETE FROM carrito WHERE usuario_dni = $1 AND producto_id = $2',
        [userId, producto_id]
      );
    } else {
      // Actualizar cantidad
      await pool.query(
        'UPDATE carrito SET cantidad = $1 WHERE usuario_dni = $2 AND producto_id = $3',
        [cantidad, userId, producto_id]
      );
    }

    res.json({
      success: true,
      message: 'Carrito actualizado'
    });

  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Eliminar producto del carrito
export const removeFromCart = async (req, res) => {
  const { userId } = req.user;
  const { producto_id } = req.params;

  try {
    await pool.query(
      'DELETE FROM carrito WHERE usuario_dni = $1 AND producto_id = $2',
      [userId, producto_id]
    );

    res.json({
      success: true,
      message: 'Producto eliminado del carrito'
    });

  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Vaciar carrito completo
export const clearCart = async (req, res) => {
  const { userId } = req.user;

  try {
    await pool.query(
      'DELETE FROM carrito WHERE usuario_dni = $1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Carrito vaciado'
    });

  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};

// Sincronizar carrito local con carrito de base de datos
export const syncCart = async (req, res) => {
  const { userId } = req.user;
  const { localCart } = req.body; // Array de productos del localStorage

  try {
    // Comenzar transacción
    await pool.query('BEGIN');

    // Limpiar carrito actual
    await pool.query('DELETE FROM carrito WHERE usuario_dni = $1', [userId]);

    // Insertar items del carrito local
    for (const item of localCart) {
      await pool.query(
        'INSERT INTO carrito (usuario_dni, producto_id, cantidad, precio_unitario) VALUES ($1, $2, $3, $4)',
        [userId, item.id_producto || item.id, item.quantity, item.precio]
      );
    }

    await pool.query('COMMIT');

    // Retornar carrito sincronizado
    const updatedCart = await pool.query(`
      SELECT 
        c.producto_id,
        c.cantidad,
        c.precio_unitario,
        p.nombre,
        p.imagenes,
        p.stock,
        p.categoria,
        p.marca
      FROM carrito c
      LEFT JOIN producto p ON c.producto_id = p.id
      WHERE c.usuario_dni = $1
      ORDER BY c.fecha_agregado DESC
    `, [userId]);

    const cartItems = updatedCart.rows.map(item => ({
      id_producto: item.producto_id,
      id: item.producto_id,
      nombre: item.nombre,
      precio: parseFloat(item.precio_unitario),
      quantity: item.cantidad,
      imagenes: item.imagenes || [],
      stock: item.stock,
      categoria: item.categoria,
      marca: item.marca
    }));

    res.json({
      success: true,
      message: 'Carrito sincronizado',
      cart: cartItems
    });

  } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error al sincronizar carrito:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor' 
    });
  }
};