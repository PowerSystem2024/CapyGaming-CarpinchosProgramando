import { createApp } from 'vue'
import './assets/styles/base.css';
import App from './App.vue'
import router from './router/index.js';


const app = createApp(App);
app.use(router); // Use the router in the Vue app
app.mount('#app');
