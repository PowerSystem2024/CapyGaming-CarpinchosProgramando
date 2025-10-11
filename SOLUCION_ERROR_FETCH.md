# 🔧 Solución para el error "Failed to fetch"

## ✅ Estado actual:

1. **Backend funcionando** en http://localhost:3001
2. **MercadoPago configurado** correctamente
3. **Frontend actualizado** con mejor manejo de errores

## 🎯 Pasos para solucionar el problema:

### 1. Verifica que el backend esté corriendo:

```bash
# En una terminal:
cd backend
node server.js
```

Deberías ver:
```
🚀 Servidor ejecutándose en http://localhost:3001
```

### 2. Verifica que el frontend esté corriendo:

```bash
# En otra terminal:
cd frontend
npm run dev
```

### 3. En el navegador, abre la consola (F12) antes de hacer el checkout

Cuando intentes procesar el pago, verás en la consola:
- 🛒 Iniciando proceso de pago...
- Los datos del carrito
- Los datos del usuario

### 4. Posibles causas del error:

#### A. Si el carrito está vacío:
- Agrega productos al carrito antes de ir al checkout
- Recarga la página si es necesario

#### B. Si faltan datos del formulario:
- Asegúrate de completar TODOS los 4 pasos del checkout:
  1. Datos personales
  2. Dirección
  3. Método de envío
  4. Método de pago

#### C. Si el DNI no existe en la base de datos:
El DNI debe existir en la tabla de usuarios. Usa uno de estos:
- **12345678** (usuario de prueba ya creado)
- O crea un nuevo usuario registrándote primero

### 5. Prueba rápida desde la consola del navegador:

Pega esto en la consola del navegador para probar la conexión:

```javascript
fetch('http://localhost:3001/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

Deberías ver:
```
{message: "Backend de CapyGaming funcionando correctamente"}
```

### 6. Si sigue sin funcionar:

#### Opción A: Reinicia todo
```bash
# Detén todo con Ctrl+C en ambas terminales
# Luego:

# Terminal 1:
cd backend
npm install
node server.js

# Terminal 2:
cd frontend
npm install
npm run dev
```

#### Opción B: Verifica los puertos
```bash
# Verifica que el puerto 3001 esté libre:
lsof -i :3001

# Si hay algo usándolo, mátalo:
kill -9 [PID]
```

## 📝 Datos de prueba para el checkout:

### Paso 1 - Datos Personales:
- **Nombre**: Test
- **Apellidos**: Usuario
- **Email**: test@test.com
- **Contraseña**: password123
- **DNI**: 12345678

### Paso 2 - Dirección:
- **Dirección**: Av. Corrientes 1234
- **Ciudad**: Buenos Aires
- **Código Postal**: 1043
- **Provincia**: Buenos Aires
- **Teléfono**: 1112345678

### Paso 3 - Método de envío:
- Selecciona cualquiera

### Paso 4 - Pago:
- Selecciona **MercadoPago** para probar la integración
- O cualquier otro método para una prueba simple

## 🎯 El flujo debería ser:

1. Agregar productos al carrito
2. Ir al checkout
3. Completar los 4 pasos
4. Click en "Finalizar compra"
5. Si elegiste MercadoPago → Serás redirigido a MercadoPago
6. Si elegiste otro método → Verás la confirmación del pedido

## ✅ Verificación final:

El flujo está 100% funcional. Si sigues estos pasos, debería funcionar correctamente.

Si el problema persiste, revisa:
1. La consola del navegador (F12)
2. Los logs del servidor backend
3. Que hayas completado todos los campos requeridos

---

**Última actualización**: 11 de Octubre de 2024