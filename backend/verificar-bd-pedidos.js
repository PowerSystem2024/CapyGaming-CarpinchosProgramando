import pool from './bd/pool.js';

async function verificarBaseDatos() {
  console.log('🔍 Verificando configuración de base de datos...\n');

  try {
    // 1. Verificar conexión
    const connectionTest = await pool.query('SELECT NOW()');
    console.log('✅ Conexión establecida:', connectionTest.rows[0].now);

    // 2. Verificar tabla usuario
    const usuarioExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'usuario'
      );
    `);

    if (usuarioExists.rows[0].exists) {
      console.log('✅ Tabla "usuario" existe');

      // Verificar estructura
      const usuarioColumns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'usuario'
        ORDER BY ordinal_position;
      `);

      console.log('   Columnas de usuario:');
      usuarioColumns.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      });
    } else {
      console.log('❌ Tabla "usuario" NO existe - Creándola...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS usuario (
          dni VARCHAR(20) PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          apellido VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          telefono VARCHAR(20),
          direccion VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Tabla "usuario" creada');
    }

    // 3. Verificar tabla pedido
    const pedidoExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'pedido'
      );
    `);

    if (pedidoExists.rows[0].exists) {
      console.log('\n✅ Tabla "pedido" existe');

      // Verificar estructura
      const pedidoColumns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'pedido'
        ORDER BY ordinal_position;
      `);

      console.log('   Columnas de pedido:');
      pedidoColumns.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      });
    } else {
      console.log('❌ Tabla "pedido" NO existe - Creándola...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS pedido (
          id_pedido SERIAL PRIMARY KEY,
          id_usuario VARCHAR(20) REFERENCES usuario(dni),
          fecha DATE NOT NULL,
          estado BOOLEAN DEFAULT false,
          estado_pago BOOLEAN DEFAULT false,
          monto_total DECIMAL(10,2) NOT NULL,
          id_mercadopago VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('✅ Tabla "pedido" creada');
    }

    // 4. Verificar tabla detalle_pedido
    const detalleExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'detalle_pedido'
      );
    `);

    if (detalleExists.rows[0].exists) {
      console.log('\n✅ Tabla "detalle_pedido" existe');

      // Verificar estructura
      const detalleColumns = await pool.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'detalle_pedido'
        ORDER BY ordinal_position;
      `);

      console.log('   Columnas de detalle_pedido:');
      detalleColumns.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      });
    } else {
      console.log('❌ Tabla "detalle_pedido" NO existe - Creándola...');
      await pool.query(`
        CREATE TABLE IF NOT EXISTS detalle_pedido (
          id_detalle SERIAL PRIMARY KEY,
          id_pedido INTEGER REFERENCES pedido(id_pedido),
          id_producto INTEGER,
          cantidad INTEGER NOT NULL,
          precio_unitario DECIMAL(10,2) NOT NULL,
          subtotal DECIMAL(10,2) NOT NULL
        );
      `);
      console.log('✅ Tabla "detalle_pedido" creada');
    }

    // 5. Verificar tabla producto (si es necesaria)
    const productoExists = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'producto'
      );
    `);

    if (productoExists.rows[0].exists) {
      console.log('\n✅ Tabla "producto" existe');
    } else {
      console.log('\n⚠️  Tabla "producto" NO existe (puede no ser necesaria si los productos vienen del frontend)');
    }

    // 6. Crear un usuario de prueba si no existe
    console.log('\n🧪 Verificando usuario de prueba...');
    const testUser = await pool.query(`
      SELECT * FROM usuario WHERE dni = '12345678'
    `);

    if (testUser.rows.length === 0) {
      await pool.query(`
        INSERT INTO usuario (dni, nombre, apellido, email, password)
        VALUES ('12345678', 'Test', 'Usuario', 'test@capygaming.com', 'password123')
        ON CONFLICT (dni) DO NOTHING;
      `);
      console.log('✅ Usuario de prueba creado (DNI: 12345678)');
    } else {
      console.log('✅ Usuario de prueba ya existe (DNI: 12345678)');
    }

    console.log('\n✅ ¡Base de datos configurada correctamente!');
    console.log('\n📌 Recuerda usar el DNI 12345678 para pruebas o crear un nuevo usuario.');

  } catch (error) {
    console.error('\n❌ Error al verificar la base de datos:', error);
    console.error('Detalles:', error.message);
  } finally {
    await pool.end();
  }
}

verificarBaseDatos();