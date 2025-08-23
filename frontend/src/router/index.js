// importar las funciones necesarias de vue-router
import {createRouter, createWebHistory} from 'vue-router';
//Importar tus componentes
import productos from '../components/productos.vue'    
import carrito from '../components/carrito.vue';

//Definir las rutas de tu aplicacion 
const routes = [
    {
        path: '/',
        name: 'Home',
        component: productos
    },
    {
        path: '/carrito',
        name: 'Carrito',
        component: carrito
    }
]
//Crear el router
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;