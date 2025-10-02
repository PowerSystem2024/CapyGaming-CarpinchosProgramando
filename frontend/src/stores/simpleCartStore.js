import { defineStore } from 'pinia';

export const useSimpleCartStore = defineStore('simpleCart', {
  state: () => {
    // Cargar el carrito del localStorage al inicio
    const savedCart = localStorage.getItem('capyGamingCart');
    const items = savedCart ? JSON.parse(savedCart) : [];

    return {
      items: items
    };
  },

  getters: {
    cartItemsCount: (state) => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    cartTotal: (state) => {
      return state.items.reduce((total, item) => {
        const precio = typeof item.precio === 'string' ? parseFloat(item.precio) : item.precio;
        return total + (precio * item.quantity);
      }, 0);
    }
  },

  actions: {
    addToCart(product) {
      console.log('=== AGREGANDO PRODUCTO AL CARRITO ===');
      console.log('Producto recibido:', product);

      const existingItem = this.items.find(item => item.id_producto === product.id_producto);

      if (existingItem) {
        existingItem.quantity++;
        console.log('Producto ya existe, incrementando cantidad:', existingItem);
      } else {
        const newItem = {
          id_producto: product.id_producto,
          nombre: product.nombre,
          precio: typeof product.precio === 'string' ? parseFloat(product.precio) : product.precio,
          marca: product.marca || '',
          imagenes: product.imagenes || [],
          stock: product.stock,
          quantity: 1
        };
        this.items.push(newItem);
        console.log('Nuevo producto agregado:', newItem);
      }

      // Guardar en localStorage
      this.saveToLocalStorage();

      console.log('Estado actual del carrito:', this.items);
      console.log('Total de items:', this.cartItemsCount);
    },

    removeFromCart(productId) {
      const index = this.items.findIndex(item => item.id_producto === productId);
      if (index > -1) {
        this.items.splice(index, 1);
        this.saveToLocalStorage();
      }
    },

    increaseQuantity(productId) {
      const item = this.items.find(item => item.id_producto === productId);
      if (item && item.quantity < item.stock) {
        item.quantity++;
        this.saveToLocalStorage();
      }
    },

    decreaseQuantity(productId) {
      const item = this.items.find(item => item.id_producto === productId);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          this.removeFromCart(productId);
        }
        this.saveToLocalStorage();
      }
    },

    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      try {
        localStorage.setItem('capyGamingCart', JSON.stringify(this.items));
        console.log('Carrito guardado en localStorage');
      } catch (error) {
        console.error('Error al guardar en localStorage:', error);
      }
    }
  }
});