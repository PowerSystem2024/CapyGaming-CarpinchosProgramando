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
import Catalogo from '../components/Catalogo.vue';
import ProductoDetalle from '../components/ProductoDetalle.vue';
import CatalogoCategoria from '../components/CatalogoCategoria.vue';


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
        path: "/:pathMatch(.*)*", // Ruta comodín para páginas no encontradas
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
    },
    {
        path: "/catalogo",
        name: "Catologo",
        component: Catalogo
    },
    {
        path: '/productoDetalle/:id',
        name: 'ProductoDetalle',
        component: ProductoDetalle
    },
    {
        path: '/categoria/:categoria/:subcategoria?',  // Ruta dinámica para categorías y subcategorías
        name: 'CatalogoCategoria',
        component: CatalogoCategoria
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

// Middleware de navegación: redirige usuarios autenticados si intentan ir a login o registro
router.beforeEach((to) => {
    const isAuth = !!localStorage.getItem('auth')  // Verifica si hay sesión activa
    if (isAuth && (to.name === 'inicioSesion' || to.name === 'registro')) {
        return { name: 'Home' } // Redirige al home si ya está logueado
    }
})

export default router;