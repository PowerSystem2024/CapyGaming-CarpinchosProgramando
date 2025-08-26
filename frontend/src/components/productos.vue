<template>
    <div class="catalogo-page">
        <div class="sidebar">
            <Categorias 
                @categoria-seleccionada="filtrarProductosPorCategoria"
                @subcategoria-seleccionada="filtrarProductosPorSubcategoria"
                @orden-cambiado="ordenarProductos"
            />
        </div>
    
        <div class="catalogo">
            <h2 class="titulo">Catálogo de productos</h2>
            <div class="grid">
                <div v-for="producto in productosFiltrados" :key="producto.id" class="card">
                <div class="imagenes">
                    <a
                    v-for="(img, index) in producto.imagenes"
                    :key="index"
                    :href="img"
                    :data-title="producto.nombre"
                    >
                    <img
                        :src="img"
                        :alt="`${producto.nombre} vista ${index + 1}`"
                        class="imagen"
                        @error="imagenError($event)"
                    />
                    </a>
                </div>

                <h3 class="nombre">{{ producto.nombre }}</h3>
                <p class="precio">$ {{ producto.precio.toLocaleString() }}</p>
                <p class="stock">Stock disponible: {{ producto.stock }}</p>

                <button class="btn-carrito" @click="agregarAlCarrito(producto)">
                    🛒 Agregar al carrito
                </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { productos } from "../assets/data/productsData";
import Categorias from "../components/exploradorCategorias.vue";

export default {
    name: "Productos",
    components: {
    Categorias
    },
    data() {
    return {
        productos,
        productosFiltrados: productos,
        categoriaSeleccionada: null,
        subcategoriaSeleccionada: null,
        ordenSeleccionado: "todos"
    };
    },
    methods: {
    imagenError(event) {
        event.target.src =
        "https://via.placeholder.com/250x150?text=Imagen+no+disponible";
    },
    agregarAlCarrito(producto) {
        console.log("Agregado al carrito:", producto);
    },
    filtrarProductosPorCategoria(categoriaExplorador) {
        this.categoriaSeleccionada = categoriaExplorador;
        this.subcategoriaSeleccionada = null;
        
        // Mapeo mejorado de categorías del explorador a categorías de productos
        const mapeoCategorias = {
            "Notebooks": "Notebook",
            "Kits de actualización": "Kit Upgrade",
            "Procesadores": "Procesadores",
            "Mothers": "Mothers",
            "Placas de Video": "Placas de Video",
            "Memorias RAM": "Memorias RAM",
            "Almacenamiento": "Almacenamiento",
            "Refrigeración": "Refrigeracion",
            "Gabinetes": "Gabinetes",
            "Fuentes": "Fuentes",
            "Monitores": "Monitores",
            "Periféricos": "Perifericos",
            "Sillas Gamer": "Silla",
            "Conectividad": "Conectividad",
            "Estabilizadores y UPS": "Estabilizadores",
            "Consolas de Video Juego": "Consolas",
            "Impresoras e Insumos": "Impresoras",
            "Todos": "Todos"
        };
        
        if (categoriaExplorador === "Todos") {
            this.productosFiltrados = this.productos;
        } else {
            const categoriaProducto = mapeoCategorias[categoriaExplorador];
            if (categoriaProducto) {
                // Para categorías padre, buscar productos que comiencen con esa categoría
                if (["Almacenamiento", "Refrigeracion", "Perifericos", "Conectividad"].includes(categoriaProducto)) {
                    this.productosFiltrados = this.productos.filter(producto => 
                        producto.categoria.startsWith(categoriaProducto)
                    );
                } else {
                    this.productosFiltrados = this.productos.filter(producto => 
                        producto.categoria === categoriaProducto
                    );
                }
            } else {
                this.productosFiltrados = this.productos;
            }
        }
    },
    filtrarProductosPorSubcategoria(subcategoriaExplorador) {
        this.subcategoriaSeleccionada = subcategoriaExplorador;
        
        // Mapeo mejorado de subcategorías a filtros específicos
        const mapeoSubcategorias = {
            // Subcategorías de Almacenamiento
            "Discos Externos": "Almacenamiento/Disco Externo",
            "Discos Rígidos": "Almacenamiento/Disco Rigido",
            "Discos Sólidos SSD": "Almacenamiento/Disco Solido",
            
            // Subcategorías de Periféricos
            "Teclados": "Perifericos/Teclado",
            "Mouse": "Perifericos/Mouse",
            "Auriculares": "Perifericos/Auriculares",
            "Micrófonos": "Perifericos/Microfono",
            "Webcams": "Perifericos/Webcam",
            "Joysticks": "Perifericos/Joystick",
            "Volantes": "Volante",
            "Mouse Pads": "Perifericos/MousePad",
            "Stream Decks": "Perifericos/StreamDeck",
            "Parlantes": "Perifericos/Parlante",
            "Combos": "Perifericos/Combo",
            
            // Subcategorías de Refrigeración
            "Coolers": "Refrigeracion/Coolers",
            // "Water Cooler": "Refrigeracion/Water Cooler",
            
            // Subcategorías de Kits de actualización (no existen en los datos actuales)    
            "CPU + Motherboard": "Kit Upgrade/CPU + Motherboard",
            "CPU + RAM": "Kit Upgrade",
            "Completos": "Kit Upgrade/Completos",

            "AMD": "Procesadores/AMD",
            // "Intel": "Procesadores/Intel"

            "ASUS": "Mothers/ASUS",

            "ADATA": "Memorias RAM/ADATA",
            "Team Group": "Memorias RAM/Team Group",
            "G.Skill": "Memorias RAM/G.Skill",

            "Zotac": "Placas de Video/Zotac",
            "ASUS": "Placas de Video/ASUS",

            "Cougar": "Gabinetes/Cougar",
            "Corsair": "Gabinetes/Corsair",
            "HYTE": "Gabinetes/HYTE",

            "ACER": "Notebook/ACER",
            "ASUS": "Notebook/ASUS",
            "Lenovo": "Notebook/Lenovo",

            "ADATA": "Fuentes/ADATA",
            "Be Quiet": "Fuentes/Be Quiet",
            "Corsair": "Fuentes/Corsair",

            "LG": "Monitores/LG",
            "AsRock": "Monitores/AsRock",
            "Samsung": "Monitores/Samsung",

            "Nintendo Switch": "Consolas/Nintendo Switch"
        };
        
        const subcategoriaProducto = mapeoSubcategorias[subcategoriaExplorador];
        if (subcategoriaProducto) {
            // Si la subcategoría contiene una barra, buscar en la categoría del producto
            if (subcategoriaProducto.includes('/')) {
                this.productosFiltrados = this.productos.filter(producto => 
                    producto.categoria === subcategoriaProducto
                );
            } else {
                // Si no contiene barra, buscar productos de esa categoría general
                this.productosFiltrados = this.productos.filter(producto => 
                    producto.categoria === subcategoriaProducto
                );
            }
        } else {
            this.productosFiltrados = this.productos;
        }
    },
    ordenarProductos(orden) {
        this.ordenSeleccionado = orden;
        
        if (orden === "mayorPrecio") {
            this.productosFiltrados.sort((a, b) => b.precio - a.precio);
        } else if (orden === "menorPrecio") {
            this.productosFiltrados.sort((a, b) => a.precio - b.precio);
        } else {
            // Por defecto o "destacados"
            this.productosFiltrados = [...this.productos];
        }
    }
    }
};
</script>

<style scoped>
@import url(../assets/styles/base.css);

.catalogo-page {
    display: flex;
    gap: 2rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.sidebar {
    flex: 0 0 300px;  
}

.catalogo {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
}

.titulo {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 2rem;
    text-align: center;
    padding: 20px;
    color: var(--color-primary);
    background-color: var(--color-accent);
    padding: 1rem;
    border-radius: 8px;
    width: 100%;
}

.grid {
    display: grid;
    justify-items: center;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    width: 100%;
    background-color: var(--color-background);
    border-radius: 10px;
}

.card {
    border-radius: 8px;
    padding: 1rem;
    width: 250px;
    margin: 15px;
    text-align: center;
    transition: transform 0.2s ease;
    background-color: var(--color-card);
    color: var(--color-card-foreground);
    border: 1px solid var(--color-border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.imagenes {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
    border-radius: 10px;
}

.imagen {
    width: 100px;
    height: auto;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.imagen:hover{
    transform: scale(1.4);
}

.nombre {
    font-size: 1rem;
    margin-top: 0.5rem;
    text-align: center;
    color: var(--color-primary);
    background-color: var(--color-card);
}

.precio {
    font-weight: bold;
    color: var(--color-secondary);
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--color-foreground);
    margin: 0.5rem 0;
    background-color: var(--color-card);
}

.stock {
    font-size: 0.9rem;
    color: var(--color-muted-foreground);
    background-color: var(--color-card);
}

.btn-carrito {
    font-size: 1rem;
    font-weight: bold;
    margin-top: 0.5rem;
    background-color: var(--color-primary);
    color: var(--color-primary-foreground);
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-carrito:hover {
    background-color: var(--sidebar-ring);
    color: var(--color-foreground);
    transform: scale(1.1);
}
</style>