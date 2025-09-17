// importar las funciones necesarias de vue-router
import {createRouter, createWebHistory} from 'vue-router';
//Importar tus componentes
import productos from '../components/productos.vue'
import carrito from '../components/carrito.vue';
import inicioSesion from '../components/inicioSesion.vue';
import marcas from '../components/marcas.vue';
import quienesSomos from '../components/quienesSomos.vue';
import registro from '../components/registro.vue';
import recuperarContra from '../components/recuperarContra.vue';
import NotFound from "../components/notFound.vue";
import Home from '../components/Home.vue';
import Ofertas from '../components/Ofertas.vue';


//Definir las rutas de tu aplicacion
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
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
        path: '/registro',
        name: 'registro',
        component: registro
    },
    {
        path: '/recuperarContra',
        name: 'recuperarContra',
        component: recuperarContra
    },
    {
        path: '/marcas',
        name: 'marcas',
        component: marcas
    },
    {
        path: '/quienesSomos',
        name: 'quienesSomos',
        component: quienesSomos
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound
    },
        {
        path: "/productos",
        name: "Productos",
        component: productos
    },
    {
        path: "/ofertas",
        name: "ofertas",
        component: Ofertas
    }
]

//Crear el router
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
    // Siempre vuelve arriba cuando cambiás de ruta
    return { top: 0 }
    }
});

router.beforeEach((to) => {
    const isAuth = !!localStorage.getItem('auth')
    if (isAuth && (to.name === 'inicioSesion' || to.name === 'registro')) {
        return { name: 'Home' }
    }
})

export default router;