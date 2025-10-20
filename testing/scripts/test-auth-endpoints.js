import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

class AuthTester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
    this.token = null;
    this.testUser = {
      nombre: 'AutoTest',
      apellido: 'User',
      email: `autotest${Date.now()}@example.com`,
      telefono: '1234567890',
      dni: `${Math.floor(Math.random() * 90000000) + 10000000}`,
      password: 'test123456',
      direccion: 'Test Street 123'
    };
  }

  log(message, type = 'info') {
    const icons = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      test: '🧪',
      token: '🔑'
    };
    console.log(`${icons[type]} ${message}`);
  }

  addResult(test, status, details = {}) {
    this.results.push({ test, status, ...details });
    if (status === 'PASS') this.passed++;
    else this.failed++;
  }

  async testRegister() {
    this.log('\n--- Test: POST /auth/register ---', 'test');
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, this.testUser);

      this.log(`Status: ${response.status}`, 'success');
      this.log(`Usuario creado: ${response.data.user.nombre} ${response.data.user.apellido}`, 'info');
      this.log(`Email: ${response.data.user.email}`, 'info');

      // Guardar token para tests posteriores
      if (response.data.token) {
        this.token = response.data.token;
        this.log('Token JWT recibido', 'token');
      }

      // Validar estructura
      const hasRequiredFields = response.data.user &&
        response.data.user.dni &&
        response.data.user.email &&
        response.data.token;

      if (hasRequiredFields) {
        this.addResult('POST /auth/register', 'PASS', {
          user: response.data.user.email,
          hasToken: !!response.data.token
        });
      } else {
        this.addResult('POST /auth/register', 'FAIL', { error: 'Missing required fields' });
      }

      return response.data;
    } catch (error) {
      this.log(`Error: ${error.response?.status} - ${error.message}`, 'error');
      this.addResult('POST /auth/register', 'FAIL', { error: error.message });
    }
  }

  async testRegisterDuplicate() {
    this.log('\n--- Test: Register Duplicate User ---', 'test');
    try {
      await axios.post(`${BASE_URL}/auth/register`, this.testUser);

      this.log('Usuario duplicado: UNEXPECTED_PASS', 'error');
      this.addResult('Register duplicate', 'FAIL', { error: 'Should return 400' });
    } catch (error) {
      if (error.response?.status === 400) {
        this.log(`Usuario duplicado rechazado: ${error.response.status} - ✓`, 'success');
        this.log(`Mensaje: ${error.response.data.error}`, 'info');
        this.addResult('Register duplicate', 'PASS', {
          expectedError: true,
          status: 400,
          message: error.response.data.error
        });
      } else {
        this.log(`Error inesperado: ${error.response?.status}`, 'error');
        this.addResult('Register duplicate', 'FAIL', { error: 'Unexpected error' });
      }
    }
  }

  async testLogin() {
    this.log('\n--- Test: POST /auth/login ---', 'test');
    try {
      const credentials = {
        email: this.testUser.email,
        password: this.testUser.password
      };

      const response = await axios.post(`${BASE_URL}/auth/login`, credentials);

      this.log(`Status: ${response.status}`, 'success');
      this.log(`Login exitoso: ${response.data.user.nombre} ${response.data.user.apellido}`, 'info');

      // Actualizar token
      if (response.data.token) {
        this.token = response.data.token;
        this.log('Token JWT actualizado', 'token');
      }

      const hasRequiredFields = response.data.user &&
        response.data.user.email &&
        response.data.token;

      if (hasRequiredFields) {
        this.addResult('POST /auth/login', 'PASS', {
          user: response.data.user.email,
          hasToken: !!response.data.token
        });
      } else {
        this.addResult('POST /auth/login', 'FAIL', { error: 'Missing required fields' });
      }

      return response.data;
    } catch (error) {
      this.log(`Error: ${error.response?.status} - ${error.message}`, 'error');
      this.addResult('POST /auth/login', 'FAIL', { error: error.message });
    }
  }

  async testLoginWrongCredentials() {
    this.log('\n--- Test: Login with Wrong Credentials ---', 'test');
    try {
      const wrongCredentials = {
        email: 'noexiste@example.com',
        password: 'wrongpassword'
      };

      await axios.post(`${BASE_URL}/auth/login`, wrongCredentials);

      this.log('Login con credenciales incorrectas: UNEXPECTED_PASS', 'error');
      this.addResult('Login wrong credentials', 'FAIL', { error: 'Should return 401' });
    } catch (error) {
      if (error.response?.status === 401) {
        this.log(`Credenciales incorrectas rechazadas: ${error.response.status} - ✓`, 'success');
        this.addResult('Login wrong credentials', 'PASS', {
          expectedError: true,
          status: 401
        });
      } else {
        this.log(`Error inesperado: ${error.response?.status}`, 'error');
        this.addResult('Login wrong credentials', 'FAIL', { error: 'Unexpected error' });
      }
    }
  }

  async testGetProfile() {
    this.log('\n--- Test: GET /auth/profile (with token) ---', 'test');

    if (!this.token) {
      this.log('No hay token disponible, saltando test', 'warning');
      this.addResult('GET /auth/profile', 'SKIP', { error: 'No token available' });
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      this.log(`Status: ${response.status}`, 'success');
      this.log(`Perfil obtenido: ${response.data.user.nombre} ${response.data.user.apellido}`, 'info');
      this.log(`Email: ${response.data.user.email}`, 'info');

      const hasRequiredFields = response.data.user &&
        response.data.user.dni &&
        response.data.user.email;

      if (hasRequiredFields) {
        this.addResult('GET /auth/profile', 'PASS', {
          user: response.data.user.email
        });
      } else {
        this.addResult('GET /auth/profile', 'FAIL', { error: 'Missing required fields' });
      }

      return response.data;
    } catch (error) {
      this.log(`Error: ${error.response?.status} - ${error.message}`, 'error');
      this.addResult('GET /auth/profile', 'FAIL', { error: error.message });
    }
  }

  async testGetProfileWithoutToken() {
    this.log('\n--- Test: GET /auth/profile (without token) ---', 'test');
    try {
      await axios.get(`${BASE_URL}/auth/profile`);

      this.log('Acceso sin token: UNEXPECTED_PASS', 'error');
      this.addResult('Profile without token', 'FAIL', { error: 'Should return 401' });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.log(`Acceso sin token bloqueado: ${error.response.status} - ✓`, 'success');
        this.log(`Mensaje: ${error.response.data.error}`, 'info');
        this.addResult('Profile without token', 'PASS', {
          expectedError: true,
          status: error.response.status
        });
      } else {
        this.log(`Error inesperado: ${error.response?.status}`, 'error');
        this.addResult('Profile without token', 'FAIL', { error: 'Unexpected error' });
      }
    }
  }

  async testGetProfileWithInvalidToken() {
    this.log('\n--- Test: GET /auth/profile (with invalid token) ---', 'test');
    try {
      await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': 'Bearer invalid_token_12345'
        }
      });

      this.log('Acceso con token inválido: UNEXPECTED_PASS', 'error');
      this.addResult('Profile invalid token', 'FAIL', { error: 'Should return 401' });
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        this.log(`Token inválido rechazado: ${error.response.status} - ✓`, 'success');
        this.addResult('Profile invalid token', 'PASS', {
          expectedError: true,
          status: error.response.status
        });
      } else {
        this.log(`Error inesperado: ${error.response?.status}`, 'error');
        this.addResult('Profile invalid token', 'FAIL', { error: 'Unexpected error' });
      }
    }
  }

  async testForgotPassword() {
    this.log('\n--- Test: POST /auth/forgot-password ---', 'test');
    try {
      const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
        email: this.testUser.email
      });

      this.log(`Status: ${response.status}`, 'success');
      this.log(`Mensaje: ${response.data.message}`, 'info');

      if (response.data.message) {
        this.addResult('POST /auth/forgot-password', 'PASS', {
          message: response.data.message
        });
      } else {
        this.addResult('POST /auth/forgot-password', 'FAIL', { error: 'No message' });
      }
    } catch (error) {
      this.log(`Error: ${error.response?.status} - ${error.message}`, 'error');
      this.addResult('POST /auth/forgot-password', 'FAIL', { error: error.message });
    }
  }

  async runAllTests() {
    console.log('\n========================================');
    console.log('       TESTING AUTH API - CapyGaming');
    console.log('========================================');

    // Flujo completo de autenticación
    await this.testRegister();
    await this.testRegisterDuplicate();
    await this.testLogin();
    await this.testLoginWrongCredentials();
    await this.testGetProfile();
    await this.testGetProfileWithoutToken();
    await this.testGetProfileWithInvalidToken();
    await this.testForgotPassword();

    this.printSummary();
  }

  printSummary() {
    console.log('\n========================================');
    console.log('             RESUMEN DE TESTS');
    console.log('========================================');

    this.results.forEach(result => {
      let status = '❓';
      if (result.status === 'PASS') status = '✅';
      else if (result.status === 'FAIL') status = '❌';
      else if (result.status === 'SKIP') status = '⏭️';

      console.log(`${status} ${result.test}`);
    });

    console.log(`\n📊 Total: ${this.results.length} tests`);
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);

    if (this.failed === 0) {
      console.log('\n🎉 ¡Todos los tests pasaron exitosamente!');
    } else {
      console.log(`\n⚠️  ${this.failed} test(s) fallaron`);
    }

    console.log('========================================\n');

    console.log('📋 Datos de prueba generados:');
    console.log(`   Email: ${this.testUser.email}`);
    console.log(`   DNI: ${this.testUser.dni}`);
    console.log(`   Password: ${this.testUser.password}`);
  }
}

// Ejecutar tests
const tester = new AuthTester();
tester.runAllTests().catch(console.error);
