// importar las funciones necesarias de vue-router
import {createRouter, createWebHistory} from 'vue-router';
//Importar tus componentes
import productos from '../components/productos.vue'    
import carrito from '../components/carrito.vue';
import inicioSesion from '../components/inicioSesion.vue';
import marcas from '../components/marcas.vue';
import ofertas from '../components/ofertas.vue';
import quienesSomos from '../components/quienesSomos.vue';

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
    },
    {
        path: '/inicioSesion',
        name: 'inicioSesion',
        component: inicioSesion
    },
    {
        path: '/marcas',
        name: 'marcas',
        component: marcas
    },
    {
        path: '/ofertas',
        name: 'ofertas',
        component: ofertas
    },
    {
        path: '/quienesSomos',
        name: 'quienesSomos',
        component: quienesSomos
    },
]
//Crear el router
const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
