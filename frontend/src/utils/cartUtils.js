import { toRaw } from 'vue';
import { authAPI, cartAPI } from '../services/api.js';

const CART_KEY = 'cart';

export async function getCart() {
  try {
    // Si el usuario está autenticado, obtener carrito del servidor
    if (authAPI.isAuthenticated()) {
      try {
        const response = await cartAPI.getCart();
        if (response.success) {
          console.log("🛒 Carrito obtenido del servidor:", response.cart);
          return response.cart;
        }
      } catch (error) {
        console.error('Error al obtener carrito del servidor, usando localStorage:', error);
        // Si hay error con el servidor, continuar con localStorage
      }
    }
    
    // Fallback a localStorage
    const cart = localStorage.getItem(CART_KEY);
    const parsedCart = cart ? JSON.parse(cart) : [];
    
    // Normalizar productos para que siempre tengan id_producto
    const normalizedCart = parsedCart.map(item => ({
      ...item,
      id_producto: item.id_producto || item.id
    }));
    
    console.log("🛒 Carrito obtenido de localStorage:", normalizedCart);
    return normalizedCart;
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    return [];
  }
}

// Versión síncrona para compatibilidad con código existente
export function getCartSync() {
  try {
    const cart = localStorage.getItem(CART_KEY);
    const parsedCart = cart ? JSON.parse(cart) : [];
    
    // Normalizar productos para que siempre tengan id_producto
    const normalizedCart = parsedCart.map(item => ({
      ...item,
      id_producto: item.id_producto || item.id
    }));
    
    return normalizedCart;
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
  try {
    // Normalizar el producto para que siempre tenga id_producto
    const normalizedProduct = {
      ...product,
      id_producto: product.id_producto || product.id
    };
    
    const productId = normalizedProduct.id_producto;
    
    // Si el usuario está autenticado, usar la API
    if (authAPI.isAuthenticated()) {
      try {
        const response = await cartAPI.addToCart(
          productId, 
          1, 
          normalizedProduct.precio
        );
        
        if (response.success) {
          window.dispatchEvent(new Event('cartUpdated'));
          return { success: true, message: response.message };
        }
      } catch (error) {
        console.error('Error al agregar al carrito en servidor:', error);
        // Si hay error con el servidor, continuar con localStorage
      }
    }
    
    // Fallback a localStorage
    const cart = getCartSync();
    const existingItemIndex = cart.findIndex(item => (item.id_producto || item.id) === productId);
    
    if (existingItemIndex !== -1) {
      // Si existe, verificar stock antes de aumentar
      const currentQuantity = cart[existingItemIndex].quantity;
      if (currentQuantity < normalizedProduct.stock) {
        cart[existingItemIndex].quantity += 1;
        saveCart(cart);
        return { success: true, message: 'Producto agregado al carrito' };
      } else {
        return { success: false, message: `Stock máximo alcanzado (${normalizedProduct.stock} unidades)` };
      }
    } else {
      // Si no existe, agregarlo con cantidad 1
      cart.push({
        ...normalizedProduct,
        quantity: 1
      });
      saveCart(cart);
      return { success: true, message: 'Producto agregado al carrito' };
    }
  } catch (error) {
    console.error('Error en addToCart:', error);
    return { success: false, message: 'Error al agregar producto' };
  }
}

export async function removeFromCart(productId) {
  try {
    // Si el usuario está autenticado, usar la API
    if (authAPI.isAuthenticated()) {
      try {
        const response = await cartAPI.removeFromCart(productId);
        if (response.success) {
          window.dispatchEvent(new Event('cartUpdated'));
          return [];
        }
      } catch (error) {
        console.error('Error al eliminar del carrito en servidor:', error);
      }
    }
    
    // Fallback a localStorage
    const cart = getCartSync();
    const filteredCart = cart.filter(item => (item.id_producto || item.id) !== productId);
    saveCart(filteredCart);
    return filteredCart;
  } catch (error) {
    console.error('Error en removeFromCart:', error);
    return [];
  }
}

export async function updateQuantity(productId, quantity) {
  try {
    // Si el usuario está autenticado, usar la API
    if (authAPI.isAuthenticated()) {
      try {
        const response = await cartAPI.updateCartItem(productId, quantity);
        if (response.success) {
          window.dispatchEvent(new Event('cartUpdated'));
          return [];
        }
      } catch (error) {
        console.error('Error al actualizar cantidad en servidor:', error);
      }
    }
    
    // Fallback a localStorage
    const cart = getCartSync();
    const itemIndex = cart.findIndex(item => (item.id_producto || item.id) === productId);

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
      }
    }

    return cart;
  } catch (error) {
    console.error('Error en updateQuantity:', error);
    return [];
  }
}

export async function clearCart() {
  try {
    // Si el usuario está autenticado, usar la API
    if (authAPI.isAuthenticated()) {
      try {
        const response = await cartAPI.clearCart();
        if (response.success) {
          localStorage.removeItem(CART_KEY);
          window.dispatchEvent(new Event('cartUpdated'));
          return [];
        }
      } catch (error) {
        console.error('Error al vaciar carrito en servidor:', error);
      }
    }
    
    // Fallback a localStorage
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('cartUpdated'));
    return [];
  } catch (error) {
    console.error('Error en clearCart:', error);
    return [];
  }
}

// Función para sincronizar carrito local con servidor al hacer login
export async function syncCartWithServer() {
  try {
    if (!authAPI.isAuthenticated()) {
      return { success: false, message: 'Usuario no autenticado' };
    }
    
    const localCart = getCartSync();
    
    if (localCart.length === 0) {
      // Si no hay carrito local, obtener del servidor
      const serverCart = await cartAPI.getCart();
      return { success: true, cart: serverCart.cart || [] };
    }
    
    // Sincronizar carrito local con servidor
    const response = await cartAPI.syncCart(localCart);
    
    if (response.success) {
      // Limpiar localStorage ya que ahora está en el servidor
      localStorage.removeItem(CART_KEY);
      window.dispatchEvent(new Event('cartUpdated'));
      return { success: true, cart: response.cart };
    }
    
    return { success: false, message: 'Error al sincronizar' };
    
  } catch (error) {
    console.error('Error al sincronizar carrito:', error);
    return { success: false, message: 'Error al sincronizar carrito' };
  }
}

export function getCartCount() {
  const cart = getCartSync();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal() {
  const cart = getCartSync();
  const total = cart.reduce((total, item) => total + item.precio * item.quantity, 0);
  console.log("🛒 CART TOTAL - Cart items:", cart);
  console.log("🛒 CART TOTAL - Calculated total:", total);
  return total;
}

  // Función debug para verificar el estado del carrito
  export function debugCart() {
    const cart = getCart();
    console.log("🔍 DEBUG CART - Items:", cart);
    console.log("🔍 DEBUG CART - Count:", getCartCount());
    console.log("🔍 DEBUG CART - Total:", getCartTotal());
    console.log("🔍 DEBUG CART - LocalStorage raw:", localStorage.getItem(CART_KEY));
    return cart;
  }