// Script para insertar productos en la base de datos de Render
// Ejecutar: node backend/seedProductsRender.js

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import pkg from 'pg';
const { Client } = pkg;
import { productos } from './bd/productsData.js';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: path.resolve(__dirname, '.env.render') });
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
}

async function seedProducts() {
  console.log('🔄 Conectando a la base de datos...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Conectado a PostgreSQL');
    console.log('');
    console.log(`📦 Insertando ${productos.length} productos...`);
    console.log('');

    let insertados = 0;
    let duplicados = 0;
    let errores = 0;

    for (const p of productos) {
      try {
        await client.query('BEGIN');

        // Obtener o insertar categoría
        const catRes = await client.query(
          'SELECT id_categoria FROM categoria WHERE nombre = $1',
          [p.categoria]
        );

        let id_categoria;
        if (catRes.rows.length > 0) {
          id_categoria = catRes.rows[0].id_categoria;
        } else {
          const insertCat = await client.query(
            'INSERT INTO categoria (nombre) VALUES ($1) RETURNING id_categoria',
            [p.categoria]
          );
          id_categoria = insertCat.rows[0].id_categoria;
          console.log(`  ✅ Nueva categoría: ${p.categoria}`);
        }

        // Obtener o insertar subcategoría (si existe)
        let id_subcategoria = null;
        if (p.subcategoria) {
          const subRes = await client.query(
            'SELECT id_subcategoria FROM subcategoria WHERE nombre = $1 AND id_categoria = $2',
            [p.subcategoria, id_categoria]
          );

          if (subRes.rows.length > 0) {
            id_subcategoria = subRes.rows[0].id_subcategoria;
          } else {
            const insertSub = await client.query(
              'INSERT INTO subcategoria (nombre, id_categoria) VALUES ($1, $2) RETURNING id_subcategoria',
              [p.subcategoria, id_categoria]
            );
            id_subcategoria = insertSub.rows[0].id_subcategoria;
            console.log(`  ✅ Nueva subcategoría: ${p.subcategoria}`);
          }
        }

        // Verificar si el producto ya existe
        const existe = await client.query(
          'SELECT id_producto FROM producto WHERE nombre = $1',
          [p.nombre]
        );

        if (existe.rows.length > 0) {
          console.log(`  ⚠️  Producto duplicado: ${p.nombre.substring(0, 50)}...`);
          await client.query('ROLLBACK');
          duplicados++;
          continue;
        }

        // Insertar producto
        const insertProd = await client.query(
          `INSERT INTO producto (nombre, precio, marca, descripcion, stock, descuento, id_categoria, id_subcategoria)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           RETURNING id_producto`,
          [
            p.nombre,
            p.precio,
            p.marca || null,
            p.descripcion || null,
            p.stock || 0,
            p.descuento || 0,
            id_categoria,
            id_subcategoria
          ]
        );

        const id_producto = insertProd.rows[0].id_producto;

        // Insertar imágenes
        if (p.imagenes && p.imagenes.length > 0) {
          for (let i = 0; i < p.imagenes.length; i++) {
            await client.query(
              'INSERT INTO imagen_producto (id_producto, url_imagen, orden) VALUES ($1, $2, $3)',
              [id_producto, p.imagenes[i], i]
            );
          }
        }

        await client.query('COMMIT');
        console.log(`  ✅ Insertado: ${p.nombre.substring(0, 50)}...`);
        insertados++;

      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`  ❌ Error insertando ${p.nombre.substring(0, 30)}:`, error.message);
        errores++;
      }
    }

    console.log('');
    console.log('📊 Resumen:');
    console.log(`  ✅ Insertados: ${insertados}`);
    console.log(`  ⚠️  Duplicados: ${duplicados}`);
    console.log(`  ❌ Errores: ${errores}`);
    console.log('');
    console.log('✅ ¡Proceso completado!');

  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Ejecutar
seedProducts();
