# Claude Context - CapyGaming Project

## 🎮 Proyecto: CapyGaming - E-commerce de Gaming

### Descripción General
E-commerce especializado en productos gaming desarrollado por equipo de 3 developers full stack trabajando colaborativamente en branches de features.

### Stack Tecnológico

**Backend:**
- Node.js + Express
- PostgreSQL (con pool.js para conexiones)
- JWT para autenticación
- bcryptjs para hashing de passwords
- Estructura: Controllers → Routes → Services → BD

**Frontend:**
- Vue.js 3 (Composition API)
- Vue Router
- Vite
- Design system con CSS custom properties
- Composables para lógica reutilizable

**Infraestructura:**
- Docker + Docker Compose
- Git Flow modificado (main → feature branches → PR)

---

## 🌿 Branching Strategy

### Estructura de Branches
```
main (desarrollo activo)
├── stable (producción)
└── feature/[TIPO]-[ID]-[nombre-descriptivo]
```

### Convención de Nombres de Branches
```bash
feature/CAPY-MP-001-mercadopago-integration
feature/AUTH-002-password-reset
feature/UI-003-product-catalog
```

### Branch Actual
**Rama activa:** `feature/CAPY-MP-001-mercadopago-integration`
**Objetivo:** Implementar sistema completo de pagos con MercadoPago

---

## 📦 Convención de Commits

### Formato
```
<tipo>(<scope>): <descripción corta>

<descripción larga opcional>
<detalles de implementación>
<archivos modificados>

Developer: [Developer 1/2/3]
```

### Tipos de Commit
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bugs
- `refactor`: Refactorización de código
- `test`: Añadir o modificar tests
- `docs`: Documentación
- `chore`: Tareas de mantenimiento (deps, config)
- `style`: Cambios de formato (no afectan lógica)
- `perf`: Mejoras de performance

### Scopes Comunes
- `api`: Backend endpoints
- `ui`: Frontend components
- `auth`: Autenticación
- `payment`: Sistema de pagos
- `database`: Cambios en BD
- `router`: Rutas frontend
- `deps`: Dependencias

### Ejemplos de Commits Reales del Proyecto
```bash
feat(payment): add mercadopago service and payment composable

Implementar servicio de MercadoPago con modo MOCK para desarrollo
independiente y composable usePayment para manejar flujo de pago.

Files:
- frontend/src/services/mercadopagoService.js
- frontend/src/composables/usePayment.js

Developer: Developer 2 (Frontend)
```

```bash
feat(api): implement authentication endpoints with validation

Crear endpoints FastAPI para registro y login con validación apropiada.

Endpoints:
- POST /api/auth/register
- POST /api/auth/login

Files:
- backend/controllers/authController.js
- backend/routes/authRoutes.js

Developer: Developer 1 (Backend)
```

---

## 👥 Team Structure & Roles

### Developer 1: Backend API
**Área:** `backend/`
**Responsabilidades:**
- Implementar controllers y routes
- Diseño de base de datos
- Servicios de integración con APIs externas
- Middleware de seguridad

### Developer 2: Frontend UI (YO - MI ROL)
**Área:** `frontend/src/`
**Responsabilidades:**
- Componentes Vue.js
- Integración con APIs
- Router y navegación
- Composables y servicios frontend
- **Estrategia:** Trabajar con MOCKS primero, integrar con backend después

**Mi enfoque de trabajo:**
1. Crear componentes UI con datos mockeados
2. Implementar flujo de navegación
3. Preparar integración con backend
4. Usar contratos de API definidos
5. Reemplazar mocks cuando backend esté listo

### Developer 3: Testing & Documentación
**Área:** Transversal + `testing/`
**Responsabilidades:**
- Scripts de testing para endpoints
- Documentación de APIs
- Testing de integración
- Estándares de testing

---

## 📁 Estructura del Proyecto

```
CapyGaming-CarpinchosProgramando/
├── backend/
│   ├── controllers/        # Lógica de negocio
│   ├── routes/            # Definición de rutas
│   ├── middleware/        # Validación, auth, etc.
│   ├── services/          # Servicios externos (MP, email)
│   ├── bd/               # Pool de BD y migrations
│   └── server.js         # Entry point
│
├── frontend/              # MI ÁREA DE TRABAJO PRINCIPAL
│   ├── src/
│   │   ├── components/   # Componentes Vue (MI FOCO)
│   │   ├── views/        # Páginas/Vistas (MI FOCO)
│   │   ├── router/       # Vue Router (MI FOCO)
│   │   ├── services/     # API clients (MI FOCO)
│   │   ├── composables/  # Lógica reutilizable (MI FOCO)
│   │   ├── utils/        # Utilidades
│   │   └── assets/       # Estilos, imágenes
│   └── package.json
│
├── testing/              # Área de Developer 3
│   ├── scripts/
│   ├── documentation/
│   └── postman/
│
├── docker-compose.yml
├── context2.md           # Estrategia de commits colaborativa
├── contexto.md           # Plan implementación MercadoPago
└── claude.md            # Este archivo
```

---

## 🔐 Sistema de Autenticación Actual

### Backend (Developer 1)
- **Tabla:** `usuario` (dni, nombre, apellido, email, contraseña, telefono, direccion)
- **JWT:** Tokens con expiración 24h
- **Password:** bcrypt con salt rounds = 10
- **Endpoints:**
  - POST `/api/auth/register`
  - POST `/api/auth/login`
  - GET `/api/auth/profile`
  - POST `/api/auth/logout`

### Frontend (MI TRABAJO)
- **Service:** `authService.js` maneja login/register/logout
- **Composable:** `useAuth.js` con estado reactivo
- **Componentes:** `InicioSesion.vue`, `Registro.vue`, `AuthModal.vue`
- **Storage:** localStorage para token y user data

---

## 💳 MercadoPago Integration (Feature Actual - MI TRABAJO PRINCIPAL)

### Estado Actual: MODO MOCK

#### Backend (Developer 1 - En progreso)
**Pendiente de implementar:**
- Controllers: `mercadopagoController.js`
- Routes: `mercadopagoRoutes.js` (ya existe, mejorar)
- Services: `mercadopagoService.js`
- Middleware: `mercadopagoValidation.js`, `webhookSecurity.js`
- Database: Tablas `pagos_mercadopago`, `webhook_events`

**Endpoints que Developer 1 debe crear:**
- POST `/api/mercadopago/create-preference`
- POST `/api/mercadopago/webhook`
- GET `/api/mercadopago/payment/:id`

#### Frontend (MI TRABAJO - COMPLETADO)
**✅ LO QUE YA IMPLEMENTÉ:**
- Service: `mercadopagoService.js` (MODO MOCK activado)
- Composable: `usePayment.js`
- Componentes: `PaymentSuccess.vue`, `PaymentFailure.vue`, `PaymentPending.vue`
- Rutas: `/payment/success`, `/payment/failure`, `/payment/pending`
- Integración: `CheckoutForm.vue` usa `usePayment`

**Modo MOCK (MI ESTRATEGIA DE TRABAJO):**
```javascript
// En mercadopagoService.js
const USE_MOCK = true;  // ← Cambiar a false cuando backend esté listo

// Simula respuesta del backend
if (USE_MOCK) {
  return {
    preferenceId: `MOCK-${Date.now()}`,
    initPoint: `https://www.mercadopago.com.ar/checkout/...`
  };
}
```

**Contrato API que uso (acordado con Developer 1):**

Request que envío:
```json
{
  "items": [
    {
      "id_producto": 1,
      "nombre": "Cyberpunk 2077",
      "precio": 5999.99,
      "quantity": 1
    }
  ],
  "payer": {
    "name": "Juan",
    "surname": "Perez",
    "email": "juan@email.com"
  },
  "total": 15000
}
```

Response que espero del backend:
```json
{
  "preferenceId": "MP_preference_id",
  "initPoint": "url_pago_mercadopago"
}
```

#### Testing (Developer 3 - En progreso)
**Responsabilidades:**
- Testear endpoints actuales (auth, products, orders)
- Crear scripts automatizados de testing
- Documentar APIs existentes
- Preparar tests para endpoints de MercadoPago

---

## 🔄 Mi Workflow de Desarrollo (Developer 2)

### Desarrollo Independiente con MOCKS

1. **Definir contratos de API con Developer 1** (Ya hecho para MercadoPago)
2. **Crear mocks basados en contratos** (Ya implementado en mercadopagoService.js)
3. **Desarrollar componentes UI con datos simulados** (Ya completado)
4. **Preparar integración real** (Listo para cuando backend esté)
5. **Cambiar USE_MOCK = false** (Cuando Developer 1 termine)
6. **Testing de integración** (Con Developer 3)

### Ejemplo de mi estrategia de trabajo:

```javascript
// 1. Primero trabajo con MOCK (AHORA)
const USE_MOCK = true;

const mockCreatePreference = () => {
  return {
    preferenceId: "MOCK-123",
    initPoint: "https://mercadopago.com/mock"
  };
};

// 2. Luego reemplazo con llamada real (CUANDO BACKEND ESTÉ)
const USE_MOCK = false;

const realCreatePreference = async (orderData) => {
  const response = await fetch('/api/mercadopago/create-preference', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
  return response.json();
};
```

---

## 🚀 Variables de Entorno

### Backend `.env` (Developer 1)
```env
# Database
DB_USER=postgres
DB_HOST=localhost
DB_NAME=capygaming
DB_PASSWORD=1234
DB_PORT=5432

# JWT
JWT_SECRET=capygaming_secret_key_super_secure_2024_carpinchos

# Server
PORT=3001

# MercadoPago (TEST)
MERCADOPAGO_ACCESS_TOKEN=TEST-8676695061727804-101112-...
MERCADOPAGO_PUBLIC_KEY=TEST-d4f7a3b0-be9a-4842-b785-...

# URLs
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
```

### Frontend `.env` (MI CONFIGURACIÓN)
```env
VITE_API_URL=http://localhost:3001
```

---

## 🎯 Mis Objetivos Inmediatos (Developer 2)

### ✅ Completado:
- [x] Crear componentes de estado de pago (PaymentSuccess, PaymentFailure, PaymentPending)
- [x] Implementar `mercadopagoService.js` con modo MOCK
- [x] Crear composable `usePayment.js`
- [x] Integrar `usePayment` con `CheckoutForm`
- [x] Configurar rutas de pago en router
- [x] Actualizar dependencias necesarias

### ⏳ Pendiente (esperando Developer 1):
- [ ] Cambiar `USE_MOCK = false` cuando backend esté listo
- [ ] Testing de integración con backend real
- [ ] Validar flujo completo end-to-end
- [ ] Ajustar manejo de errores según respuestas reales del backend

### 🔄 En coordinación con Developer 3:
- [ ] Validar componentes con scripts de testing
- [ ] Documentar flujo de pago frontend
- [ ] Testing manual del flujo completo

---

## 📚 Archivos que Creé (MercadoPago Integration)

### Services
**Ubicación:** `frontend/src/services/`
- `mercadopagoService.js` - Servicio principal con modo MOCK

### Composables
**Ubicación:** `frontend/src/composables/`
- `usePayment.js` - Lógica de procesamiento de pagos

### Componentes
**Ubicación:** `frontend/src/components/`
- `PaymentSuccess.vue` - Vista de pago exitoso
- `PaymentFailure.vue` - Vista de pago rechazado
- `PaymentPending.vue` - Vista de pago pendiente

### Rutas
**Modificado:** `frontend/src/router/index.js`
- Agregué rutas `/payment/success`, `/payment/failure`, `/payment/pending`

### Integración
**Modificado:** `frontend/src/components/CheckoutForm.vue`
- Integré composable `usePayment`
- Modifiqué función `procesarPago()` para usar MercadoPago

---

## 💡 Reglas de Oro para Claude (Trabajando conmigo - Developer 2)

### 👨‍💻 Rol de Claude como Experto en Código

**Claude es un experto en desarrollo que me ayuda a crecer como programador:**

**Claude SIEMPRE:**
- ✅ Me da instrucciones paso a paso cuando le pregunto cómo seguir desarrollando
- ✅ Me proporciona código de ejemplo que puedo copiar, pegar y aprender
- ✅ Me explica QUÉ hace cada línea de código y POR QUÉ está escrito así
- ✅ Me enseña mejores prácticas mientras codifico
- ✅ Me guía en el proceso de desarrollo para que aprenda haciéndolo yo mismo
- ✅ Responde mis preguntas sobre implementación de features
- ✅ Me ayuda a tomar decisiones técnicas explicando pros y contras

**Claude JAMÁS:**
- ❌ Modificará código directamente usando herramientas de edición
- ❌ Usará Write, Edit u otras herramientas sin mi permiso EXPLÍCITO
- ❌ Hará commits en mi lugar
- ❌ Ejecutará comandos sin explicarme primero qué hacen y por qué

**Mi forma de aprender con Claude:**
1. Le pregunto: "¿Cómo implemento [feature]?"
2. Claude me da: Pasos claros + Código de ejemplo + Explicaciones
3. YO copio el código y lo pego en mi editor
4. YO ejecuto los comandos que Claude me explicó
5. YO aprendo haciendo el trabajo

### Al trabajar en este proyecto conmigo:

1. **SOLO INSTRUCCIONES** - Darme pasos claros de lo que debo hacer YO
2. **CÓDIGO DE EJEMPLO** - Mostrarme código que pueda copiar, pegar y aprender
3. **EXPLICACIONES DETALLADAS** - Enseñarme QUÉ hace cada cosa y POR QUÉ
4. **SEGUIR CONVENCIONES** - Asegurarme de usar el formato de commits del proyecto
5. **COMMITS ATÓMICOS** - Guiarme para hacer commits pequeños y lógicos
6. **RESPETAR MI ROL** - Recordarme que soy Developer 2 (Frontend)
7. **USAR MOCKS** - Ayudarme con mi estrategia de trabajo con mocks
8. **COMUNICAR CAMBIOS** - Avisarme cuándo debo coordinar con otros developers

### Preguntas que Claude debe hacerme:

- ¿Este cambio requiere coordinar con Developer 1 o 3?
- ¿Necesitamos actualizar el contrato de API?
- ¿Estamos usando un mock o ya hay backend disponible?
- ¿Este commit es atómico o debería separarse?
- ¿Debo esperar a Developer 1 para esto o puedo avanzar con mocks?

### Cosas que Claude NO debe hacer:

- ❌ Modificar código directamente
- ❌ Sugerir cambios en backend (es área de Developer 1)
- ❌ Hacer múltiples cambios en un solo commit
- ❌ Ignorar el modo MOCK cuando backend no está listo
- ❌ Usar comandos git sin explicarme qué hacen

### Cosas que Claude SÍ debe hacer:

- ✅ Darme instrucciones paso a paso
- ✅ Explicarme qué hace cada comando antes de usarlo
- ✅ Recordarme usar mocks cuando corresponda
- ✅ Ayudarme a escribir buenos mensajes de commit
- ✅ Sugerirme cuándo debo coordinar con otros developers
- ✅ Enseñarme mientras trabajo

---

## 🔧 Comandos Útiles para Mi Trabajo

### Git (Mi flujo diario)
```bash
# Ver rama actual
git branch --show-current

# Ver mis commits recientes
git log --oneline -10

# Ver cambios sin commit
git status

# Agregar archivos específicos (mi área: frontend/src/)
git add frontend/src/components/PaymentSuccess.vue
git add frontend/src/services/mercadopagoService.js

# Commit con mensaje siguiendo convención
git commit -m "feat(payment): add payment success component

Crear componente para mostrar confirmación de pago exitoso.

Files:
- frontend/src/components/PaymentSuccess.vue

Developer: Developer 2 (Frontend)"

# Pull con rebase (siempre antes de push)
git pull origin feature/CAPY-MP-001-mercadopago-integration --rebase

# Push de mis cambios
git push origin feature/CAPY-MP-001-mercadopago-integration
```

### Frontend (Mi entorno de desarrollo)
```bash
cd frontend

# Desarrollo (mi comando más usado)
npm run dev

# Build para producción
npm run build

# Instalar nueva dependencia
npm install <paquete>
```

### Docker (para levantar backend de Developer 1)
```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs del backend
docker logs -f capygaming-backend

# Ver logs de la BD
docker logs -f capygaming-db
```

---

## 📌 Notas Importantes de Mi Trabajo

### Sobre apellido vs apellidos
**Inconsistencia que encontré:**
- BD usa: `apellido` (singular) - área de Developer 1
- Yo uso en frontend: `apellidos` (plural)
- Backend devuelve: `apellido` en responses
- **Mi solución temporal:** Mapeo `user.apellido` → `apellidos` en `loadUserData()`

**Acción pendiente:** Coordinar con Developer 1 para decidir estándar definitivo

### Sobre el CheckoutForm
**Mi implementación:**
- 4 pasos: Datos Personales, Direcciones, Método de Envío, Pago
- Integrado con `usePayment` composable
- Al finalizar compra → Redirige a MercadoPago (o mock si `USE_MOCK=true`)
- Manejo de errores con feedback visual al usuario

### Sobre MercadoPago MOCK Mode
**Mi estrategia actual:**
- `USE_MOCK = true` en `mercadopagoService.js`
- Simula delay de 1 segundo para realismo
- Genera IDs y URLs ficticias
- Me permite desarrollar toda la UI sin depender de backend
- **Cambiaré a `false` cuando Developer 1 complete los endpoints**

### Archivos que NO debo modificar
**Área de Developer 1 (Backend):**
- `backend/controllers/*`
- `backend/routes/*`
- `backend/services/*`
- `backend/bd/*`
- `backend/middleware/*`

**Excepción:** Solo si coordino cambios de contrato de API con Developer 1

---

## 🎓 Lo que Aprendí en este Proyecto

### Estrategia de Desarrollo Independiente
- **Interface-First Development:** Primero defino contratos con Developer 1
- **Mock-Driven Development:** No espero, uso mocks inteligentemente
- **Progressive Integration:** Reemplazo mocks cuando backend está listo
- **Atomic Commits:** Commits pequeños y descriptivos
- **Clear Communication:** Aviso cuando cambio algo que afecta a otros

### Coordinación con Otros Developers
- **Daily Standup:** Comunicar cambios de interfaces
- **Mock Usage:** Documentar qué estoy mockeando
- **Integration Points:** Saber cuándo necesito backend real
- **Testing Together:** Coordinar con Developer 3 para validar

---

## 🚨 Puntos de Coordinación con Developer 1

### Contratos de API Acordados

**Endpoint: Create Preference**
- **URL:** POST `/api/mercadopago/create-preference`
- **Mi Request:** Objeto con `items`, `payer`, `total`
- **Espero:** Objeto con `preferenceId`, `initPoint`
- **Estado:** ⏳ Esperando implementación de Developer 1

**Endpoint: Get Payment Status**
- **URL:** GET `/api/mercadopago/payment/:id`
- **Mi Request:** Solo ID del pago en URL
- **Espero:** Objeto con `status`, `statusDetail`, `paymentId`, `amount`
- **Estado:** ⏳ Esperando implementación de Developer 1

**Endpoint: Webhook** (solo para conocimiento)
- **URL:** POST `/api/mercadopago/webhook`
- **No lo uso directamente:** MercadoPago llama a backend
- **Responsable:** Developer 1

---

## 📊 Estado Actual del Proyecto

### Branch: feature/CAPY-MP-001-mercadopago-integration

**Developer 1 (Backend):**
- ⏳ En progreso: Controllers y endpoints de MercadoPago
- ⏳ En progreso: Tablas de BD para pagos
- ⏳ En progreso: Webhooks de MercadoPago

**Developer 2 (YO - Frontend):**
- ✅ Completado: Todos los componentes UI
- ✅ Completado: Servicio con modo MOCK
- ✅ Completado: Composable de pagos
- ✅ Completado: Rutas configuradas
- ⏳ Pendiente: Integración real cuando backend esté

**Developer 3 (Testing):**
- ⏳ En progreso: Testing de endpoints actuales
- ⏳ En progreso: Documentación de APIs
- ⏳ Pendiente: Testing de MercadoPago cuando esté integrado

---

## 🔄 Próximos Pasos

### Inmediatos (Ahora):
1. Commitear todo mi trabajo de MercadoPago (7 commits atómicos)
2. Hacer pull con rebase
3. Push a la branch de feature
4. Esperar a Developer 1

### Cuando Developer 1 termine backend:
1. Cambiar `USE_MOCK = false`
2. Probar integración real
3. Ajustar manejo de errores si es necesario
4. Testing con Developer 3

### Para Pull Request final:
1. Code review con Developer 1 y 3
2. Testing end-to-end completo
3. Documentación final
4. Merge a main

---

**Última actualización:** 2025-10-20
**Mantenido por:** Developer 2 (Frontend) - CapyGaming Team
**Estado actual:** Feature MercadoPago Integration - Frontend completado, esperando backend
**Modo de trabajo:** MOCK Development - Listo para integración real
