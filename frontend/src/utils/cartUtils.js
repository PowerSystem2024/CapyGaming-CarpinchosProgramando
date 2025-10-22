import { toRaw } from 'vue';
const CART_KEY = 'cart';

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

  export function addToCart(product, cantidad = 1) {
    const cart = getCart();
    //const rawProduct = toRaw(product)
    const existingItemIndex = cart.findIndex(item => item.id_producto === product.id_producto);
    if (existingItemIndex !== -1) {
      // Si existe, verificar stock antes de aumentar
      const currentQuantity = cart[existingItemIndex].quantity;
      const newQuantity = currentQuantity + cantidad;

      if(newQuantity > product.stock){
        cart[existingItemIndex].quantity = product.stock; //no superar stock
        saveCart(cart);
        return{
          success: false,
          message: `Stock máximo alcanzado (${product.stock} unidades)`
        };
      } else {
        cart[existingItemIndex].quantity = newQuantity;
        saveCart(cart);
        return {success: true, message: 'Producto agregado al carrito'};
      }
    }else{
      // Agregar nuevo producto con la cantidad seleccionada, sin pasar stock
      const quantityToAdd = cantidad > product.stock ? product.stock : cantidad;
      cart.push({
        ...product,
        quantity: quantityToAdd
      });
      saveCart(cart);
      return{success: true, message: 'Producto agregado al carrito'};
    }
  }

  export function removeFromCart(productId) {
    const cart = getCart();
    const filteredCart = cart.filter(item => item.id_producto !== productId);
    saveCart(filteredCart);
    return filteredCart;
  }

  export function updateQuantity(productId, quantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(item => item.id_producto === productId);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        return removeFromCart(productId);
      } else {
        // Verificar que no exceda el stock
        const product = cart[itemIndex];
        if (quantity > product.stock) {
          return{
            success: false,
            message: `⚠ Stock máximo: ${product.stock} unidades`
          }
        }
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
  return cart.reduce((total, item) => total + item.precio * item.quantity, 0);
  }