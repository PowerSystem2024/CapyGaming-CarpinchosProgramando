import { createRouter, createWebHistory } from 'vue-router'
import inicioSesion from '../components/inicioSesion.vue'
import Productos from '../components/productos.vue'

const routes = [
  { path: '/', name: 'productos', component: Productos },
  { path: '/inicioSesion', name: 'inicioSesion', component: inicioSesion }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router