<template>
    <div class="categorias-container">
        <!-- Destacados -->
        <div class="destacados-section">
            <h2 class="section-title">Destacados</h2>
            <div class="destacado-item">
                <a href="#" class="destacado-link">Ver descuentos</a>
            </div>
        </div>

        <hr class="separador">

        <!-- Categorías -->
        <div class="categorias-section">
            <h2 class="section-title">Categorías</h2>
            <ul class="categorias-list">
                <li class="categoria-item">
                    <a href="#" @click.prevent="filtrarPorCategoria('Todos')" class="categoria-link">
                        Todos los productos
                    </a>
                </li>
                <li v-for="categoria in categorias" :key="categoria.id" class="categoria-item">
                    <a href="#" @click.prevent="filtrarPorCategoria(categoria.nombre)" class="categoria-link">
                        {{ categoria.nombre }}
                    </a>
                </li>
            </ul>
        </div>

        <hr class="separador">

        <!-- Filtros -->
        <div class="filtros-section">
            <h2 class="section-title">Filtros</h2>
            <div class="filtro-item" v-for="filtro in filtros" :key="filtro.id">
                <div class="filtro-header">
                    <span class="filtro-titulo">Descuento</span>
                    <span class="filtro-valor">{{ filtro.descuento }}</span>
                </div>
                <div class="filtro-info">
                    <p class="filtro-nombre">{{ filtro.nombre }}</p>
                    <p class="filtro-precio">+{{ filtro.precio }}</p>
                    <p class="filtro-total">{{ filtro.total }}</p>
                </div>
            </div>
        </div>

        <hr class="separador">

        <!-- Ayuda -->
        <div class="ayuda-section">
            <h2 class="section-title">Ayuda</h2>
            <div class="ordenar-por">
                <span>Ordenar por</span>
                <select v-model="ordenSeleccionado" @change="aplicarOrden" class="orden-select">
                    <option value="todos">Todos</option>
                    <option value="destacados">Destacados</option>
                    <option value="mayorPrecio">Mayor precio</option>
                    <option value="menorPrecio">Menor precio</option>
                </select>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Categorias",
    data() {
        return {
            categorias: [
                { id: 1, nombre: "Notebooks" },
                { id: 2, nombre: "Kits de actualización" },
                { id: 3, nombre: "Procesadores" },
                { id: 4, nombre: "Mothers" },
                { id: 5, nombre: "Placas de Video" },
                { id: 6, nombre: "Memorias RAM" },
                { id: 7, nombre: "Almacenamiento" },
                { id: 8, nombre: "Refrigeración" },
                { id: 9, nombre: "Cabinetes" },
                { id: 10, nombre: "Fuentes" },
                { id: 11, nombre: "Monitores" },
                { id: 12, nombre: "Periféricos" },
                { id: 13, nombre: "Sillas Garners" },
                { id: 14, nombre: "Robots" },
                { id: 15, nombre: "Conectividad" },
                { id: 16, nombre: "Estabilizadores y UPS" },
                { id: 17, nombre: "Consolas de Video Juego" },
                { id: 18, nombre: "Cables y Adaptadores" },
                { id: 19, nombre: "Celulares y Smartwatch" },
                { id: 20, nombre: "Impresoras e Insumos" }
            ],
            filtros: [
                { 
                    id: 1, 
                    descuento: "1.87,065", 
                    nombre: "Silla Garner Vertagear SL3800 HygennX Negro Carbon Ergonomic (Peso MAX. 100kg)", 
                    precio: "463300", 
                    total: "3395.335" 
                },
                { 
                    id: 2, 
                    descuento: "1.651,696", 
                    nombre: "Notebook ASUS ROG Strix SCAR B 18' Intel Core Ultra 9 275HX 32GB DDR5 SSD 2TB RTX 5080 2.5K 240Hz...", 
                    precio: "8144.200", 
                    total: "57.494.504" 
                },
                { 
                    id: 3, 
                    descuento: "1.58,636", 
                    nombre: "Silla Garner Vertagear SL3800 HygennX Negro y Blanco Ergonomic (Peso MAX. 100kg)", 
                    precio: "497,560", 
                    total: "24.28.764" 
                },
                { 
                    id: 4, 
                    descuento: "1.791,452", 
                    nombre: "Notebook ASUS ROG Strix SCAR B 18' Intel Core Ultra 9 275HX 64GB SSD 2TB RTX 5090 2.5K 240Hz Win...", 
                    precio: "8493,150", 
                    total: "59.101.698" 
                }
            ],
            ordenSeleccionado: "todos"
        };
    },
    methods: {
        filtrarPorCategoria(categoria) {
            this.$emit('categoria-seleccionada', categoria);
        },
        aplicarOrden() {
            this.$emit('orden-cambiado', this.ordenSeleccionado);
        }
    }
};
</script>

<style scoped>
@import url(../assets/styles/base.css);

.categorias-container {
    padding: 1rem;
    background-color: var(--color-background);
    color: var(--color-foreground);
    max-width: 300px;
    min-width: 250px;
    height: fit-content;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--color-border);
}

.section-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--color-primary);
    background-color: var(--color-accent);
    padding: 0.5rem;
    border-radius: 4px;
    text-align: center;
}

.separador {
    border: none;
    height: 1px;
    background-color: var(--color-border);
    margin: 1.5rem 0;
}

/* Destacados */
.destacados-section {
    background-color: var(--sidebar-accent-foreground);
}

.destacado-item {
    margin-bottom: 1rem;
    background-color: var(--color-card);
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
}

.destacado-link {
    background-color: var(--color-card);
    color: var(--color-secondary);
    text-decoration: none;
    display: block;
    font-weight: bold;
}

.destacado-link:hover {
    text-decoration: underline;
    color: var(--color-primary);
}

/* Categorías */
.categorias-section {
    background-color: var(--sidebar-accent-foreground);
}
.categorias-list {
    background-color: var(--color-background);
    list-style: none;
    padding: 0;
}

.categoria-item {
    margin-bottom: 0.5rem;
    background-color: var(--color-card);
    border-radius: 4px;
    border: 1px solid var(--color-border);
    transition: transform 0.2s ease;
}

.categoria-item:hover {
    transform: translateX(5px);
}

.categoria-link {
    background-color: var(--color-accent);
    color: var(--color-foreground);
    text-decoration: none;
    display: block;
    padding: 0.5rem;
    transition: color 0.2s, background-color 0.2s;
}

.categoria-link:hover {
    color: var(--color-primary);
    background-color: var(--color-accent);
}

/* Filtros */
.filtros-section {
    background-color: var(--sidebar-accent-foreground);
}

.filtro-info {
    background-color: var(--color-card);
}

.filtro-item {
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background-color: var(--color-card);
    border-radius: 4px;
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.filtro-header {
    background-color: var(--color-border);
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
}

.filtro-titulo {
    background-color: var(--color-border);
    font-weight: bold;
    color: var(--color-primary);
}

.filtro-valor {
    background-color: var(--color-border);
    font-weight: bold;
    color: var(--color-secondary);
}

.filtro-nombre {
    background-color: var(--color-card);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    color: var(--color-foreground);
}

.filtro-precio {
    background-color: var(--color-card);
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--color-secondary);
    margin-bottom: 0.25rem;
}

.filtro-total {
    background-color: var(--color-card);
    font-size: 0.9rem;
    color: var(--color-muted-foreground);
}

/* Ayuda */
.ayuda-section {
    background-color: var(--color-card);
    padding: 0.75rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
}

.ordenar-por {
    background-color: var(--color-card);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.ordenar-por span {
    background-color: var(--color-card);
    font-weight: bold;
    color: var(--color-primary);
}

.orden-select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    color: var(--color-foreground);
    cursor: pointer;
}

.orden-select:focus {
    outline: none;
    border-color: var(--color-primary);
}

.orden-select option {
    background-color: var(--color-background);
}

</style>