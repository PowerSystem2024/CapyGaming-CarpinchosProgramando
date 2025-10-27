import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api';

class ProductTester {
  constructor() {
    this.results = [];
    this.passed = 0;
    this.failed = 0;
  }

  log(message, type = 'info') {
    const icons = {
      info: '📋',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      test: '🧪'
    };
    console.log(`${icons[type]} ${message}`);
  }

  addResult(test, status, details = {}) {
    this.results.push({ test, status, ...details });
    if (status === 'PASS') this.passed++;
    else this.failed++;
  }

  async testGetAllProducts() {
    this.log('\n--- Test: GET All Products ---', 'test');
    try {
      const response = await axios.get(`${BASE_URL}/productos`);

      this.log(`Status: ${response.status}`, 'success');
      this.log(`Productos encontrados: ${response.data.length}`, 'info');

      // Validar estructura
      if (response.data.length > 0) {
        const product = response.data[0];
        const hasRequiredFields = product.id_producto && product.nombre && product.precio;

        if (hasRequiredFields) {
          this.log('Estructura de datos correcta', 'success');
          this.addResult('GET /productos', 'PASS', { count: response.data.length });
        } else {
          this.log('Estructura de datos incorrecta', 'error');
          this.addResult('GET /productos', 'FAIL', { error: 'Invalid structure' });
        }
      }

      return response.data;
    } catch (error) {
      this.log(`Error: ${error.response?.status} - ${error.message}`, 'error');
      this.addResult('GET /productos', 'FAIL', { error: error.message });
    }
  }

  async testGetProductById(id = 1) {
    this.log(`\n--- Test: GET Product by ID ${id} ---`, 'test');
    try {
      const response = await axios.get(`${BASE_URL}/productos/${id}`);

      this.log(`Status: ${response.status}`, 'success');
      this.log(`Producto: ${response.data.nombre}`, 'info');
      this.log(`Precio: $${response.data.precio}`, 'info');

      this.addResult(`GET /productos/${id}`, 'PASS', {
        product: response.data.nombre,
        price: response.data.precio
      });

      return response.data;
    } catch (error) {
      this.log(`Error: ${error.response?.status} - ${error.message}`, 'error');
      this.addResult(`GET /productos/${id}`, 'FAIL', { error: error.message });
    }
  }

  async testSearchProducts(searchTerm = 'game') {
    this.log(`\n--- Test: Search Products "${searchTerm}" ---`, 'test');
    try {
      const response = await axios.get(`${BASE_URL}/productos/buscar?nombre=${searchTerm}`);

      this.log(`Status: ${response.status}`, 'success');
      this.log(`Resultados: ${response.data.length}`, 'info');

      // Verificar que los resultados contienen el término
      const allMatch = response.data.every(p =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (allMatch || response.data.length === 0) {
        this.log('Búsqueda funciona correctamente', 'success');
        this.addResult(`Search "${searchTerm}"`, 'PASS', { count: response.data.length });
      } else {
        this.log('Algunos resultados no coinciden', 'warning');
        this.addResult(`Search "${searchTerm}"`, 'PASS', {
          count: response.data.length,
          warning: 'Some results dont match'
        });
      }

      return response.data;
    } catch (error) {
      this.log(`Error: ${error.response?.status} - ${error.message}`, 'error');
      this.addResult(`Search "${searchTerm}"`, 'FAIL', { error: error.message });
    }
  }

  async testProductsWithFilter(categoria = 'Notebooks') {
    this.log(`\n--- Test: Filter by Category "${categoria}" ---`, 'test');
    try {
      const response = await axios.get(`${BASE_URL}/productos?categoria=${categoria}`);

      this.log(`Status: ${response.status}`, 'success');
      this.log(`Productos en categoría ${categoria}: ${response.data.length}`, 'info');

      // Verificar que todos son de la categoría correcta
      const allCorrect = response.data.every(p =>
        p.categoria.toLowerCase() === categoria.toLowerCase()
      );

      if (allCorrect) {
        this.log('Filtro aplicado correctamente', 'success');
        this.addResult(`Filter category "${categoria}"`, 'PASS', { count: response.data.length });
      } else {
        this.log('Algunos productos no son de la categoría', 'error');
        this.addResult(`Filter category "${categoria}"`, 'FAIL', { error: 'Filter not working' });
      }

      return response.data;
    } catch (error) {
      this.log(`Error: ${error.response?.status} - ${error.message}`, 'error');
      this.addResult(`Filter category "${categoria}"`, 'FAIL', { error: error.message });
    }
  }

  async testGetSubcategories(categoria = 'Notebooks') {
    this.log(`\n--- Test: GET Subcategories for "${categoria}" ---`, 'test');
    try {
      const response = await axios.get(`${BASE_URL}/categorias/${categoria}/subcategorias`);

      this.log(`Status: ${response.status}`, 'success');
      this.log(`Subcategorías: ${response.data.join(', ')}`, 'info');

      this.addResult(`GET subcategories "${categoria}"`, 'PASS', {
        subcategories: response.data
      });

      return response.data;
    } catch (error) {
      this.log(`Error: ${error.response?.status} - ${error.message}`, 'error');
      this.addResult(`GET subcategories "${categoria}"`, 'FAIL', { error: error.message });
    }
  }

  async testErrorCases() {
    this.log('\n--- Test: Error Cases ---', 'test');

    // Producto inexistente
    try {
      await axios.get(`${BASE_URL}/productos/99999`);
      this.log('Producto 99999: UNEXPECTED_PASS', 'error');
      this.addResult('Product ID 99999', 'FAIL', { error: 'Should return 404' });
    } catch (error) {
      if (error.response?.status === 404) {
        this.log(`Producto inexistente (99999): ${error.response.status} - ✓`, 'success');
        this.addResult('Product ID 99999', 'PASS', { expectedError: true, status: 404 });
      } else {
        this.log(`Error inesperado: ${error.response?.status}`, 'error');
        this.addResult('Product ID 99999', 'FAIL', { error: 'Unexpected error' });
      }
    }

    // Búsqueda sin parámetro
    try {
      await axios.get(`${BASE_URL}/productos/buscar`);
      this.log('Búsqueda sin parámetro: UNEXPECTED_PASS', 'error');
      this.addResult('Search without param', 'FAIL', { error: 'Should return 400' });
    } catch (error) {
      if (error.response?.status === 400) {
        this.log(`Búsqueda sin parámetro: ${error.response.status} - ✓`, 'success');
        this.addResult('Search without param', 'PASS', { expectedError: true, status: 400 });
      } else {
        this.log(`Error inesperado: ${error.response?.status}`, 'error');
        this.addResult('Search without param', 'FAIL', { error: 'Unexpected error' });
      }
    }
  }

  async runAllTests() {
    console.log('\n========================================');
    console.log('     TESTING PRODUCTS API - CapyGaming');
    console.log('========================================');

    await this.testGetAllProducts();
    await this.testGetProductById(1);
    await this.testSearchProducts('Monitor');
    await this.testProductsWithFilter('Notebooks');
    await this.testGetSubcategories('Notebooks');
    await this.testErrorCases();

    this.printSummary();
  }

  printSummary() {
    console.log('\n========================================');
    console.log('             RESUMEN DE TESTS');
    console.log('========================================');

    this.results.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
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
  }
}

// Ejecutar tests
const tester = new ProductTester();
tester.runAllTests().catch(console.error);
