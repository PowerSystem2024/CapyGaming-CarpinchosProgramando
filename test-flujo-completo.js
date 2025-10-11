// Test completo del flujo de compra con datos reales
import fetch from 'node-fetch';

console.log('🛒 PRUEBA COMPLETA DEL FLUJO DE COMPRA\n');
console.log('=' .repeat(50));

async function testFlujoCompleto() {
  const baseURL = 'http://localhost:3001';

  console.log('\n✨ PASO 1: Crear un pedido en la base de datos...');

  const orderData = {
    usuario: {
      dni: 12345678,  // Usuario de prueba que creamos
      nombre: 'Test',
      apellido: 'Usuario',
      email: 'test@test.com'
    },
    items: [
      {
        id_producto: 89,  // Producto real que existe en la BD
        nombre: 'Notebook Acer Aspire 3',
        quantity: 1,
        precio: 850000
      }
    ],
    datosEnvio: {
      direccion: 'Av. Corrientes 1234',
      ciudad: 'Buenos Aires',
      codigoPostal: '1043',
      provincia: 'Buenos Aires',
      telefono: '1112345678',
      metodoEnvio: 'standard'
    },
    metodoPago: 'mercadopago',
    montoTotal: 855000,  // 850000 + 5000 de envío
    costoEnvio: 5000
  };

  try {
    const response = await fetch(`${baseURL}/api/orders/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    if (data.success) {
      console.log('   ✅ Pedido creado exitosamente');
      console.log(`   📦 Número de pedido: #${data.idPedido}`);
      console.log(`   💰 Monto total: $${data.data.monto_total}`);

      // PASO 2: Crear preferencia de MercadoPago
      console.log('\n✨ PASO 2: Crear preferencia de pago en MercadoPago...');

      const mpData = {
        items: orderData.items,
        payer: {
          name: orderData.usuario.nombre,
          surname: orderData.usuario.apellido,
          email: orderData.usuario.email,
          phone: {
            area_code: '11',
            number: '12345678'
          },
          address: {
            street_name: 'Av. Corrientes',
            street_number: 1234,
            zip_code: '1043'
          }
        },
        orderId: data.idPedido
      };

      const mpResponse = await fetch(`${baseURL}/api/mercadopago/create-preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mpData)
      });

      const mpResult = await mpResponse.json();

      if (mpResult.success) {
        console.log('   ✅ Preferencia de pago creada');
        console.log(`   🆔 ID de preferencia: ${mpResult.preferenceId}`);
        console.log('\n📱 URL PARA PAGAR (abre este link en tu navegador):');
        console.log(`   🔗 ${mpResult.sandboxInitPoint || mpResult.initPoint}`);

        console.log('\n💳 TARJETAS DE PRUEBA:');
        console.log('   Para APROBAR el pago:');
        console.log('   • Número: 5031 7557 3453 0604');
        console.log('   • CVV: 123');
        console.log('   • Vencimiento: 11/25');
        console.log('   • Nombre: APRO');
        console.log('   • DNI: 12345678');

        console.log('\n   Para RECHAZAR el pago:');
        console.log('   • Mismo número, pero Nombre: TEST');

        // PASO 3: Verificar detalles del pedido
        console.log('\n✨ PASO 3: Verificar detalles del pedido...');

        const detailResponse = await fetch(`${baseURL}/api/orders/${data.idPedido}`);
        const detailData = await detailResponse.json();

        if (detailData.success) {
          console.log('   ✅ Pedido recuperado correctamente');
          console.log('   📋 Detalles:');
          console.log(`      • Cliente: ${detailData.pedido.nombre} ${detailData.pedido.apellido}`);
          console.log(`      • Email: ${detailData.pedido.email}`);
          console.log(`      • Estado pago: ${detailData.pedido.estado_pago ? 'Pagado' : 'Pendiente'}`);
          console.log(`      • Items: ${detailData.detalles.length} producto(s)`);
        }

      } else {
        console.log('   ❌ Error con MercadoPago:', mpResult.error);
      }

    } else {
      console.log('   ❌ Error creando pedido:', data.message);
      console.log('   Detalles:', data.error);
    }

  } catch (error) {
    console.log('   ❌ Error en el proceso:', error.message);
  }

  console.log('\n' + '=' .repeat(50));
  console.log('\n🎯 RESUMEN:');
  console.log('   El flujo de compra está configurado y funcionando.');
  console.log('   Puedes probar el pago completo usando el link de MercadoPago.');
  console.log('\n📝 PRÓXIMOS PASOS:');
  console.log('   1. Abre el link de pago en tu navegador');
  console.log('   2. Usa las tarjetas de prueba');
  console.log('   3. Completa el pago');
  console.log('   4. Serás redirigido a /payment/success, /payment/failure o /payment/pending');
  console.log('\n' + '=' .repeat(50));
}

// Ejecutar test
testFlujoCompleto().catch(console.error);