import { toRaw } from 'vue';
import CartService from '../services/cartService.js';

const CART_KEY = 'cart';

// Helper para verificar si el usuario está autenticado
function isAuthenticated() {
  return !!localStorage.getItem('token');
}

  export function getCart() {
    try {
      const cart = localStorage.getItem(CART_KEY);
      const parsedCart = cart ? JSON.parse(cart) : [];
      console.log("getCart devuelve:", parsedCart); // Mover antes del return
      return parsedCart;
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
      return [];
    }
  }

  export function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error al guardar el carrito:', error);
    }
  }

  export async function addToCart(product) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id_producto === product.id_producto);

    if (existingItemIndex !== -1) {
      // Si existe, verificar stock antes de aumentar
      const currentQuantity = cart[existingItemIndex].quantity;
      if (currentQuantity < product.stock) {
        cart[existingItemIndex].quantity += 1;
        saveCart(cart);

        // Si está autenticado, sincronizar con el backend
        if (isAuthenticated()) {
          try {
            await CartService.addToCart(product.id_producto, 1);
          } catch (error) {
            console.warn('No se pudo sincronizar con el backend:', error);
          }
        }

        return { success: true, message: 'Producto agregado al carrito' };
      } else {
        return { success: false, message: `Stock máximo alcanzado (${product.stock} unidades)` };
      }
    } else {
      // Si no existe, agregarlo con cantidad 1
      cart.push({
        ...product,
        quantity: 1
      });
      saveCart(cart);

      // Si está autenticado, sincronizar con el backend
      if (isAuthenticated()) {
        try {
          await CartService.addToCart(product.id_producto, 1);
        } catch (error) {
          console.warn('No se pudo sincronizar con el backend:', error);
        }
      }

      return { success: true, message: 'Producto agregado al carrito' };
    }
  }

  export async function removeFromCart(productId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id_producto !== productId);
    saveCart(filteredCart);

    // Si está autenticado, sincronizar con el backend
    if (isAuthenticated()) {
      try {
        await CartService.removeFromCart(productId);
      } catch (error) {
        console.warn('No se pudo sincronizar con el backend:', error);
      }
    }

    return filteredCart;
  }
 
  export async function updateQuantity(productId, quantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id_producto === productId);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        return removeFromCart(productId);
      } else {
        // Verificar que no exceda el stock
        const product = cart[itemIndex];
        if (quantity > product.stock) {
          alert(`⚠️ Stock máximo: ${product.stock} unidades`);
          return cart;
        }
        cart[itemIndex].quantity = quantity;
        saveCart(cart);

        // Si está autenticado, sincronizar con el backend
        if (isAuthenticated()) {
          try {
            await CartService.updateCartItem(productId, quantity);
          } catch (error) {
            console.warn('No se pudo sincronizar con el backend:', error);
          }
        }
      }
    }

    return cart;
  }

  export async function clearCart() {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('cartUpdated'));

    // Si está autenticado, sincronizar con el backend
    if (isAuthenticated()) {
      try {
        await CartService.clearCart();
      } catch (error) {
        console.warn('No se pudo sincronizar con el backend:', error);
      }
    }

    return [];
  }

  // Sincronizar carrito del localStorage con el backend (usado al login/registro)
  export async function syncCartWithBackend() {
    const cart = getCart();

    if (cart.length === 0) {
      return;
    }

    try {
      const items = cart.map(item => ({
        id_producto: item.id_producto,
        cantidad: item.quantity
      }));

      const result = await CartService.syncCart(items);

      // Actualizar el localStorage con el carrito sincronizado
      if (result && result.items) {
        // Convertir formato del backend al formato del frontend
        const updatedCart = result.items.map(item => ({
          id_producto: item.id_producto,
          nombre: item.nombre,
          precio: parseFloat(item.precio),
          stock: item.stock,
          marca: item.marca,
          imagen: item.imagen,
          quantity: item.cantidad
        }));

        localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
      }
    } catch (error) {
      console.error('Error sincronizando carrito con backend:', error);
    }
  }

  export function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.precio * item.quantity, 0);
  }