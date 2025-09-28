import {createRouter, createWebHistory} from 'vue-router';
import AuthService from '../services/authService.js';

// Importar tus componentes (mantén tus imports actuales)
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
import Catalogo from '../components/Catalogo.vue';
import ProductoDetalle from '../components/ProductoDetalle.vue';

//Definir las rutas de tu aplicacion
const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: false }
    },
    {
        path: '/carrito',
        name: 'Carrito',
        component: carrito,
        meta: { requiresAuth: true } // Proteger carrito
    },
    {
        path: '/inicioSesion',
        name: 'inicioSesion',
        component: inicioSesion,
        meta: { requiresGuest: true } // Solo para usuarios no autenticados
    },
    {
        path: '/registro',
        name: 'registro',
        component: registro,
        meta: { requiresGuest: true }
    },
    {
        path: '/recuperarContra',
        name: 'recuperarContra',
        component: recuperarContra,
        meta: { requiresGuest: true }
    },
    {
        path: '/marcas',
        name: 'marcas',
        component: marcas,
        meta: { requiresAuth: false }
    },
    {
        path: '/quienesSomos',
        name: 'quienesSomos',
        component: quienesSomos,
        meta: { requiresAuth: false }
    },
    {
        path: "/productos",
        name: "Productos",
        component: productos,
        meta: { requiresAuth: false }
    },
    {
        path: "/ofertas",
        name: "ofertas",
        component: Ofertas,
        meta: { requiresAuth: false }
    },
    {
        path: "/catalogo",
        name: "Catologo",
        component: Catalogo,
        meta: { requiresAuth: false }
    },
    {
        path: '/productoDetalle/:id',
        name: 'ProductoDetalle',
        component: ProductoDetalle,
        meta: { requiresAuth: false }
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound
    }
]

//Crear el router
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 }
    }
});

// Guard de navegación mejorado
router.beforeEach((to, from, next) => {
    const isAuthenticated = AuthService.isAuthenticated();
    
    // Si la ruta requiere autenticación y el usuario no está autenticado
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/inicioSesion');
        return;
    }
    
    // Si la ruta es solo para invitados y el usuario está autenticado
    if (to.meta.requiresGuest && isAuthenticated) {
        next('/');
        return;
    }
    
    next();
});

export default router;