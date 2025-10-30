// Utilidad para gestionar productos vistos recientemente en localStorage

const RECENTLY_VIEWED_KEY = 'recently_viewed_products';
const MAX_RECENTLY_VIEWED = 10; // Máximo de productos a guardar

/**
 * Obtiene la lista de productos vistos recientemente
 * @returns {Array} Array de productos vistos
 */
export const getRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error al obtener productos vistos:', error);
    return [];
  }
};

/**
 * Agrega un producto a la lista de vistos recientemente
 * @param {Object} producto - Producto a agregar
 */
export const addToRecentlyViewed = (producto) => {
  try {
    let recentlyViewed = getRecentlyViewed();

    // Verificar que el producto tenga la información necesaria
    if (!producto || !producto.id_producto) {
      console.warn('Producto inválido para agregar a vistos recientemente');
      return;
    }

    // Crear un objeto simplificado del producto
    const productoSimplificado = {
      id_producto: producto.id_producto,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      marca: producto.marca || '',
      categoria: producto.categoria || '',
      subcategoria: producto.subcategoria || '',
      imagenes: producto.imagenes || [],
      fecha_vista: new Date().toISOString()
    };

    // Eliminar el producto si ya existe en la lista (para moverlo al principio)
    recentlyViewed = recentlyViewed.filter(
      p => p.id_producto !== producto.id_producto
    );

    // Agregar el producto al principio de la lista
    recentlyViewed.unshift(productoSimplificado);

    // Limitar el tamaño de la lista
    if (recentlyViewed.length > MAX_RECENTLY_VIEWED) {
      recentlyViewed = recentlyViewed.slice(0, MAX_RECENTLY_VIEWED);
    }

    // Guardar en localStorage
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));

    // Disparar evento para que otros componentes se actualicen
    window.dispatchEvent(new Event('recentlyViewedUpdated'));
  } catch (error) {
    console.error('Error al agregar producto a vistos recientemente:', error);
  }
};

/**
 * Limpia la lista de productos vistos recientemente
 */
export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
    window.dispatchEvent(new Event('recentlyViewedUpdated'));
  } catch (error) {
    console.error('Error al limpiar productos vistos:', error);
  }
};

/**
 * Obtiene los N productos vistos más recientemente
 * @param {number} limit - Número de productos a retornar
 * @returns {Array} Array de productos vistos
 */
export const getRecentlyViewedLimited = (limit = 6) => {
  const recentlyViewed = getRecentlyViewed();
  return recentlyViewed.slice(0, limit);
};

/**
 * Elimina un producto específico de la lista de vistos recientemente
 * @param {number} productId - ID del producto a eliminar
 */
export const removeFromRecentlyViewed = (productId) => {
  try {
    let recentlyViewed = getRecentlyViewed();
    recentlyViewed = recentlyViewed.filter(p => p.id_producto !== productId);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewed));
    window.dispatchEvent(new Event('recentlyViewedUpdated'));
  } catch (error) {
    console.error('Error al eliminar producto de vistos recientemente:', error);
  }
};
