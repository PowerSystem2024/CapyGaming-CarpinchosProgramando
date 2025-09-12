<template>
    <div class="categorias-container">
        <!-- Sección de Categorías -->
        <div class="categorias-section">
            <h2 class="section-title">Categorías</h2>
            <ul class="categorias-list">
                <!-- Enlace para mostrar todos los productos -->
                <li class="categoria-item">
                    <a href="#" @click.prevent="filtrarPorCategoria('Todos')" class="categoria-link">
                        Todos los productos
                    </a>
                </li>
                <!-- Iteración sobre cada categoría -->
                <li v-for="categoria in categorias" :key="categoria.id" class="categoria-item">
                    <div class="categoria-main">
                        <!-- Enlace para filtrar por categoría -->
                        <a href="#" @click.prevent="filtrarPorCategoria(categoria.nombre)" class="categoria-nombre">
                            {{ categoria.nombre }}
                        </a>
                        <!-- Botón para expandir/colapsar subcategorías (solo visible si hay subcategorías) -->
                        <span class="categoria-toggle" 
                                v-if="categoria.subcategorias && categoria.subcategorias.length"
                                @click="toggleSubcategorias(categoria.id)">
                            {{ categoriaAbierta === categoria.id ? '−' : '+' }}
                        </span>
                    </div>
                    
                    <!-- Lista de subcategorías (solo visible si la categoría está expandida y tiene subcategorías) -->
                    <ul v-if="categoriaAbierta === categoria.id && categoria.subcategorias && categoria.subcategorias.length"
                        class="subcategorias-list">
                        <li v-for="subcategoria in categoria.subcategorias" :key="subcategoria.id"
                            class="subcategoria-item">
                            <!-- Enlace para filtrar por subcategoría -->
                            <a href="#" @click.prevent="filtrarPorSubcategoria(subcategoria)" class="subcategoria-link">
                                {{ subcategoria.nombre }}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <!-- Separador visual entre secciones -->
        <hr class="separador">

        <!-- Sección de Filtros -->
        <div class="filtros-section">
            <h2 class="section-title">Filtros</h2>
            <!-- Selector para ordenar productos -->
            <div class="ordenar-por">
                <span>Ordenar por</span>
                <select v-model="ordenSeleccionado" @change="aplicarOrden" class="orden-select">
                    <option value="todos">Todos</option>
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
            // Array de categorías y subcategorías con datos de ejemplo
            categorias: [
                { 
                    id: 1, 
                    nombre: "Notebooks",
                    subcategorias: [
                        { id: 101, nombre: "Notebooks ACER" },
                        { id: 201, nombre: "Notebooks ASUS"},
                        { id: 202, nombre: "Notebooks Lenovo"}
                    ]
                },
                { 
                    id: 2, 
                    nombre: "Kits de actualización",
                    subcategorias: [
                        { id: 201, nombre: "CPU + Motherboard" },
                        { id: 202, nombre: "CPU + RAM" },
                        { id: 203, nombre: "Completos" }
                    ]
                },
                { id: 3, nombre: "Procesadores",
                    subcategorias: [
                        {id: 301, nombre: "Procesadores AMD"},
                        /*{id: 302, nombre: "Procesadores Intel"}*/
                    ]
                },
                { id: 4, nombre: "Mothers",
                    subcategorias: [
                        {id: 401, nombre: "Mother ASUS"},
                        /*{id: 402, nombre: "MSI"},*/
                        /*{id: 403, nombre: "Gigabyte"},*/
                        /*{id: 404, nombre: "ASRock"},*/
                    ]
                },
                { id: 5, nombre: "Placas de Video", 
                    subcategorias: [
                        {id: 501, nombre: "Placas de Video Zotac"},
                        {id: 502, nombre: "Placas de Video ASUS"}
                    ]
                },
                { id: 6, nombre: "Memorias RAM",
                    subcategorias: [
                        {id: 601, nombre: "Memorias RAM ADATA"},
                        {id: 602, nombre: "Memorias RAM Team Group"},
                        {id: 603, id: 84, nombre: "Memorias RAM G.Skill"}
                    ]
                },
                { 
                    id: 7, 
                    nombre: "Almacenamiento",
                    subcategorias: [
                        { id: 702, nombre: "Discos Rígidos" },
                        { id: 703, nombre: "Discos Sólidos SSD" }
                    ]
                },
                { 
                    id: 8, 
                    nombre: "Refrigeración",
                    subcategorias: [
                        { id: 801, nombre: "Coolers" }
                        /*{id: 802, nombre: "Water Cooler"},*/
                    ]
                },
                { id: 9, nombre: "Gabinetes",
                    subcategorias: [
                        {id: 901, nombre: "Gabinetes Cougar"},
                        {id: 902, nombre: "Gabinetes Corsair"},
                        {id: 903, nombre: "Gabinetes HYTE"}
                    ]
                },
                { id: 10, nombre: "Fuentes",
                    subcategorias: [
                        {id: 1001, nombre: "Fuentes ADATA"},
                        {id: 1002, nombre: "Fuentes Be Quiet"},
                        {id: 1003, nombre: "Fuentes Corsair"}
                    ]
                },
                { id: 11, nombre: "Monitores",
                    subcategorias: [
                        {id: 1101, nombre: "Monitores LG"},
                        {id: 1102, nombre: "Monitores AsRock"},
                        {id: 1103, nombre: "Monitores Samsung"}
                    ]
                },
                { 
                    id: 12, 
                    nombre: "Periféricos",
                    subcategorias: [
                        { id: 1201, nombre: "Teclados" },
                        { id: 1202, nombre: "Mouse" },
                        { id: 1203, nombre: "Auriculares" },
                        { id: 1204, nombre: "Micrófonos" },
                        { id: 1205, nombre: "Webcams" },
                        { id: 1206, nombre: "Joysticks" },
                        { id: 1207, nombre: "Volantes" },
                        { id: 1208, nombre: "Mouse Pads" },
                        { id: 1209, nombre: "Stream Decks" },
                        { id: 1210, nombre: "Parlantes" },
                        { id: 1211, nombre: "Combos" }
                    ]
                },
                { id: 13, nombre: "Sillas Gamer" },
                { id: 14, nombre: "Conectividad",
                    subcategorias: [
                        { id: 1401, nombre: "Placas de Red" },
                        { id: 1402, nombre: "Adaptadores WiFi" }
                    ]
                },
                { id: 15, nombre: "Estabilizadores y UPS" },
                { id: 16, nombre: "Consolas de Video Juego",
                    subcategorias: [
                        {id: 1601, nombre: "Nintendo Switch"} 
                        /*{id: 1602, nombre: "PlayStation"},
                        {id: 1603, nombre: "Xbox"}*/
                    ]
                },
                { id: 17, nombre: "Impresoras e Insumos" }
            ],
            // Valor seleccionado en el dropdown de ordenamiento
            ordenSeleccionado: "todos",
            // ID de la categoría actualmente expandida (null si ninguna está expandida)
            categoriaAbierta: null
        };
    },
    methods: {
        // Emite evento para mostrar productos destacados
        verDestacados() {
            this.$emit('ver-destacados');
        },
        // Emite evento cuando se selecciona una categoría
        filtrarPorCategoria(categoria) {
            this.$emit('categoria-seleccionada', categoria);
        },
        // Emite evento cuando se selecciona una subcategoría
        filtrarPorSubcategoria(subcategoria) {
            this.$emit('subcategoria-seleccionada', subcategoria.nombre);
        },
        // Emite evento cuando cambia el criterio de ordenamiento
        aplicarOrden() {
            this.$emit('orden-cambiado', this.ordenSeleccionado);
        },
        // Alterna la visualización de subcategorías (expandir/colapsar)
        toggleSubcategorias(categoriaId) {
            if (this.categoriaAbierta === categoriaId) {
                // Colapsar si ya está expandida
                this.categoriaAbierta = null;
            } else {
                // Expandir si está colapsada
                this.categoriaAbierta = categoriaId;
            }
        }
    }
};
</script>

<style scoped>
/* Importación de estilos base */
@import url(../assets/styles/base.css);

/* Contenedor principal */
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

/* Estilo para títulos de sección */
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

/* Separador visual entre secciones */
.separador {
    border: none;
    height: 1px;
    background-color: var(--color-border);
    margin: 1.5rem 0;
}

/* Categorías */
.categorias-section {
    background-color: var(--sidebar-accent-foreground);
}

/* Estilos para la lista de categorías */
.categorias-list {
    background-color: var(--color-background);
    list-style: none;
    padding: 0;
}

/* Estilos para cada ítem de categoría */
.categoria-item {
    margin-bottom: 0.5rem;
    background-color: var(--color-card);
    border-radius: 4px;
    border: 1px solid var(--color-border);
    transition: transform 0.2s ease;
    overflow: hidden;
}

/* Efecto hover en ítems de categoría */
.categoria-item:hover {
    transform: translateX(5px);
}

/* Contenedor principal de cada categoría (nombre + toggle) */
.categoria-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background-color: var(--color-accent);
    color: var(--color-foreground);
}

/* Estilos para el enlace de nombre de categoría */
.categoria-nombre {
    color: var(--chart-2);
    background-color: var(--color-accent);
    font-weight: bold;
    text-decoration: none;
    flex-grow: 1;
    padding: 0.5rem;
    cursor: pointer;
}   

/* Efecto hover en enlace de categoría */
.categoria-nombre:hover {
    color: var(--color-primary);
    background-color: var(--color-accent-hover);
}

/* Estilos para el botón de expandir/colapsar */
.categoria-toggle {
    background-color: var(--color-accent);
    color: var(--chart-2);
    font-weight: bold;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

/* Efecto hover en botón de expandir/colapsar */
.categoria-toggle:hover {
    background-color: var(--color-accent-hover);
}

/* Lista de subcategorías */
.subcategorias-list {
    list-style: none;
    padding: 0;
    margin: 0;
    background-color: var(--color-background);
}

/* Estilos para cada ítem de subcategoría */
.subcategoria-item {
    border-top: 1px solid var(--color-border);
}

/* Estilos para enlaces de subcategoría */
.subcategoria-link {
    display: block;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: var(--color-muted-foreground);
    background-color: var(--color-card);
    transition: color 0.2s, background-color 0.2s;
    cursor: pointer;
}

/* Efecto hover en enlaces de subcategoría */
.subcategoria-link:hover {
    color: var(--color-primary);
    background-color: var(--color-accent);
    padding-left: 1.5rem;
}

/* Estilos para el enlace "Todos los productos" */
.categoria-link {
    background-color: var(--color-accent);
    color: var(--color-foreground);
    text-decoration: none;
    display: block;
    padding: 0.5rem;
    transition: color 0.2s, background-color 0.2s;
    cursor: pointer;
}

/* Efecto hover en enlace "Todos los productos" */
.categoria-link:hover {
    color: var(--color-primary);
    background-color: var(--color-accent-hover);
}

/* Sección Filtros */
.filtros-section {
    background-color: var(--sidebar-accent-foreground);
}

/* Fondo para contenedores de información de filtros */
.filtro-info {
    background-color: var(--color-card);
}

/* Contenedor individual para cada filtro con bordes redondeados y sombra */
.filtro-item {
    margin-bottom: 1.5rem;
    padding: 0.75rem;
    background-color: var(--color-card);
    border-radius: 4px;
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Encabezado de cada filtro con diseño flexible */
.filtro-header {
    background-color: var(--color-border);
    border-radius: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
}

/* Estilo para el título del filtro */
.filtro-titulo {
    background-color: var(--color-border);
    font-weight: bold;
    color: var(--color-primary);
}

/* Estilo para los valores mostrados en el filtro */
.filtro-valor {
    background-color: var(--color-border);
    font-weight: bold;
    color: var(--color-secondary);
}

/* Estilo para los nombres de elementos filtrados */
.filtro-nombre {
    background-color: var(--color-card);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
    color: var(--color-foreground);
}

/* Estilo para los precios en los filtros */
.filtro-precio {
    background-color: var(--color-card);
    font-size: 0.9rem;
    font-weight: bold;
    color: var(--color-secondary);
    margin-bottom: 0.25rem;
}

/* Estilo para información total o resumen en filtros */
.filtro-total {
    background-color: var(--color-card);
    font-size: 0.9rem;
    color: var(--color-muted-foreground);
}

/* Estilos para la sección de filtros */
.ordenar-por {
    background-color: var(--color-card);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

/* Estilos para el texto del selector de ordenamiento */
.ordenar-por span {
    margin-top: 10px;
    background-color: var(--color-card);
    font-weight: bold;
    color: var(--color-primary);
}

/* Estilos para el dropdown de ordenamiento */
.orden-select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    color: var(--color-foreground);
    cursor: pointer;
}

/* Estilo de foco para el dropdown */
.orden-select:focus {
    outline: none;
    border-color: var(--color-primary);
}

/* Estilos para las opciones del dropdown */
.orden-select option {
    background-color: var(--color-background);
}
</style>