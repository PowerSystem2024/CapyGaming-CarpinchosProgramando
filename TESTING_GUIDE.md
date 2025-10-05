# 🧪 GUÍA DE PRUEBAS - CapyGaming con Mercado Pago

## ✅ **Pruebas básicas (sin base de datos)**

### 1. **Probar navegación y carrito**
1. Abre http://localhost:5173/
2. Ve a **"Ofertas"**
3. Agrega varios productos haciendo clic en "Agregar al carrito"
4. Ve al **"Carrito"** desde el menú
5. **✅ Verificar**: Todos los productos aparecen listados
6. **✅ Verificar**: El total se calcula correctamente
7. Modifica cantidades usando los botones +/-
8. **✅ Verificar**: Los subtotales se actualizan
9. Elimina algún producto
10. **✅ Verificar**: El producto desaparece del carrito

### 2. **Probar checkout (sin pago real)**
1. Con productos en el carrito, haz clic en **"Proceder al pago"**
2. **✅ Verificar**: Se abre el modal de checkout
3. Completa el **Paso 1** (datos personales)
4. **✅ Verificar**: Puedes avanzar al Paso 2
5. Completa direcciones y continúa
6. **✅ Verificar**: Los pasos se marcan como completados

## 🚀 **Pruebas avanzadas (con base de datos)**

### 3. **Probar registro/login**
1. Ve a **"Registro"** y crea una cuenta
2. **✅ Verificar**: Aparece mensaje de éxito
3. Haz login con las credenciales
4. **✅ Verificar**: Redirección exitosa

### 4. **Probar carrito persistente**
1. Estando logueado, agrega productos al carrito
2. Cierra el navegador completamente
3. Abre de nuevo y haz login
4. **✅ Verificar**: Los productos siguen en el carrito

### 5. **Probar flujo de pago completo**
1. Con productos en carrito, inicia checkout
2. Completa todos los pasos hasta "Pago"
3. Selecciona "Mercado Pago"
4. Haz clic en "Finalizar compra"
5. **✅ Verificar**: Redirección a Mercado Pago
6. **En MP**: Usa tarjeta de prueba (4009175332806176)
7. **✅ Verificar**: Retorno a la app con resultado

## 🔧 **Si encuentras problemas**

### Carrito no funciona:
- Abre las **Herramientas de Desarrollador (F12)**
- Ve a la pestaña **Console**
- Busca errores en rojo
- Verifica que los logs muestren: "🛒 CART - Cart items loaded"

### Checkout no funciona:
- Revisa la consola por errores de API
- Verifica que el backend esté ejecutándose en http://localhost:3001
- Prueba ir directamente a http://localhost:3001/api/health

### Pago no funciona:
- Verifica las credenciales de Mercado Pago en `.env`
- Asegúrate de usar credenciales de **TEST/SANDBOX**
- Revisa logs del servidor backend

## 📋 **Datos de prueba**

### Tarjetas de prueba MP:
- **Visa**: 4009175332806176
- **MasterCard**: 5031755734530604
- **CVV**: 123
- **Vencimiento**: 12/25

### Usuario de prueba:
- **Email**: test@capygaming.com
- **DNI**: 12345678
- **Teléfono**: +54 11 1234-5678

## 🎯 **Checklist de funcionalidades**

- [ ] ✅ Navegación por ofertas
- [ ] ✅ Agregar productos al carrito
- [ ] ✅ Ver productos en carrito
- [ ] ✅ Modificar cantidades
- [ ] ✅ Eliminar productos
- [ ] ✅ Calcular totales correctamente
- [ ] ✅ Abrir checkout modal
- [ ] ✅ Completar pasos de checkout
- [ ] ✅ Registro de usuario
- [ ] ✅ Login de usuario
- [ ] ✅ Carrito persistente (con BD)
- [ ] ✅ Creación de preferencia MP
- [ ] ✅ Redirección a MP
- [ ] ✅ Proceso de pago
- [ ] ✅ Retorno con resultado
- [ ] ✅ Estado de pedido
- [ ] ✅ Limpieza de carrito post-pago

¡Empieza con las pruebas básicas y luego ve avanzando según tu configuración! 🚀