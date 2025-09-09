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
                <!-- Mostrar productos destacados o catálogo normal según el estado -->
                <ProductosDestacados 
                    v-if="mostrandoDestacados"
                    @agregar-al-carrito="agregarAlCarrito"
                />
                
                <div v-else>
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
    </div>
</template>

<script>
import { productos } from "../assets/data/productsData";
import Categorias from "../components/exploradorCategorias.vue";
import { addToCart } from "../utils/cartUtils";
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
            ordenSeleccionado: "todos",
            mostrandoDestacados: false
        };
    },
    methods: {
        imagenError(event) {
            event.target.src = "https://via.placeholder.com/250x150?text=Imagen+no+disponible";
        },
        agregarAlCarrito(producto) {
            console.log("Agregado al carrito:", producto);
        },
        filtrarProductosPorCategoria(categoriaExplorador) {
            this.categoriaSeleccionada = categoriaExplorador;
            this.subcategoriaSeleccionada = null;
            
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
                    // Filtrar productos que comiencen con la categoría principal
                    // Esto incluirá todas las subcategorías
                    this.productosFiltrados = this.productos.filter(producto => 
                        producto.categoria.startsWith(categoriaProducto)
                    );
                } else {
                    this.productosFiltrados = this.productos;
                }
            }
            
            console.log(`Filtrando por categoría: ${categoriaExplorador}`);
            console.log(`Productos encontrados: ${this.productosFiltrados.length}`);
        },
        mostrarDestacados() {
            this.mostrandoDestacados = true;
        },
        filtrarProductosPorSubcategoria(subcategoriaExplorador) {
            this.subcategoriaSeleccionada = subcategoriaExplorador;
            
            const mapeoSubcategorias = {
                // Notebooks
                "Notebooks ACER": "Notebook/ACER",
                "Notebooks ASUS": "Notebook/ASUS",
                "Notebooks Lenovo": "Notebook/Lenovo",

                // Kits de actualización
                "CPU + Motherboard": "Kit Upgrade/CPU + Motherboard",
                "CPU + RAM": "Kit Upgrade/CPU + RAM",
                "Completos": "Kit Upgrade/Completos",

                // Procesadores
                "Procesadores AMD": "Procesadores/AMD",
                "Procesadores Intel": "Procesadores/Intel",

                // Mothers
                "Mother ASUS": "Mothers/ASUS",
                "MSI": "Mothers/MSI",
                "Gigabyte": "Mothers/Gigabyte",
                "ASRock": "Mothers/ASRock",

                // Placas de Video
                "Placas de Video Zotac": "Placas de Video/Zotac",
                "Placas de Video ASUS": "Placas de Video/ASUS",

                // Memorias RAM
                "Memorias RAM ADATA": "Memorias RAM/ADATA",
                "Memorias RAM Team Group": "Memorias RAM/Team Group",
                "Memorias RAM G.Skill": "Memorias RAM/G.Skill",

                // Almacenamiento
                "Discos Rígidos": "Almacenamiento/Disco Rigido",
                "Discos Sólidos SSD": "Almacenamiento/Disco Solido",

                // Refrigeración
                "Coolers": "Refrigeracion/Coolers",
                "Water Cooler": "Refrigeracion/Water Cooler",

                // Gabinetes
                "Gabinetes Cougar": "Gabinetes/Cougar",
                "Gabinetes Corsair": "Gabinetes/Corsair",
                "Gabinetes HYTE": "Gabinetes/HYTE",

                // Fuentes
                "Fuentes ADATA": "Fuentes/ADATA",
                "Fuentes Be Quiet": "Fuentes/Be Quiet",
                "Fuentes Corsair": "Fuentes/Corsair",

                // Monitores
                "Monitores LG": "Monitores/LG",
                "Monitores AsRock": "Monitores/AsRock",
                "Monitores Samsung": "Monitores/Samsung",

                // Periféricos
                "Teclados": "Perifericos/Teclado",
                "Mouse": "Perifericos/Mouse",
                "Auriculares": "Perifericos/Auriculares",
                "Micrófonos": "Perifericos/Microfono",
                "Webcams": "Perifericos/Webcam",
                "Joysticks": "Perifericos/Joystick",
                "Volantes": "Perifericos/Volante",
                "Mouse Pads": "Perifericos/MousePad",
                "Stream Decks": "Perifericos/StreamDeck",
                "Parlantes": "Perifericos/Parlante",
                "Combos": "Perifericos/Combo",

                // Consolas
                "Nintendo Switch": "Consolas/Nintendo Switch",
                "PlayStation": "Consolas/PlayStation",
                "Xbox": "Consolas/Xbox"
            };
            
            const subcategoriaProducto = mapeoSubcategorias[subcategoriaExplorador];
            
            if (subcategoriaProducto) {
                this.productosFiltrados = this.productos.filter(producto => 
                    producto.categoria === subcategoriaProducto
                );
                console.log(`Filtrando por subcategoría: ${subcategoriaExplorador}`);
                console.log(`Buscando categoría: ${subcategoriaProducto}`);
                console.log(`Productos encontrados: ${this.productosFiltrados.length}`);
                
                // Debug: mostrar todas las categorías disponibles
                const categoriasUnicas = [...new Set(this.productos.map(p => p.categoria))];
                console.log("Categorías disponibles:", categoriasUnicas);
            } else {
                console.warn(`Subcategoría no mapeada: ${subcategoriaExplorador}`);
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
                this.productosFiltrados = [...this.productos];
            }
        }
    }
}
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