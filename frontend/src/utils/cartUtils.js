const CART_KEY = 'capygaming_cart';

  export function getCart() {
    try {
      const cart = localStorage.getItem(CART_KEY);
      return cart ? JSON.parse(cart) : [];
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

  export function addToCart(product) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    saveCart(cart);
    return cart;
  }

  export function removeFromCart(productId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    saveCart(filteredCart);
    return filteredCart;
  }

  export function updateQuantity(productId, quantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        return removeFromCart(productId);
      } else {
        cart[itemIndex].quantity = quantity;
        saveCart(cart);
      }
    }

    return cart;
  }

  export function clearCart() {
    localStorage.removeItem(CART_KEY);
    window.dispatchEvent(new Event('cartUpdated'));
    return [];
  }

  export function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.precio * item.quantity), 0);
  }