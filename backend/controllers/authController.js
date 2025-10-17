import pool from '../bd/pool.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const revokedTokens = new Set(); //Lista temporal de tokens revocados (en memoria)

// Registro de usuario
export const register = async (req, res) => {
  const { nombre, apellido, email, telefono, dni, password, direccion } = req.body;
  
  try {
    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      'SELECT * FROM usuario WHERE email = $1 OR dni = $2',
      [email, dni]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        error: 'El usuario ya existe con este email o DNI'
      });
    }

    // Hash de la contraseña
    const saltRounds = 10; // cadena aleatoria para formar el hash, el numero es la cantidad de iteraciones
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insertar nuevo usuario
    const newUser = await pool.query(
      `INSERT INTO usuario (nombre, apellido, telefono, direccion, email, contraseña, dni)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [nombre, apellido, telefono, direccion, email, hashedPassword, dni]
    );

    // Generar token JWT
    const token = jwt.sign(
      { userId: newUser.rows[0].dni, email: newUser.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        dni: newUser.rows[0].dni,
        nombre: newUser.rows[0].nombre,
        apellido: newUser.rows[0].apellido,
        telefono: newUser.rows[0].telefono,
        direccion: newUser.rows[0].direccion,
        email: newUser.rows[0].email,
      },
      token
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'No se pudo insertar el nuevo usuario' });
  }
};

// Login de usuario
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const userResult = await pool.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = userResult.rows[0];

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.contraseña);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { userId: user.dni, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login exitoso',
      user: {
        dni: user.dni,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono,
        direccion: user.direccion,
      },
      token
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'No se pudo loguear al usuario' });
  }
};

// Solicitar recuperación de contraseña

// Configurar el transporter de Gmail CORREGIDO
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // AGREGAR estas opciones para Gmail
  tls: {
    rejectUnauthorized: false
  }
});

// Mejorar la función requestPasswordReset con mejor manejo de errores
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    console.log('📧 Intentando enviar email a:', email);
    
    // Verificar si el usuario existe
    const userResult = await pool.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado:', email);
      return res.json({ 
        message: 'Si el email existe, se enviarán instrucciones de recuperación' 
      });
    }

    const user = userResult.rows[0];
    console.log('✅ Usuario encontrado:', user.nombre);
    
    // Generar token de recuperación
    const resetToken = jwt.sign(
      { userId: user.dni, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // TEMPORAL: Crear tabla si no existe (ejecuta esto en PostgreSQL)
    // CREATE TABLE IF NOT EXISTS password_reset_tokens (id SERIAL PRIMARY KEY, user_dni BIGINT NOT NULL, token TEXT NOT NULL, expires_at TIMESTAMP NOT NULL, used BOOLEAN DEFAULT false);

    // Guardar token en la base de datos
    await pool.query(
      'INSERT INTO password_reset_tokens (user_dni, token, expires_at) VALUES ($1, $2, $3)',
      [user.dni, resetToken, new Date(Date.now() + 3600000)]
    );

    // Enviar email real
    const resetLink = `http://localhost:5173/restablecer-contrasena?token=${resetToken}`;
    
    console.log('📤 Preparando email...');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña - CapyGaming',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F39C12;">Recuperación de contraseña</h2>
          <p>Hola <strong>${user.nombre}</strong>,</p>
          <p>Has solicitado restablecer tu contraseña en CapyGaming. Haz click en el siguiente enlace:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #F39C12; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Restablecer contraseña
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            <strong>Este enlace expirará en 1 hora.</strong><br>
            Si no solicitaste este cambio, ignora este email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Equipo CapyGaming<br>
            <a href="http://localhost:5173" style="color: #F39C12;">Visita nuestra tienda</a>
          </p>
        </div>
      `
    };

    // Enviar email con manejo de errores
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', info.messageId);

    res.json({ 
      message: 'Se han enviado instrucciones de recuperación a tu email',
      success: true
    });

  } catch (error) {
    console.error('💥 Error en recuperación:', error);
    
    // Error específico de email
    if (error.code === 'EAUTH') {
      console.error('❌ Error de autenticación de email. Verifica:');
      console.error('1. Que el EMAIL_USER sea correcto');
      console.error('2. Que el EMAIL_PASS sea la contraseña de aplicación (no la contraseña normal)');
      console.error('3. Que la verificación en 2 pasos esté activada en Gmail');
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener perfil de usuario
export const getProfile = async (req, res) => {
  try {
    const userResult = await pool.query(
      'SELECT dni, nombre, apellido, email, telefono, direccion FROM usuario WHERE dni = $1',
      [req.user.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ user: userResult.rows[0] });

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    res.status(500).json({ error: 'No se pudo obtener el perfil' });
  }
};

export const logout = (req, res) => {
  const token = req.token; // lo extraés en el middleware
  revokedTokens.add(token);
  res.json({ message: 'Sesión cerrada correctamente' });
};

// Exportar la lista para usarla en el middleware
export const isTokenRevoked = (token) => revokedTokens.has(token);