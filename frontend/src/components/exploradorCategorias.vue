<template>
    <div class="categorias-container">
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
                    <div class="categoria-main" @click="toggleSubcategorias(categoria.id)">
                        <span class="categoria-nombre">{{ categoria.nombre }}</span>
                        <span class="categoria-toggle" v-if="categoria.subcategorias && categoria.subcategorias.length">
                            {{ categoriaAbierta === categoria.id ? '−' : '+' }}
                        </span>
                    </div>
                    <ul v-if="categoriaAbierta === categoria.id && categoria.subcategorias && categoria.subcategorias.length" 
                        class="subcategorias-list">
                        <li v-for="subcategoria in categoria.subcategorias" :key="subcategoria.id" 
                            class="subcategoria-item">
                            <a href="#" @click.prevent="filtrarPorSubcategoria(subcategoria.nombre)" class="subcategoria-link">
                                {{ subcategoria.nombre }}
                            </a>
                        </li>
                    </ul>
                    <a v-else href="#" @click.prevent="filtrarPorCategoria(categoria.nombre)" class="categoria-link">
                    </a>
                </li>
            </ul>
        </div>

        <hr class="separador">

        <!-- Filtros -->
        <div class="filtros-section">
            <h2 class="section-title">Filtros</h2>
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
                { id: 14, nombre: "Conectividad" },
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
            ordenSeleccionado: "todos",
            categoriaAbierta: null
        };
    },
    methods: {
        verDestacados() {
            this.$emit('ver-destacados');
        },
        filtrarPorCategoria(categoria) {
            this.$emit('categoria-seleccionada', categoria);
        },
        filtrarPorSubcategoria(subcategoria) {
            this.$emit('subcategoria-seleccionada', subcategoria);
        },
        aplicarOrden() {
            this.$emit('orden-cambiado', this.ordenSeleccionado);
        },
        toggleSubcategorias(categoriaId) {
            if (this.categoriaAbierta === categoriaId) {
                this.categoriaAbierta = null;
            } else {
                this.categoriaAbierta = categoriaId;
            }
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
    overflow: hidden;
}

.categoria-item:hover {
    transform: translateX(5px);
}

.categoria-main {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    cursor: pointer;
    background-color: var(--color-accent);
    color: var(--color-foreground);
    transition: background-color 0.2s;
}

.categoria-nombre {
    color: var(--chart-2);
    background-color: var(--color-accent);
    font-weight: bold;
}   

.categoria-toggle {
    background-color: var(--color-accent);
    color: var(--chart-2);
    font-weight: bold;
    font-size: 1.2rem;
}

.subcategorias-list {
    list-style: none;
    padding: 0;
    margin: 0;
    background-color: var(--color-background);
}

.subcategoria-item {
    border-top: 1px solid var(--color-border);
}

.subcategoria-link {
    display: block;
    padding: 0.5rem 1rem;
    text-decoration: none;
    color: var(--color-muted-foreground);
    background-color: var(--color-card);
    transition: color 0.2s, background-color 0.2s;
}

.subcategoria-link:hover {
    color: var(--color-primary);
    background-color: var(--color-accent);
    padding-left: 1.5rem;
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

.ordenar-por {
    background-color: var(--color-card);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.ordenar-por span {
    margin-top: 10px;
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