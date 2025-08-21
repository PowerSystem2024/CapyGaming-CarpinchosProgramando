<template>
    <div class="catalogo">
        <h2 class="titulo">Catálogo de productos</h2>
        <div class="grid">
        <div v-for="producto in productos" :key="producto.id" class="card">
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

            <!-- Precio con $ -->
            <p class="precio">$ {{ producto.precio }}</p>

            <!-- Stock disponible -->
            <p class="stock">Stock disponible: {{ producto.stock }}</p>

            <!-- Botón agregar al carrito -->
            <button class="btn-carrito" @click="agregarAlCarrito(producto)">
            🛒 Agregar al carrito
            </button>
        </div>
        </div>
    </div>
</template>

<script>
import { productos } from "../assets/data/productsData";

export default {
    name: "Productos",
    data() {
        return {
        productos,
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
    },
};
</script>


<style scoped>
@import url(../assets/styles/base.css);
    .catalogo {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-family: 'Roboto', sans-serif;
    padding: 2rem;
    background-color: var(--color-background);
    color: var(--color-foreground);
    max-width: 1200px;
    margin: 0 auto;
    }

    .card {
    border-radius: 8px;
    padding: 1rem;
    width: 250px;
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

    .titulo {
    grid-column: 1/-1;
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
    max-width: 1200px;
    }

    .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    background-color: var(--color-background);
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