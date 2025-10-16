import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

// Cargar variables de entorno
dotenv.config();
console.log('🧪 ENV test:', process.env.TEST_VARIABLE);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes); // Ahora la ruta completa es /api/productos
app.use('/api', cartRoutes); // Rutas: /api/carrito, /api/carrito/sync
app.use('/api', orderRoutes); // Rutas: /api/pedidos, /api/pedidos/webhook


// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend de CapyGaming funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API de CapyGaming funcionando correctamente',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        logout: 'POST /api/auth/logout',
        forgotPassword: 'POST /api/auth/forgot-password'
      },
      cart: {
        get: 'GET /api/carrito',
        add: 'POST /api/carrito',
        update: 'PUT /api/carrito/:id_producto',
        remove: 'DELETE /api/carrito/:id_producto',
        sync: 'POST /api/carrito/sync',
        clear: 'DELETE /api/carrito'
      },
      orders: {
        create: 'POST /api/pedidos',
        list: 'GET /api/pedidos',
        detail: 'GET /api/pedidos/:id',
        cancel: 'POST /api/pedidos/:id/cancelar',
        webhook: 'POST /api/pedidos/webhook'
      },
      health: 'GET /api/health'
    }
  });
});

// Middleware para rutas no encontradas (sin usar comodín *)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
