# API Documentation - Authentication

**URL: http://localhost:3001/api**

## Authentication Method

JWT (JSON Web Token) con expiración de 24 horas.

---

## Endpoints

### 1. POST /auth/register

Registra un nuevo usuario en el sistema.

**URL:** `api/auth/register`

**Método:** `POST`

**Body (JSON):**

```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "email": "juan@example.com",
  "telefono": "1234567890",
  "dni": "12345678",
  "password": "password123",
  "direccion": "Calle Falsa 123"
}
```

**Validaciones:**

- `nombre`: Requerido, string
- `apellido`: Requerido, string
- `email`: Requerido, email válido, único
- `telefono`: Requerido, string
- `dni`: Requerido, numérico, único
- `password`: Requerido, string
- `direccion`: Requerido, string

**Respuesta Exitosa (201):**

```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "dni": 12345678,
    "nombre": "Juan",
    "apellido": "Perez",
    "telefono": "1234567890",
    "direccion": "Calle Falsa 123",
    "email": "juan@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**

- `400`: Usuario ya existe (email o DNI duplicado)

```json
{
  "error": "El usuario ya existe con este email o DNI"
}
```

- `400`: Datos de validación incorrectos

```json
{
  "errors": [
    {
      "field": "email",
      "message": "Email debe ser válido"
    }
  ]
}
```

- `500`: Error en el servidor

```json
{
  "error": "No se pudo insertar el nuevo usuario"
}
```

---

### 2. POST /auth/login

Autentica un usuario existente y devuelve token JWT.

**URL:** `api/auth/login`

**Método:** `POST`

**Body (JSON):**

```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Validaciones:**

- `email`: Requerido, email válido
- `password`: Requerido, string

**Respuesta Exitosa (200):**

```json
{
  "message": "Login exitoso",
  "user": {
    "dni": 12345678,
    "nombre": "Juan",
    "apellido": "Perez",
    "email": "juan@example.com",
    "telefono": "1234567890",
    "direccion": "Calle Falsa 123"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**

- `401`: Credenciales inválidas

```json
{
  "error": "Credenciales inválidas"
}
```


- `500`: Error en el servidor

```json
{
  "error": "No se pudo loguear al usuario"
}
```

**Notas:**

- Verifica email y password con bcrypt.compare
- Token JWT válido por 24 horas
- Payload del token: `{ userId: dni, email }`

---

### 3. GET /auth/profile

Obtiene el perfil del usuario autenticado.

**URL:** `api/auth/profile`

**Método:** `GET`

**Autenticación:** ✅ **Requerida** (Bearer Token)

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Exitosa (200):**

```json
{
  "user": {
    "dni": 12345678,
    "nombre": "Juan",
    "apellido": "Perez",
    "email": "juan@example.com",
    "telefono": "1234567890",
    "direccion": "Calle Falsa 123"
  }
}
```

**Errores:**

- `401`: Token no proporcionado

```json
{
  "error": "Token no proporcionado"
}
```


- `401`: Token inválido o expirado

```json
{
  "error": "Token inválido"
}
```

- `404`: Usuario no encontrado

```json
{
  "error": "Usuario no encontrado"
}
```

- `500`: Error en el servidor

```json
{
  "error": "No se pudo obtener el perfil"
}
```

**Middleware:**

- `verifyToken`: Valida y decodifica el JWT

---

### 4. POST /auth/logout

Cierra la sesión del usuario (revoca el token).

**URL:** `/auth/logout`

**Método:** `POST`

**Autenticación:** ✅ **Requerida** (Bearer Token)

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Sesión cerrada correctamente"
}
```


**Errores:**

- `401`: Token no proporcionado o inválido


**Notas:**

- ⚠️ **IMPORTANTE:** Los tokens revocados se guardan en memoria (Set)
- Se pierden al reiniciar el servidor

---

### 5. POST /auth/forgot-password

Solicita recuperación de contraseña (envío de email).

**URL:** `/auth/forgot-password`

**Método:** `POST`

**Autenticación:** No requerida

**Body (JSON):**

```json
{
  "email": "juan@example.com"
}
```

**Validaciones:**

- `email`: Requerido, email válido

**Respuesta Exitosa (200):**

```json
{
  "message": "Si el email existe, se enviarán instrucciones de recuperación",
  "resetToken": "simulated-reset-token-1234567890"
}
```


**Errores:**

- `500`: Error en el servidor

```json
{
  "error": "Algo salió mal en el servidor"
}
```


**Notas:**

- ⚠️ **Por seguridad:** Siempre devuelve el mismo mensaje (exista o no el email)
- ⚠️ **PENDIENTE:** Envío real de email no implementado
- Token de reset es simulado actualmente

---

## Middleware

### verifyToken

```javascript
// Valida el token JWT
// Extrae userId y email del payload
// Adjunta a req.user para uso en controllers
```

### Validaciones

- `registerValidation`: Valida campos de registro
- `loginValidation`: Valida email y password
- `recoveryValidation`: Valida email para recovery

---

## Seguridad

### Contraseñas

- ✅ Hasheadas con bcrypt
- ✅ Salt rounds: 10 iteraciones
- ✅ Nunca devueltas en responses

### Tokens JWT

- ✅ Firmados con JWT_SECRET (env variable)
- ✅ Expiración: 24 horas
- ⚠️ Revocación en memoria (reiniciar = pérdida, no persiste)


## Testing

**Script de testing:**

```bash
cd testing/scripts
npm run test:auth
```

**Tests incluidos:**

- ✅ Registro de usuario
- ✅ Registro duplicado (error)
- ✅ Login exitoso
- ✅ Login con credenciales incorrectas (error)
- ✅ Obtener perfil con token válido
- ✅ Perfil sin token (error)
- ✅ Perfil con token inválido (error)
- ✅ Forgot password

---

## Ejemplos de Uso

### JavaScript/Axios

```javascript
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

// Registro
const register = async () => {
  const response = await axios.post(`${BASE_URL}/auth/register`, {
    nombre: "Juan",
    apellido: "Perez",
    email: "juan@example.com",
    telefono: "1234567890",
    dni: "12345678",
    password: "password123",
    direccion: "Calle Falsa 123"
  });
  return response.data.token;
};

// Login
const login = async () => {
  const response = await axios.post(`${BASE_URL}/auth/login`, {
    email: "juan@example.com",
    password: "password123"
  });
  return response.data.token;
};

// Obtener perfil
const getProfile = async (token) => {
  const response = await axios.get(`${BASE_URL}/auth/profile`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.data.user;
};
```

### cURL

```bash
# Registro
curl -X POST "http://localhost:3001/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan","apellido":"Perez","email":"juan@example.com","telefono":"1234567890","dni":"12345678","password":"password123","direccion":"Calle Falsa 123"}'

# Para Windows
curl -X POST "http://localhost:3001/api/auth/register" -H "Content-Type: application/json" -d "{\"nombre\":\"Juan\",\"apellido\":\"Perez\",\"email\":\"juan@example.com\",\"telefono\":\"1234567890\",\"dni\":\"12345678\",\"password\":\"password123\",\"direccion\":\"Calle Falsa 123\"}"

# Login
curl -X POST "http://localhost:3001/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"password123"}'

# Para Windows
curl -X POST "http://localhost:3001/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"juan@example.com\",\"password\":\"password123\"}"

# Perfil (usar token del login)
curl -X GET "http://localhost:3001/api/auth/profile" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Para Windows
curl -X GET "http://localhost:3001/api/auth/profile" -H "Content-Type: application/json" -H "Authorization: Bearer YOUR_TOKEN"
```

**Comando:** *curl -X POST "http://localhost:3001/api/auth/register"
  -H "Content-Type: application/json"
  -d '{"nombre":"Juan","apellido":"Perez","email":"juan@example.com","telefono":"1234567890","dni":"12345678","password":"password123","direccion":"Calle Falsa 123"}'*

**Error del servidor:**


**Respuesta Exitosa (200):**


```C:\Users\guerr\Desktop\NuevoCLon\CapyGaming-CarpinchosProgramando>curl
{"message":"Usuario registrado exitosamente","user":{"dni":12345678,"nombre":"Juan","apellido":"Perez","telefono":"1234567890","direccion":"Calle Falsa 123","email":"juan@example.com"},"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1Njc4LCJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NjA5ODE3ODAsImV4cCI6MTc2MTA2ODE4MH0.R1sV6wYKvnGdDdU5AadW4CndFzi-0XKgxl4sIuj7L1Y"}
```



**Comando:** *curl -X POST "http://localhost:3001/api/auth/login" -H "Content-Type: application/json" -d "{\"email\":\"juan@example.com\",\"password\":\"password123\"}"*

**Respuesta Exitosa (200):**


**Comando**: *curl -X GET "http://localhost:3001/api/auth/profile" -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMzQ1Njc4LCJlbWFpbCI6Imp1YW5AZXhhbXBsZS5jb20iLCJpYXQiOjE3NjA5ODE3ODAsImV4cCI6MTc2MTA2ODE4MH0.R1sV6wYKvnGdDdU5AadW4CndFzi-0XKgxl4sIuj7L1Y"*


---

**Última actualización:** 2025-10-20
**Versión:** 1.0.0
**Mantenedor:** Mercedes Atim - Testing & Documentation
