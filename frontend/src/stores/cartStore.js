import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);

  const loadFromLocalStorage = () => {
    const savedCart = localStorage.getItem('capyGamingCart');
    if (savedCart) {
      try {
        items.value = JSON.parse(savedCart);
      } catch (error) {
        console.error('Error al cargar el carrito desde localStorage:', error);
        items.value = [];
      }
    }
  };

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('capyGamingCart', JSON.stringify(items.value));
    } catch (error) {
      console.error('Error al guardar el carrito en localStorage:', error);
    }
  };

  watch(items, saveToLocalStorage, { deep: true });

  const addToCart = (product) => {
    const existingItem = items.value.find(item => item.id_producto === product.id_producto);

    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity++;
        console.log('Producto incrementado en el carrito:', existingItem);
      } else {
        console.warn('No hay suficiente stock disponible');
      }
    } else {
      const newItem = {
        id_producto: product.id_producto,
        nombre: product.nombre,
        precio: parseFloat(product.precio) || 0,
        marca: product.marca || '',
        imagenes: product.imagenes || [],
        stock: product.stock,
        quantity: 1
      };
      items.value.push(newItem);
      console.log('Producto agregado al carrito:', newItem);
      console.log('Carrito actual:', items.value);
    }
  };

  const removeFromCart = (productId) => {
    const index = items.value.findIndex(item => item.id_producto === productId);
    if (index > -1) {
      items.value.splice(index, 1);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const item = items.value.find(item => item.id_producto === productId);
    if (item) {
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else if (newQuantity <= item.stock) {
        item.quantity = newQuantity;
      } else {
        console.warn('Cantidad excede el stock disponible');
      }
    }
  };

  const increaseQuantity = (productId) => {
    const item = items.value.find(item => item.id_producto === productId);
    if (item && item.quantity < item.stock) {
      item.quantity++;
    }
  };

  const decreaseQuantity = (productId) => {
    const item = items.value.find(item => item.id_producto === productId);
    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        removeFromCart(productId);
      }
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  const cartItemsCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const cartTotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.precio * item.quantity), 0);
  });

  const isInCart = (productId) => {
    return items.value.some(item => item.id_producto === productId);
  };

  const getItemQuantity = (productId) => {
    const item = items.value.find(item => item.id_producto === productId);
    return item ? item.quantity : 0;
  };

  loadFromLocalStorage();

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartItemsCount,
    cartTotal,
    isInCart,
    getItemQuantity
  };
});