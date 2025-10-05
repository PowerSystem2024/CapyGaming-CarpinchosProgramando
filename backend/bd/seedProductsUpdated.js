import pool from './pool.js';
import { productos } from '../../frontend/src/assets/data/productsData.js';

console.log('🚀 Iniciando carga de productos...');
console.log(`📦 Total de productos a procesar: ${productos.length}`);

(async () => {
    let insertados = 0;
    let duplicados = 0;
    let errores = 0;

    try {
        for (const p of productos) {
            try {
                await pool.query('BEGIN');

                // 1. Insertar o recuperar categoría
                console.log(`📁 Procesando categoría: ${p.categoria}`);
                let catRes = await pool.query(
                    'SELECT id_categoria FROM categoria WHERE nombre = $1',
                    [p.categoria]
                );
                
                let id_categoria;
                if (catRes.rows.length > 0) {
                    id_categoria = catRes.rows[0].id_categoria;
                } else {
                    const insertCat = await pool.query(
                        'INSERT INTO categoria (nombre) VALUES ($1) RETURNING id_categoria',
                        [p.categoria]
                    );
                    id_categoria = insertCat.rows[0].id_categoria;
                    console.log(`✅ Nueva categoría creada: ${p.categoria} (ID: ${id_categoria})`);
                }

                // 2. Insertar o recuperar subcategoría (si existe)
                let id_subcategoria = null;
                if (p.subcategoria) {
                    console.log(`📂 Procesando subcategoría: ${p.subcategoria}`);
                    const subRes = await pool.query(
                        'SELECT id_subcategoria FROM subcategoria WHERE nombre = $1 AND id_categoria = $2',
                        [p.subcategoria, id_categoria]
                    );
                    
                    if (subRes.rows.length > 0) {
                        id_subcategoria = subRes.rows[0].id_subcategoria;
                    } else {
                        const insertSub = await pool.query(
                            'INSERT INTO subcategoria (nombre, id_categoria) VALUES ($1, $2) RETURNING id_subcategoria',
                            [p.subcategoria, id_categoria]
                        );
                        id_subcategoria = insertSub.rows[0].id_subcategoria;
                        console.log(`✅ Nueva subcategoría creada: ${p.subcategoria} (ID: ${id_subcategoria})`);
                    }
                }

                // 3. Verificar si el producto ya existe
                const existe = await pool.query(
                    'SELECT id_producto FROM producto WHERE nombre = $1',
                    [p.nombre]
                );
                
                if (existe.rows.length > 0) {
                    console.log(`⚠️  Producto duplicado saltado: ${p.nombre}`);
                    duplicados++;
                    await pool.query('ROLLBACK');
                    continue;
                }

                // 4. Insertar producto
                console.log(`📦 Insertando producto: ${p.nombre}`);
                const insertProducto = await pool.query(
                    `INSERT INTO producto (
                        nombre, 
                        precio, 
                        stock, 
                        marca, 
                        id_categoria, 
                        id_subcategoria,
                        imagenes
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
                    RETURNING id_producto`,
                    [
                        p.nombre, 
                        p.precio, 
                        p.stock, 
                        p.marca, 
                        id_categoria, 
                        id_subcategoria,
                        JSON.stringify(p.imagenes) // Guardar imagenes como JSON
                    ]
                );
                
                const id_producto = insertProducto.rows[0].id_producto;

                // 5. Insertar imágenes en tabla imagen_producto
                if (p.imagenes && p.imagenes.length > 0) {
                    for (let i = 0; i < p.imagenes.length; i++) {
                        await pool.query(
                            'INSERT INTO imagen_producto (id_producto, url_imagen, es_principal, orden_display) VALUES ($1, $2, $3, $4)',
                            [id_producto, p.imagenes[i], i === 0, i] // Primera imagen es principal
                        );
                    }
                    console.log(`📸 ${p.imagenes.length} imágenes insertadas para ${p.nombre}`);
                }

                await pool.query('COMMIT');
                insertados++;
                console.log(`✅ Producto insertado exitosamente: ${p.nombre} (ID: ${id_producto})`);

            } catch (err) {
                await pool.query('ROLLBACK');
                errores++;
                console.error(`❌ Error al insertar ${p.nombre}:`, err.message);
            }
        }

        // Resumen final
        console.log('\n📊 RESUMEN DE CARGA:');
        console.log(`✅ Productos insertados: ${insertados}`);
        console.log(`⚠️  Productos duplicados: ${duplicados}`);
        console.log(`❌ Errores: ${errores}`);
        console.log(`📦 Total procesados: ${insertados + duplicados + errores}`);

        // Verificar estado de la base de datos
        const totalProductos = await pool.query('SELECT COUNT(*) as total FROM producto');
        const totalCategorias = await pool.query('SELECT COUNT(*) as total FROM categoria');
        const totalSubcategorias = await pool.query('SELECT COUNT(*) as total FROM subcategoria');
        const totalImagenes = await pool.query('SELECT COUNT(*) as total FROM imagen_producto');

        console.log('\n📈 ESTADO ACTUAL DE LA BASE DE DATOS:');
        console.log(`📦 Total productos: ${totalProductos.rows[0].total}`);
        console.log(`📁 Total categorías: ${totalCategorias.rows[0].total}`);
        console.log(`📂 Total subcategorías: ${totalSubcategorias.rows[0].total}`);
        console.log(`📸 Total imágenes: ${totalImagenes.rows[0].total}`);

    } catch (error) {
        console.error('💥 Error fatal:', error);
    } finally {
        await pool.end();
        console.log('🔌 Conexión a la base de datos cerrada');
    }
})();