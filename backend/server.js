import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware especial para webhooks de MercadoPago (debe ir antes del express.json())
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Puerto correcto del frontend
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes); // Ahora la ruta completa es /api/productos
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);


// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend de CapyGaming funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
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
