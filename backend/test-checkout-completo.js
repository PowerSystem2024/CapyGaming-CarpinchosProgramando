import fetch from 'node-fetch';

async function testCheckoutCompleto() {
  console.log('🎮 CAPYGAMING - Test de Checkout Completo\n');
  console.log('═'.repeat(50));

  // Simulando items del carrito tal como los envía el frontend
  const cartItems = [
    {
      id_producto: 1,
      nombre: 'PlayStation 5',
      descripcion: 'Consola de última generación',
      precio: 350000,
      quantity: 1,
      imagen: 'ps5.jpg',
      categoria: 'Consolas'
    },
    {
      id_producto: 2,
      nombre: 'FIFA 24',
      descripcion: 'El mejor juego de fútbol',
      precio: 45000,
      quantity: 2,
      imagen: 'fifa24.jpg',
      categoria: 'Juegos'
    },
    {
      id_producto: 3,
      nombre: 'Control DualSense',
      descripcion: 'Control inalámbrico PS5',
      precio: 65000,
      quantity: 1,
      imagen: 'dualsense.jpg',
      categoria: 'Accesorios'
    }
  ];

  const totalCarrito = cartItems.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  const costoEnvio = 5000;
  const montoTotal = totalCarrito + costoEnvio;

  console.log('\n📦 PRODUCTOS EN EL CARRITO:');
  console.log('─'.repeat(50));
  cartItems.forEach(item => {
    console.log(`  • ${item.nombre}`);
    console.log(`    Precio: $${item.precio.toLocaleString('es-AR')} x ${item.quantity} = $${(item.precio * item.quantity).toLocaleString('es-AR')}`);
  });
  console.log('─'.repeat(50));
  console.log(`  Subtotal: $${totalCarrito.toLocaleString('es-AR')}`);
  console.log(`  Envío: $${costoEnvio.toLocaleString('es-AR')}`);
  console.log(`  TOTAL: $${montoTotal.toLocaleString('es-AR')}`);

  // Paso 1: Crear el pedido
  const orderData = {
    usuario: {
      dni: '12345678',
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@gmail.com'
    },
    items: cartItems,
    datosEnvio: {
      direccion: 'Av. Corrientes 1234',
      ciudad: 'Buenos Aires',
      codigoPostal: '1043',
      provincia: 'Buenos Aires',
      telefono: '1144556677',
      metodoEnvio: 'standard'
    },
    metodoPago: 'mercadopago',
    montoTotal: montoTotal,
    costoEnvio: costoEnvio
  };

  try {
    console.log('\n1️⃣ CREANDO PEDIDO EN LA BASE DE DATOS...');

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

    console.log('✅ Pedido creado - ID:', orderResult.idPedido);

    // Paso 2: Crear preferencia de MercadoPago
    console.log('\n2️⃣ GENERANDO LINK DE PAGO DE MERCADOPAGO...');

    const mpData = {
      items: cartItems,
      payer: {
        name: orderData.usuario.nombre,
        surname: orderData.usuario.apellido,
        email: orderData.usuario.email,
        phone: {
          area_code: '11',
          number: orderData.datosEnvio.telefono?.replace(/\D/g, '') || '44556677'
        },
        address: {
          street_name: orderData.datosEnvio.direccion,
          street_number: 1234,
          zip_code: orderData.datosEnvio.codigoPostal
        }
      },
      orderId: orderResult.idPedido
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
      console.log('✅ Preferencia creada exitosamente');

      console.log('\n');
      console.log('╔══════════════════════════════════════════════════╗');
      console.log('║           🛒 CHECKOUT LISTO PARA PAGAR           ║');
      console.log('╚══════════════════════════════════════════════════╝');

      console.log('\n📱 PRODUCTOS QUE VERÁS EN MERCADOPAGO:');
      console.log('─'.repeat(50));
      cartItems.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.nombre}`);
        console.log(`     Cantidad: ${item.quantity}`);
        console.log(`     Precio unitario: $${item.precio.toLocaleString('es-AR')}`);
        console.log(`     Subtotal: $${(item.precio * item.quantity).toLocaleString('es-AR')}`);
        if (index < cartItems.length - 1) console.log('');
      });
      console.log('─'.repeat(50));
      console.log(`\n💰 TOTAL A PAGAR: $${montoTotal.toLocaleString('es-AR')}`);

      console.log('\n🔗 LINKS DE PAGO:');
      console.log('═'.repeat(50));

      if (mpResult.sandboxInitPoint) {
        console.log('\n🧪 LINK DE PRUEBA (Sandbox):');
        console.log(`${mpResult.sandboxInitPoint}`);
        console.log('\n   Usa este link para hacer pruebas sin cobros reales');
        console.log('   Tarjeta de prueba Mastercard: 5031 7557 3453 0604');
        console.log('   CVV: 123, Vencimiento: 11/25');
      }

      if (mpResult.initPoint) {
        console.log('\n💳 LINK DE PRODUCCIÓN:');
        console.log(`${mpResult.initPoint}`);
        console.log('\n   ⚠️ Este link procesará pagos REALES');
      }

      console.log('\n═'.repeat(50));
      console.log('\n📌 Copia el link de arriba y pégalo en tu navegador');
      console.log('   Deberías ver TODOS los productos listados con sus nombres');

    } else {
      console.error('\n❌ Error al crear preferencia:', mpResult.message);
      if (mpResult.error) {
        console.error('Detalles:', mpResult.error);
      }
    }

  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.error('Asegúrate de que el servidor backend esté corriendo en http://localhost:3001');
  }
}

// Ejecutar
testCheckoutCompleto();