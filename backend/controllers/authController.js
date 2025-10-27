import pool from '../bd/pool.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const revokedTokens = new Set(); //Lista temporal de tokens revocados (en memoria)

// Registro de usuario
const register = async (req, res) => {
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
const login = async (req, res) => {
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

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    console.log('📧 Solicitando código para:', email);
    
    // Verificar si el usuario existe
    const userResult = await pool.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      console.log('❌ Usuario no encontrado:', email);
      return res.json({ 
        message: 'Si el email existe, se enviará un código de recuperación',
        success: true
      });
    }

    const user = userResult.rows[0];
    console.log('✅ Usuario encontrado:', user.nombre);
    
    // Generar código de 6 dígitos
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('🔐 Código generado:', resetCode);
    
    // Guardar en la base de datos (expira en 15 minutos)
    await pool.query(
      'INSERT INTO password_reset_codes (user_dni, code, expires_at) VALUES ($1, $2, $3)',
      [user.dni, resetCode, new Date(Date.now() + 15 * 60 * 1000)]
    );

    // Enviar email con el código
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de recuperación - CapyGaming',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F39C12;">Recuperación de contraseña</h2>
          <p>Hola <strong>${user.nombre}</strong>,</p>
          <p>Has solicitado restablecer tu contraseña en CapyGaming.</p>
          <p>Tu código de verificación es:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #F39C12; letter-spacing: 5px; padding: 10px 20px; border: 2px dashed #F39C12; border-radius: 5px;">
              ${resetCode}
            </span>
          </div>
          <p><strong>Instrucciones:</strong></p>
          <ol>
            <li>Copiá el código de 6 dígitos</li>
            <li>Volvé a la página de recuperación</li>
            <li>Ingresá el código en el campo correspondiente</li>
            <li>Creá tu nueva contraseña</li>
          </ol>
          <p style="color: #666; font-size: 14px;">
            <strong>Este código expirará en 15 minutos.</strong><br>
            Si no solicitaste este cambio, ignora este email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">
            Equipo CapyGaming<br>
            <a href="http://localhost" style="color: #F39C12;">Visita nuestra tienda</a>
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', info.messageId);

    res.json({ 
      message: 'Código de recuperación enviado a tu email',
      success: true 
    });

  } catch (error) {
    console.error('💥 Error en recuperación:', error);
    
    if (error.code === 'EAUTH') {
      console.error('❌ Error de autenticación de email');
    }
    
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    console.log('🔄 Intentando restablecer contraseña para:', email);
    
    // Verificar código
    const codeResult = await pool.query(
      `SELECT pc.*, u.dni 
       FROM password_reset_codes pc
       JOIN usuario u ON pc.user_dni = u.dni
       WHERE u.email = $1 AND pc.code = $2 AND pc.used = false AND pc.expires_at > NOW()`,
      [email, code]
    );

    if (codeResult.rows.length === 0) {
      console.log('❌ Código inválido o expirado');
      return res.status(400).json({ error: 'Código inválido o expirado' });
    }

    const resetCode = codeResult.rows[0];
    console.log('✅ Código válido para usuario DNI:', resetCode.dni);
    
    // Hash nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    await pool.query(
      'UPDATE usuario SET contraseña = $1 WHERE dni = $2',
      [hashedPassword, resetCode.dni]
    );

    // Marcar código como usado
    await pool.query(
      'UPDATE password_reset_codes SET used = true WHERE id = $1',
      [resetCode.id]
    );

    console.log('✅ Contraseña actualizada exitosamente');

    res.json({ 
      message: 'Contraseña restablecida exitosamente',
      success: true 
    });

  } catch (error) {
    console.error('💥 Error en resetPassword:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener perfil de usuario
const getProfile = async (req, res) => {
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

const logout = (req, res) => {
  const token = req.token; // lo extraés en el middleware
  revokedTokens.add(token);
  res.json({ message: 'Sesión cerrada correctamente' });
};

// Exportar la lista para usarla en el middleware
const isTokenRevoked = (token) => revokedTokens.has(token);

export {
  register,
  login,
  requestPasswordReset,
  getProfile,
  logout,
  resetPassword,
  isTokenRevoked
}