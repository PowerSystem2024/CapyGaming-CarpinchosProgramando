// importar las funciones necesarias de vue-router
import {createRouter,createWebHistory} from 'vue-router';

//Importar tus componentes
import Carrito from '../components/Carrito.vue';
import InicioSesion from '../components/InicioSesion.vue';
import Marcas from '../components/Marcas.vue';
import QuienesSomos from '../components/QuienesSomos.vue';
import Registro from '../components/Registro.vue';
import RecuperarContra from '../components/RecuperarContra.vue';
import PaymentSuccess from '../components/PaymentSuccess.vue';
import PaymentFailure from '../components/PaymentFailure.vue';
import PaymentPending from '../components/PaymentPending.vue';
import NotFound from "../components/NotFound.vue";
import Home from '../components/Home.vue';
import Ofertas from '../components/Ofertas.vue';
import Catalogo from '../components/Catalogo.vue';
import ProductoDetalle from '../components/ProductoDetalle.vue';
import CatalogoCategoria from '../components/CatalogoCategoria.vue';
import Contacto from '../components/Contacto.vue';
import PreguntasFrecuentes from '../components/PreguntasFrecuentes.vue';
import ResultadosPage from '../components/ResultadosPage.vue';
import TerminosCondiciones from '../components/TerminosCondiciones.vue';
import Perfil from '../components/Perfil.vue';
import MisPedidos from '../components/MisPedidos.vue';
import DetallePedido from '../components/DetallePedido.vue';
import AuthService from '../services/authService.js';


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
        component: Carrito
    },
    {
        path: '/inicioSesion',
        name: 'InicioSesion',
        component:  InicioSesion
       
    },
    {
        path: '/registro',
        name: 'Registro',
        component: Registro
    },
    {
        path: '/recuperarContra',
        name: 'RecuperarContra',
        component: RecuperarContra
    },
    {
        path: '/marcas',
        name: 'Marcas',
        component: Marcas
    },
    {
        path: '/quienesSomos',
        name: 'QuienesSomos',
        component: QuienesSomos
    },
    {
        path: '/perfil',
        name: 'Perfil',
        component: Perfil,
        meta: { requiresAuth: true }
    },
    {
        path: '/mis-pedidos',
        name: 'MisPedidos',
        component: MisPedidos,
        meta: { requiresAuth: true }
    },
    {
        path: '/pedido/:id',
        name: 'DetallePedido',
        component: DetallePedido,
        meta: { requiresAuth: true }
    },
    {
        path: "/:pathMatch(.*)*", // Ruta comodín para páginas no encontradas
        name: "NotFound",
        component: NotFound
    },
    {
        path: "/ofertas",
        name: "Ofertas",
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
    },
    {
        path: "/contacto",
        name: "Contacto",
        component: Contacto
    },
    {
       path: '/payment/success',
       name: 'PaymentSuccess',
       component: PaymentSuccess
    },
    {
       path: '/payment/failure',
       name: 'PaymentFailure',
       component: PaymentFailure
    },
    {
       path: '/payment/pending',
       name: 'PaymentPending',
       component: PaymentPending
    }, 

    {
        path: '/PreguntasFrecuentes',
        name: 'PreguntasFrecuentes',
        component: PreguntasFrecuentes
    },
    {
        path: '/resultados',
        component: ResultadosPage
    },
    {
        path: "/terminosycondiciones",
        name: "TerminosYCondiciones",
        component: TerminosCondiciones
    },
    {
        path: '/restablecer-contrasena',
        name: 'RestablecerContra',
        component: () => import('../components/RestablecerContra.vue')
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

// Middleware de navegación
router.beforeEach((to) => {
    const isAuth = AuthService.isAuthenticated();

    // Si está autenticado y quiere ir a login/registro, redirigir a home
    if (isAuth && (to.name === 'InicioSesion' || to.name === 'Registro' || to.name === 'RecuperarContra')) {
        return { name: 'Home' }
    }

    // Si la ruta requiere autenticación y no está logueado, redirigir a login
    if (to.meta.requiresAuth && !isAuth) {
        return { name: 'InicioSesion' }
    }
})

export default router;