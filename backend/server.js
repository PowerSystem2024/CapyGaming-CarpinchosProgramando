import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import mercadopagoRoutes from './routes/mercadopagoRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware - Configuración CORS simple y funcional
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/mercadopago', mercadopagoRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend de CapyGaming funcionando correctamente' });
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
        forgotPassword: 'POST /api/auth/forgot-password'
      },
      productos: 'GET /api/productos',
      orders: {
        create: 'POST /api/orders/create',
        getById: 'GET /api/orders/:id',
        userOrders: 'GET /api/orders/user/:dni'
      },
      mercadopago: {
        createPreference: 'POST /api/mercadopago/create-preference',
        webhook: 'POST /api/mercadopago/webhook',
        paymentStatus: 'GET /api/mercadopago/payment/:id'
      },
      health: 'GET /api/health'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📝 Frontend esperado en: http://localhost:5173`);
  console.log(`✅ CORS habilitado para: http://localhost:5173`);
});