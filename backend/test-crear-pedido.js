import fetch from 'node-fetch';

async function testCrearPedido() {
  console.log('🧪 Probando creación de pedido...\n');

  const orderData = {
    usuario: {
      dni: '12345678', // Usuario de prueba que existe en la BD
      nombre: 'Test',
      apellido: 'Usuario',
      email: 'test@capygaming.com'
    },
    items: [
      {
        id_producto: 1,
        nombre: 'Producto de Prueba',
        precio: 1000,
        quantity: 2
      }
    ],
    datosEnvio: {
      direccion: 'Calle Falsa 123',
      ciudad: 'Buenos Aires',
      codigoPostal: '1234',
      provincia: 'Buenos Aires',
      telefono: '1122334455',
      metodoEnvio: 'standard'
    },
    metodoPago: 'mercadopago',
    montoTotal: 2000,
    costoEnvio: 500
  };

  try {
    console.log('📤 Enviando datos:', JSON.stringify(orderData, null, 2));

    const response = await fetch('http://localhost:3001/api/orders/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('\n✅ Pedido creado exitosamente!');
      console.log('📦 Respuesta:', JSON.stringify(result, null, 2));
    } else {
      console.log('\n❌ Error al crear pedido:');
      console.log('Status:', response.status);
      console.log('Respuesta:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('\n❌ Error de conexión:', error.message);
    console.error('Asegúrate de que el servidor backend esté corriendo en http://localhost:3001');
  }
}

// Ejecutar el test
testCrearPedido();