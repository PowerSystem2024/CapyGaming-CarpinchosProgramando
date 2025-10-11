import pool from './bd/pool.js';

async function modificarTablaDetalle() {
  console.log('🔧 Modificando tabla detalle_pedido para permitir productos sin referencia...\n');

  try {
    // 1. Eliminar la restricción de clave foránea
    console.log('1. Eliminando restricción de clave foránea...');
    await pool.query(`
      ALTER TABLE detalle_pedido
      DROP CONSTRAINT IF EXISTS fk_detalle_producto;
    `);
    console.log('✅ Restricción eliminada (o no existía)');

    // 2. Permitir NULL en id_producto (por si acaso)
    console.log('\n2. Permitiendo valores NULL en id_producto...');
    await pool.query(`
      ALTER TABLE detalle_pedido
      ALTER COLUMN id_producto DROP NOT NULL;
    `);
    console.log('✅ Columna id_producto ahora permite NULL');

    // 3. Verificar la estructura actualizada
    console.log('\n3. Verificando estructura actualizada...');
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'detalle_pedido'
      ORDER BY ordinal_position;
    `);

    console.log('\n📊 Estructura de detalle_pedido:');
    result.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'}`);
    });

    console.log('\n✅ ¡Tabla modificada exitosamente!');
    console.log('Ahora podrás crear pedidos sin necesidad de que los productos existan en la BD.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

modificarTablaDetalle();