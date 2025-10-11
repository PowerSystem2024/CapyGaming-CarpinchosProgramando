// Script de verificación del flujo de compra
import fetch from 'node-fetch';

console.log('🔍 VERIFICACIÓN DEL FLUJO DE COMPRA DE CAPYGAMING\n');
console.log('=' .repeat(50));

async function verificarFlujo() {
  const baseURL = 'http://localhost:3001';
  let todoOk = true;

  // 1. Verificar servidor
  console.log('\n📌 1. VERIFICANDO SERVIDOR...');
  try {
    const health = await fetch(`${baseURL}/api/health`);
    const healthData = await health.json();
    console.log('   ✅ Servidor funcionando:', healthData.message);
  } catch (error) {
    console.log('   ❌ Error: Servidor no responde');
    todoOk = false;
  }

  // 2. Verificar API de pedidos
  console.log('\n📌 2. VERIFICANDO API DE PEDIDOS...');
  const testOrder = {
    usuario: {
      dni: 12345678,
      nombre: 'Test',
      apellido: 'Usuario',
      email: 'test@test.com'
    },
    items: [
      {
        id_producto: 1,
        nombre: 'Producto Test',
        quantity: 2,
        precio: 500
      }
    ],
    datosEnvio: {
      direccion: 'Calle Falsa 123',
      ciudad: 'Buenos Aires',
      codigoPostal: '1234',
      provincia: 'Buenos Aires',
      telefono: '1112345678',
      metodoEnvio: 'standard'
    },
    metodoPago: 'efectivo',
    montoTotal: 1000,
    costoEnvio: 500
  };

  try {
    const response = await fetch(`${baseURL}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testOrder)
    });

    const data = await response.json();

    if (data.success) {
      console.log('   ✅ API de creación de pedidos funcionando');
      console.log(`   📦 Pedido de prueba creado: #${data.idPedido}`);

      // Verificar detalles del pedido
      const detailResponse = await fetch(`${baseURL}/api/orders/${data.idPedido}`);
      const detailData = await detailResponse.json();

      if (detailData.success) {
        console.log('   ✅ API de consulta de pedidos funcionando');
      } else {
        console.log('   ⚠️  API de consulta con problemas');
        todoOk = false;
      }
    } else {
      console.log('   ❌ Error creando pedido:', data.message);
      todoOk = false;
    }
  } catch (error) {
    console.log('   ❌ Error en API de pedidos:', error.message);
    todoOk = false;
  }

  // 3. Verificar integración con MercadoPago
  console.log('\n📌 3. VERIFICANDO INTEGRACIÓN CON MERCADOPAGO...');
  const mpTest = {
    items: [{
      id_producto: 1,
      nombre: 'Test Product',
      quantity: 1,
      precio: 100
    }],
    payer: {
      name: 'Test',
      surname: 'User',
      email: 'test@test.com',
      phone: { area_code: '11', number: '12345678' },
      address: { street_name: 'Test St', street_number: 123, zip_code: '1234' }
    },
    orderId: 999
  };

  try {
    const mpResponse = await fetch(`${baseURL}/api/mercadopago/create-preference`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mpTest)
    });

    const mpData = await mpResponse.json();

    if (mpData.success) {
      console.log('   ✅ MercadoPago configurado correctamente');
      console.log('   🔗 URL de pago sandbox disponible');
      console.log(`   📝 ID de preferencia: ${mpData.preferenceId}`);
    } else {
      console.log('   ⚠️  MercadoPago con problemas:', mpData.error);
      if (mpData.error?.includes('invalid_token')) {
        console.log('   ℹ️  Necesitas configurar un Access Token válido en .env');
      }
      todoOk = false;
    }
  } catch (error) {
    console.log('   ❌ Error con MercadoPago:', error.message);
    todoOk = false;
  }

  // 4. Verificar páginas del frontend
  console.log('\n📌 4. VERIFICANDO COMPONENTES DEL FRONTEND...');
  const frontendFiles = [
    'frontend/src/components/CheckoutForm.vue',
    'frontend/src/views/OrderConfirmation.vue',
    'frontend/src/views/PaymentSuccess.vue',
    'frontend/src/views/PaymentFailure.vue',
    'frontend/src/views/PaymentPending.vue'
  ];

  const fs = await import('fs');
  let todosArchivos = true;

  for (const file of frontendFiles) {
    const exists = fs.existsSync(file);
    const fileName = file.split('/').pop();
    if (exists) {
      console.log(`   ✅ ${fileName}`);
    } else {
      console.log(`   ❌ ${fileName} no encontrado`);
      todosArchivos = false;
      todoOk = false;
    }
  }

  // 5. Verificar rutas en Vue Router
  console.log('\n📌 5. VERIFICANDO RUTAS DEL FRONTEND...');
  try {
    const routerContent = fs.readFileSync('frontend/src/router/index.js', 'utf8');
    const rutas = [
      '/order-confirmation/:id',
      '/payment/success',
      '/payment/failure',
      '/payment/pending'
    ];

    let todasLasRutas = true;
    for (const ruta of rutas) {
      if (routerContent.includes(ruta)) {
        console.log(`   ✅ Ruta ${ruta} configurada`);
      } else {
        console.log(`   ❌ Ruta ${ruta} no encontrada`);
        todasLasRutas = false;
        todoOk = false;
      }
    }
  } catch (error) {
    console.log('   ❌ Error verificando rutas:', error.message);
    todoOk = false;
  }

  // Resumen final
  console.log('\n' + '=' .repeat(50));
  console.log('📊 RESUMEN DE LA VERIFICACIÓN:\n');

  if (todoOk) {
    console.log('✅ ¡TODO ESTÁ FUNCIONANDO CORRECTAMENTE!');
    console.log('\n🎉 El flujo de compra está completamente implementado y funcional.');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Configurar un Access Token válido de MercadoPago (si aún no lo hiciste)');
    console.log('   2. Iniciar el frontend: cd frontend && npm run dev');
    console.log('   3. Probar el flujo completo desde el navegador');
  } else {
    console.log('⚠️  HAY ALGUNOS PROBLEMAS QUE RESOLVER:');
    console.log('\n   Revisa los errores marcados arriba y:');
    console.log('   - Verifica que PostgreSQL esté funcionando');
    console.log('   - Asegúrate de tener todas las dependencias instaladas');
    console.log('   - Configura el Access Token de MercadoPago en backend/.env');
  }

  console.log('\n' + '=' .repeat(50));
}

// Ejecutar verificación
verificarFlujo().catch(console.error);