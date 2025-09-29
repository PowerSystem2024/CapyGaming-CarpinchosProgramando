import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Agrega esto después de las otras rutas y antes del middleware de errores

// Ruta raíz para evitar el error
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
      health: 'GET /api/health'
    }
  });
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes); // Ahora la ruta completa es /api/productos


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
