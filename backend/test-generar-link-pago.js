import fetch from 'node-fetch';

async function generarLinkPago() {
  console.log('🛒 Generando link de pago de MercadoPago...\n');

  // Paso 1: Crear el pedido
  const orderData = {
    usuario: {
      dni: '12345678',
      nombre: 'Test',
      apellido: 'Usuario',
      email: 'test@capygaming.com'
    },
    items: [
      {
        id_producto: 1,
        nombre: 'Mouse Gamer RGB',
        precio: 15000,
        quantity: 1,
        descripcion: 'Mouse gaming con luces RGB'
      },
      {
        id_producto: 2,
        nombre: 'Teclado Mecánico',
        precio: 25000,
        quantity: 1,
        descripcion: 'Teclado mecánico switches blue'
      }
    ],
    datosEnvio: {
      direccion: 'Av. Siempre Viva 742',
      ciudad: 'Buenos Aires',
      codigoPostal: '1234',
      provincia: 'Buenos Aires',
      telefono: '1122334455',
      metodoEnvio: 'standard'
    },
    metodoPago: 'mercadopago',
    montoTotal: 40000,
    costoEnvio: 5000
  };

  try {
    // Crear el pedido
    console.log('📦 Creando pedido...');
    const orderResponse = await fetch('http://localhost:3001/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const orderResult = await orderResponse.json();

    if (!orderResult.success) {
      console.error('❌ Error al crear pedido:', orderResult.message);
      return;
    }

    console.log('✅ Pedido creado con ID:', orderResult.idPedido);

    // Paso 2: Crear preferencia de MercadoPago
    console.log('\n💳 Generando preferencia de pago...');

    const mpData = {
      items: orderData.items,  // Enviar los items tal como están, el backend los procesará
      payer: {
        name: orderData.usuario.nombre,
        surname: orderData.usuario.apellido,
        email: orderData.usuario.email,
        phone: {
          area_code: '11',
          number: '22334455'
        },
        address: {
          street_name: orderData.datosEnvio.direccion,
          street_number: 123,
          zip_code: orderData.datosEnvio.codigoPostal
        }
      },
      orderId: orderResult.idPedido,
      back_urls: {
        success: 'http://localhost:5173/payment-success',
        failure: 'http://localhost:5173/payment-failure',
        pending: 'http://localhost:5173/payment-pending'
      },
      auto_return: 'approved',
      statement_descriptor: 'CAPYGAMING',
      external_reference: `ORDER_${orderResult.idPedido}`
    };

    const mpResponse = await fetch('http://localhost:3001/api/mercadopago/create-preference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mpData)
    });

    const mpResult = await mpResponse.json();

    if (mpResult.success) {
      console.log('\n✅ ¡Preferencia de pago creada exitosamente!');
      console.log('\n🔗 Links de pago generados:');
      console.log('━'.repeat(50));

      if (mpResult.initPoint) {
        console.log('\n📱 LINK DE PRODUCCIÓN (Pago Real):');
        console.log(`   ${mpResult.initPoint}`);
      }

      if (mpResult.sandboxInitPoint) {
        console.log('\n🧪 LINK DE PRUEBA (Sandbox):');
        console.log(`   ${mpResult.sandboxInitPoint}`);
      }

      console.log('\n━'.repeat(50));
      console.log('\n📌 INFORMACIÓN DEL PEDIDO:');
      console.log(`   • ID del Pedido: ${orderResult.idPedido}`);
      console.log(`   • Total a pagar: $${(orderData.montoTotal).toLocaleString('es-AR')}`);
      console.log(`   • Productos: ${orderData.items.length} items`);

      console.log('\n💡 INSTRUCCIONES:');
      console.log('   1. Copia el link de arriba');
      console.log('   2. Pégalo en tu navegador');
      console.log('   3. Serás redirigido a MercadoPago');
      console.log('   4. Podrás ver el checkout con los productos');
      console.log('   5. NO completes el pago si es solo una prueba');

      if (mpResult.sandboxInitPoint) {
        console.log('\n🧪 Para pruebas en sandbox:');
        console.log('   • Usa tarjetas de prueba de MercadoPago');
        console.log('   • No se realizarán cobros reales');
      }

    } else {
      console.error('\n❌ Error al crear preferencia:', mpResult.message);
      console.error('Detalles:', mpResult.error);
    }

  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.error('Asegúrate de que el servidor backend esté corriendo en http://localhost:3001');
  }
}

// Ejecutar
generarLinkPago();