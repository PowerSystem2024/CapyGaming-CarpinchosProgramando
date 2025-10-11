// Script de prueba para verificar la integración con MercadoPago
import fetch from 'node-fetch';

async function testMercadoPago() {
  console.log('🧪 Probando integración con MercadoPago...\n');

  const testData = {
    items: [
      {
        id_producto: 1,
        nombre: "Producto de prueba",
        quantity: 1,
        precio: 1000
      }
    ],
    payer: {
      name: "Test",
      surname: "User",
      email: "test@test.com",
      phone: {
        area_code: "11",
        number: "12345678"
      },
      address: {
        street_name: "Calle Falsa",
        street_number: 123,
        zip_code: "1234"
      }
    },
    orderId: 999
  };

  try {
    const response = await fetch('http://localhost:3001/api/mercadopago/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (result.success) {
      console.log('✅ Conexión exitosa con MercadoPago!\n');
      console.log('📋 Detalles de la preferencia:');
      console.log('   - ID de Preferencia:', result.preferenceId);
      console.log('   - URL de pago (producción):', result.initPoint);
      console.log('   - URL de pago (sandbox/pruebas):', result.sandboxInitPoint);
      console.log('\n🎯 Para probar el pago, abre esta URL en tu navegador:');
      console.log(`   ${result.sandboxInitPoint}\n`);
      console.log('💳 Usa estas tarjetas de prueba:');
      console.log('   - Número: 5031 7557 3453 0604');
      console.log('   - CVV: 123');
      console.log('   - Vencimiento: 11/25');
      console.log('   - Nombre: APRO (para aprobar)');
      console.log('   - DNI: 12345678');
    } else {
      console.log('❌ Error:', result.message);
      console.log('Detalles:', result.error);
    }
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('\n⚠️  Asegúrate de que el servidor esté ejecutándose en http://localhost:3001');
  }
}

testMercadoPago();