import pool from '../bd/pool.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar si el usuario existe
    const userResult = await pool.query(
      'SELECT * FROM usuario WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      // Por seguridad, no revelamos si el email existe o no
      return res.json({
        message: 'Si el email existe, se enviarán instrucciones de recuperación'
      });
    }

    res.json({
      message: 'Si el email existe, se enviarán instrucciones de recuperación',
      resetToken: 'simulated-reset-token-' + Date.now()
    });

  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({ error: 'No se pudo recuperar la contraseña' });
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