<template>
    <div class="catalogo">
        <h2 class="titulo">Catálogo de productos</h2>
        <div class="grid">
        <div v-for="producto in productos" :key="producto.id" class="card">
            <div class="imagenes">
            <img
                v-for="(img, index) in producto.imagenes"
                :key="index"
                :src="img"
                :alt="`${producto.nombre} vista ${index + 1}`"
                class="imagen"
                @error="imagenError($event)"
            />
            </div>
            <h3 class="nombre">{{ producto.nombre }}</h3>
            <p class="precio">{{ producto.precio }}</p>
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
        verDetalle(producto) {
        console.log("Producto seleccionado:", producto);
        },
        imagenError(event) {
        event.target.src = "https://via.placeholder.com/250x150?text=Imagen+no+disponible";
        },
    },
};
</script>

<style scoped>
    .catalogo {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    font-family: 'Roboto', sans-serif;
    padding: 2rem;
    background-color: #a1c6d9;
    }

    .card {
    border: 1px solid #05577a;
    border-radius: 8px;
    padding: 1rem;
    width: 250px;
    text-align: center;
    background-color: #ffffff;
    transition: transform 0.2s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    }

    .imagen {
    width: 100px;
    height: auto;
    object-fit: contain;
    border-radius: 4px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }

    .titulo {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    text-align: center;
    color: black;
    }

    .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    background-color: #a1c6d9;
    }

    .nombre {
    font-size: 1rem;
    margin-top: 0.5rem;
    color: #2c3e50;
    text-align: center;
    }

    .precio {
    font-weight: bold;
    color: #070143;
    }
</style>