// importar las funciones necesarias de vue-router
import {createRouter, createWebHistory} from 'vue-router';
//Importar tus componentes
import Productos from '../components/Productos.vue'
import Carrito from '../components/Carrito.vue';
import InicioSesion from '../components/InicioSesion.vue';
import Marcas from '../components/Marcas.vue';
import QuienesSomos from '../components/QuienesSomos.vue';
import Registro from '../components/Registro.vue';
import RecuperarContra from '../components/RecuperarContra.vue';
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
        path: "/:pathMatch(.*)*", // Ruta comodín para páginas no encontradas
        name: "NotFound",
        component: NotFound
    },
        {
        path: "/productos",
        name: "Productos",
        component: Productos
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

// Middleware de navegación corregido
router.beforeEach((to) => {
    const isAuth = AuthService.isAuthenticated();  // ← Usar el servicio
    if (isAuth && (to.name === 'InicioSesion' || to.name === 'Registro' || to.name === 'RecuperarContra')) {
        return { name: 'Home' } // Redirige al home si ya está logueado
    }
})

export default router;