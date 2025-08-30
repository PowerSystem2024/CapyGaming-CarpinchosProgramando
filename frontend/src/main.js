import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/base.css'
import router from './router'

createApp(App).use(router).mount('#app')