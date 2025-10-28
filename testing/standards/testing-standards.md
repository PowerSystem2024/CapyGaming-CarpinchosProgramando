# Testing Standards - CapyGaming

## Metodología de Testing

### Niveles de Testing

#### 1. Testing Manual (curl)

- **Propósito:** Exploración inicial y validación rápida
- **Cuándo usar:** Primera vez testeando un endpoint nuevo
- **Herramientas:** curl, ThunderClient
- **Documentar:** Comandos y resultados en `/documentation`

#### 2. Scripts Automatizados (Node.js + axios)

- **Propósito:** Testing repetible y consistente
- **Cuándo usar:** Para regression testing y CI/CD
- **Herramientas:** Node.js, axios, scripts personalizados
- **Ubicación:** `/testing/scripts`

---

## Estructura de Scripts de Testing

### Template Básico

```javascript
import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

class APITester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  log(message, type = 'info') {
    const icons = { info: '📋', success: '✅', error: '❌', test: '🧪' };
    console.log(`${icons[type]} ${message}`);
  }

  addResult(test, status, details = {}) {
    this.results.push({ test, status, ...details });
    if (status === 'PASS') this.passed++;
    else this.failed++;
  }

  async testEndpoint() {
    this.log('\\n--- Test: Description ---', 'test');
    try {
      const response = await axios.get(`${BASE_URL}/endpoint`);
      this.log(`Status: ${response.status}`, 'success');
      this.addResult('Test name', 'PASS', { /* details */ });
    } catch (error) {
      this.log(`Error: ${error.message}`, 'error');
      this.addResult('Test name', 'FAIL', { error: error.message });
    }
  }

  async runAllTests() {
    console.log('=== TESTING ===');
    await this.testEndpoint();
    this.printSummary();
  }

  printSummary() {
    console.log('\\n=== RESUMEN ===');
    this.results.forEach(r => {
      const icon = r.status === 'PASS' ? '✅' : '❌';
      console.log(`${icon} ${r.test}`);
    });
    console.log(`\\nPassed: ${this.passed} | Failed: ${this.failed}`);
  }
}

const tester = new APITester();
tester.runAllTests().catch(console.error);
```

---

## Casos de Prueba Estándar

### Para Cada Endpoint

#### 1. Happy Path

- ✅ Request válido con todos los campos requeridos
- ✅ Verificar status code correcto (200, 201, etc.)
- ✅ Validar estructura de respuesta
- ✅ Verificar datos devueltos

#### 2. Error Cases

- ❌ Request sin campos requeridos
- ❌ Campos con formato incorrecto
- ❌ IDs inexistentes (404)
- ❌ Parámetros faltantes (400)
- ❌ Autenticación faltante/inválida (401)

#### 3. Edge Cases

- 🔍 Valores límite (strings vacíos, números negativos)
- 🔍 Caracteres especiales
- 🔍 Búsquedas sin resultados
- 🔍 Duplicados

---

## Validaciones Obligatorias

### Toda Response debe validar:

1. ✅ **Status Code:** Correcto para el caso
2. ✅ **Content-Type:** `application/json`
3. ✅ **Estructura:** Campos esperados presentes
4. ✅ **Tipos de Datos:** String, Number, Boolean correctos
5. ✅ **Valores:** Datos coherentes (no null inesperados)

### Endpoints con Auth deben validar:

1. ✅ **Sin token:** 401 Unauthorized
2. ✅ **Token inválido:** 401 Unauthorized
3. ✅ **Token expirado:** 401 Unauthorized
4. ✅ **Token válido:** 200/201 con datos correctos

---

## Nomenclatura de Tests

### Nombres Descriptivos

```javascript
// ❌ Mal
async testGet() { }

// ✅ Bien
async testGetAllProducts() { }
async testGetProductByIdReturns200() { }
async testGetProductByInvalidIdReturns404() { }
```

### Convención de Mensajes

```javascript
// Para logs
this.log('--- Test: GET All Products ---', 'test');

// Para resultados
this.addResult('GET /productos', 'PASS', { count: 88 });
this.addResult('Product ID 99999', 'PASS', { expectedError: true });
```

---

## Organización de Archivos

### Estructura

```
testing/
├── scripts/
│   ├── test-auth-endpoints.js
│   ├── test-products-endpoints.js
│   ├── test-orders-endpoints.js       (futuro)
│   └── test-mercadopago.js    
├── documentation/
│   ├── api-auth-documentation.md
│   ├── api-products-documentation.md
│   └── manual-testing-*.md
└── standards/
    ├── testing-standards.md
    └── security-testing.md
```

---

## Ejecución de Tests

### Scripts npm

```json
{
  "scripts": {
    "test:auth": "node test-auth-endpoints.js",
    "test:products": "node test-products-endpoints.js",
    "test:all": "node test-auth-endpoints.js && node test-products-endpoints.js"
  }
}
```

### Comandos

```bash
# Test individual
npm run test:auth
npm run test:products

# Todos los tests
npm run test:all

# Con detalle de errores
npm run test:auth 2>&1 | tee auth-results.log
```

---

## Documentación Requerida

### Para Cada API

1. ✅ **Endpoint documentation:** Markdown en `/documentation`
2. ✅ **Manual testing guide:** Comandos curl documentados
3. ✅ **Automated script:** Script en `/scripts`
4. ✅ **Test results:** Resumen de resultados

### Template de Documentación

```markdown
# API Documentation - [Nombre]

## Base URL
## Authentication
## Endpoints
  - URL
  - Método
  - Headers
  - Body/Params
  - Responses
  - Errores
  - Ejemplos
## Estructura de Datos
## Testing
## Ejemplos de Uso
```

---

## Criterios de Aceptación

### Un endpoint está "completo" cuando:

1. ✅ Funciona correctamente (happy path)
2. ✅ Maneja errores apropiadamente
3. ✅ Tiene tests automatizados
4. ✅ Está documentado
5. ✅ Pasa todos los tests (0 failed)

### Un sistema está "listo para deploy" cuando:

1. ✅ Todos los endpoints testeados
2. ✅ Tests de integración pasando
3. ✅ Documentación completa
4. ✅ Security testing realizado
5. ✅ Performance testing aceptable

---

## Buenas Prácticas

### Durante Testing

1. 🔄 **Tests repetibles:** Deben poder ejecutarse múltiples veces
2. 🔒 **Tests aislados:** No depender de estado previo
3. 📝 **Tests descriptivos:** Nombres claros y logs informativos
4. ⚡ **Tests rápidos:** Ejecutar en < 30 segundos
5. 🎯 **Tests específicos:** Un objetivo por test

### Durante Desarrollo

1. 📋 **Test primero:** Explorar con curl antes de automatizar
2. 🤖 **Automatizar después:** Convertir tests manuales en scripts
3. 📚 **Documentar siempre:** Actualizar docs con cada cambio
4. 🐛 **Tests para bugs:** Crear test para cada bug encontrado
5. 🔍 **Review de tests:** Code review incluye tests

---

## Herramientas

### Obligatorias

- **Node.js:** Runtime para scripts
- **axios:** HTTP client
- **curl:** Testing manual

## Checklist de Testing

### Antes de hacer Pull Request

- [X] Todos los tests pasan (0 failed)
- [ ] Nuevos endpoints tienen tests
- [X] Documentación actualizada
- [ ] Tests de regresión ejecutados
- [ ] Error cases cubiertos

### Después del Merge

- [ ] Verificar CI/CD pasa
- [ ] Tests en staging environment
- [ ] Monitoreo de errores activo
- [ ] Documentación deployada

---

## Métricas de Calidad

### Coverage Esperado

- **Endpoints públicos:** 100% testeados
- **Endpoints auth:** 100% testeados + security tests
- **Error cases:** Mínimo 80% cubiertos
- **Edge cases:** Mínimo 50% cubiertos

### Tiempo de Ejecución

- **Test suite completo:** < 1 minuto
- **Test individual:** < 5 segundos
- **CI/CD pipeline:** < 5 minutos

---

**Última actualización:** 2025-10-20
**Versión:** 1.0.0
**Mantenedor:** Mercedes Atim - Testing & Documentation
