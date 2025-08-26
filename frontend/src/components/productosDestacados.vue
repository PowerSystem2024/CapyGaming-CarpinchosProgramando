<template>
    <div class="productos-destacados">
        <div class="destacados-header">
            <button class="btn-volver" @click="volverAlCatalogo">← Volver al catálogo</button>
            <h2 class="titulo-seccion">⭐ Productos Destacados</h2>
        </div>
        
        <div class="destacados-grid">
            <div v-for="producto in productosDestacados" :key="producto.id" class="destacado-card">
                <div class="destacado-imagenes">
                    <img 
                        :src="producto.imagenes[0]" 
                        :alt="producto.nombre"
                        class="destacado-imagen-principal"
                        @error="imagenError($event)"
                    />
                </div>

                <div class="destacado-info">
                    <h3 class="destacado-nombre">{{ producto.nombre }}</h3>
                    <p class="destacado-precio">$ {{ producto.precio.toLocaleString() }}</p>
                    <p class="destacado-categoria">{{ obtenerCategoriaLegible(producto.categoria) }}</p>
                    <p class="destacado-stock" :class="{'stock-bajo': producto.stock < 10}">
                        Stock: {{ producto.stock }}
                    </p>

                    <button class="btn-destacado-carrito" @click="agregarAlCarrito(producto)">
                        🛒 Agregar al carrito
                    </button>
                </div>

                <div v-if="esNuevo(producto)" class="badge-nuevo">NUEVO</div>
                <div v-if="tieneDescuento(producto)" class="badge-descuento">-{{ calcularDescuento(producto) }}%</div>
            </div>
        </div>

        <div v-if="productosDestacados.length === 0" class="sin-destacados">
            <p>No hay productos destacados en este momento.</p>
        </div>
    </div>
</template>

<script>
import { productos } from "../assets/data/productsData";

export default {
    name: "ProductosDestacados",
    data() {
        return {
            productosDestacados: []
        };
    },
    mounted() {
        this.cargarProductosDestacados();
    },
    methods: {
        cargarProductosDestacados() {
            // Lógica para determinar qué productos son destacados
            // Por ahora, seleccionamos los 6 productos con mayor stock y precio
            this.productosDestacados = [...productos]
                .sort((a, b) => {
                    // Ordenamos por stock y precio combinados
                    const valorA = a.stock * a.precio;
                    const valorB = b.stock * b.precio;
                    return valorB - valorA;
                })
                .slice(0, 6); // Mostramos solo 6 productos destacados
        },
        imagenError(event) {
            event.target.src = "https://via.placeholder.com/250x150?text=Imagen+no+disponible";
        },
        cambiarImagenPrincipal(productoId, nuevaImagen) {
            const card = this.$el.querySelector(`.destacado-card[data-id="${productoId}"]`);
            if (card) {
                const imgPrincipal = card.querySelector('.destacado-imagen-principal');
                imgPrincipal.src = nuevaImagen;
            }
        },
        agregarAlCarrito(producto) {
            console.log("Producto destacado agregado al carrito:", producto);
            this.$emit('agregar-al-carrito', producto);
        },
        obtenerCategoriaLegible(categoria) {
            // Convierte la categoría en formato técnico a uno legible
            const partes = categoria.split('/');
            return partes[partes.length - 1].replace(/([A-Z])/g, ' $1').trim();
        },
        esNuevo(producto) {
            // Lógica para determinar si un producto es nuevo (ej: ID alto)
            return producto.id > 80; // Productos con ID mayor a 80 son "nuevos"
        },
        tieneDescuento(producto) {
            // Lógica para determinar si un producto tiene descuento
            return producto.precio > 500000; // Productos caros tienen "descuento"
        },
        calcularDescuento(producto) {
            // Calcula un porcentaje de "descuento" ficticio para mostrar
            return Math.min(30, Math.floor(producto.precio / 100000));
        },
        volverAlCatalogo() {
            this.$emit('volver-al-catalogo');
        }
    }
};
</script>

<style scoped>
@import url(../assets/styles/base.css);

.destacados-header {
    background-color: var(--color-background);
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
}

.btn-volver {
    background-color: var(--color-muted);
    color: var(--color-foreground);
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 1rem;
    transition: background-color 0.3s ease;
}

.btn-volver:hover {
    background-color: var(--color-border);
}

.titulo-seccion {
    margin-bottom: 0;
}

.productos-destacados {
    margin: 2rem 0;
    padding: 1rem;
    background-color: var(--color-background);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.titulo-seccion {
    background-color: var(--color-background);
    font-size: 1.8rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
    color: var(--color-primary);
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--color-primary);
}

.destacados-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    justify-content: center;
    background-color: var(--color-background);
}

.destacado-card {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
    background-color: var(--color-card);
    color: var(--color-card-foreground);
    border: 1px solid var(--color-border);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.destacado-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.destacado-imagenes {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
    border-radius: 10px;
}

.destacado-imagen-principal {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.destacado-card:hover .destacado-imagen-principal {
    transform: scale(1.05);
}

.destacado-info {
    background-color: var(--color-card);
    padding: 1rem;
}

.destacado-nombre {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: var(--color-primary);
    background-color: var(--color-card);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.destacado-precio {
    font-size: 1.2rem;
    font-weight: bold;
    background-color: var(--color-card);
    color: var(--color-secondary);
    margin-bottom: 0.5rem;
}

.destacado-categoria {
    font-size: 0.8rem;
    background-color: var(--color-card);
    color: var(--color-muted-foreground);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
}

.destacado-stock {
    background-color: var(--color-card);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.stock-bajo {
    color: #ff4757;
    font-weight: bold;
}

.btn-destacado-carrito {
    width: 100%;
    padding: 0.75rem;
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.btn-destacado-carrito:hover {
    background-color: var(--sidebar-ring);
}

.badge-nuevo, .badge-descuento {
    position: absolute;
    top: 10px;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-size: 0.7rem;
    font-weight: bold;
}

.badge-nuevo {
    left: 10px;
    background-color: #00ff88;
    color: #000;
}

.badge-descuento {
    right: 10px;
    background-color: #ff4757;
    color: #fff;
}

.sin-destacados {
    text-align: center;
    padding: 2rem;
    color: var(--color-muted-foreground);
}

/* Responsive */
@media (max-width: 768px) {
    .destacados-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }
}

@media (max-width: 480px) {
    .destacados-grid {
        grid-template-columns: 1fr;
    }
    
    .titulo-seccion {
        font-size: 1.5rem;
    }
}
</style>