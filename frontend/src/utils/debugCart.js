// Funciones de depuración para el carrito
export const debugCart = {
  // Ver el contenido actual del carrito en localStorage
  viewCart: () => {
    const cart = localStorage.getItem('capyGamingCart');
    if (cart) {
      console.log('Carrito en localStorage:', JSON.parse(cart));
      return JSON.parse(cart);
    } else {
      console.log('No hay carrito en localStorage');
      return [];
    }
  },

  // Limpiar el carrito manualmente
  clearCart: () => {
    localStorage.removeItem('capyGamingCart');
    console.log('Carrito limpiado');
    window.location.reload();
  },

  // Agregar un producto de prueba
  addTestProduct: () => {
    const testProduct = {
      id_producto: 999,
      nombre: 'Producto de Prueba',
      precio: 100,
      marca: 'Test',
      imagenes: [],
      stock: 10,
      quantity: 1
    };

    const currentCart = localStorage.getItem('capyGamingCart');
    const cart = currentCart ? JSON.parse(currentCart) : [];
    cart.push(testProduct);
    localStorage.setItem('capyGamingCart', JSON.stringify(cart));
    console.log('Producto de prueba agregado:', testProduct);
    window.location.reload();
  }
};

// Hacer las funciones disponibles globalmente para depuración
if (typeof window !== 'undefined') {
  window.debugCart = debugCart;
}