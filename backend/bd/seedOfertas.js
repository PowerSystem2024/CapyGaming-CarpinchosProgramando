
import 'dotenv/config';
import pool from './pool.js';

const ofertas = [
  { id_producto: 13, descuento: 15, fecha_inicio: '2025-10-17', fecha_fin: '2025-10-24' },
  { id_producto: 14, descuento: 20, fecha_inicio: '2025-10-17', fecha_fin: '2025-10-24' },
  { id_producto: 15, descuento: 10, fecha_inicio: '2025-10-17', fecha_fin: '2025-10-24' },
  { id_producto: 18, descuento: 25, fecha_inicio: '2025-10-17', fecha_fin: '2025-10-24' }
];

async function seedOfertas() {
  try {
    console.log("🌟 Insertando ofertas...");

    for (const o of ofertas) {
      await pool.query(
        `INSERT INTO ofertas (id_producto, descuento, fecha_inicio, fecha_fin)
         VALUES ($1, $2, $3, $4)`,
        [o.id_producto, o.descuento, o.fecha_inicio, o.fecha_fin]
      );
    }

    console.log("✅ Ofertas insertadas correctamente");
  } catch (error) {
    console.error("❌ Error al insertar ofertas:", error);
  } finally {
    await pool.end();
  }
}

seedOfertas();

