<template>
    <div v-if="visible" class="modal-overlay" @click.self="cerrar">
        <div class="modal-content">
        <!-- Encabezado -->
        <header class="modal-header">
            <p>  🛒   Producto añadido correctamente a su carrito de compra</p>
            <button class="close-button" @click="cerrar">✖</button>
        </header>

        <div class="modal-body">
            <!-- Información del producto agregado -->
            <div class="producto-agregado">
            <img
                :src="ultimoProducto.imagenes?.[0] || '../assets/IconosNavBarFooter/nodisponible.jpg'"
                alt="Imagen del producto"
                class="producto-imagen"
            />
            <div class="producto-informacion">
                <p class="producto-titulo">{{ ultimoProducto.nombre }}</p>
                <p class="producto-precio">
                {{ ultimoProducto.quantity }} x $ {{ ultimoProducto.precio}}
                </p>
            </div>
            </div>

            <!-- Resumen del carrito -->
            <div class="carrito-resumen">
            <p>
                Hay {{ cantidadTotal }} artículos en su carrito.
            </p>
            <p>
                <strong>Total de Productos</strong>: $ {{ totalGeneral.toLocaleString() }}
            </p>
            </div>
        </div>

        <!-- Botones de acción -->
        <div class="modal-actions">
            <button class="btn-finalizar" @click="finalizarCompra">
            Finalizar compra
            </button>
            <button class="btn-continuar" @click="cerrar">
            Continuar comprando
            </button>
        </div>
        </div>
    </div>
</template>

<script setup>
    import { computed } from "vue";
    import {toRefs } from 'vue';
    import { useRouter } from "vue-router";

    const router = useRouter();

    // Props recibidos desde el padre
    const props = defineProps({
    visible: Boolean,
    carrito: { type: Array, default: () => [] },
    // ultimoProducto: { type: Object,
    //         default: () => ({
    //             nombre: "Producto no disponible",
    //             precio: 0,
    //             quantity: 0,
    //             imagenes: []
    //         }) }
    ultimoProducto: { type: Object, default: () => ({}) },
    });
    
    const {ultimoProducto} = toRefs(props);
    console.log("ultimoProducto de carrito modal preview:");
    console.log(ultimoProducto);
    // Emitimos el evento 'close' para cerrar el modal
    const emit = defineEmits(["close"]);

    // Computamos la cantidad total de productos en el carrito
    const cantidadTotal = computed(() =>
    props.carrito.reduce((total, item) => total + item.quantity, 0)
    );

    // Computamos el total general del carrito
    const totalGeneral = computed(() =>
    props.carrito.reduce((total, item) => total + item.quantity * item.precio, 0)
    );

    // Función para cerrar el modal
    const cerrar = () => emit("close");

    // Función para finalizar compra (puedes personalizarla según tus necesidades)
    const finalizarCompra = () => {
    cerrar(); // cierra el modal
    router.push("/carrito"); // redirige al carrito
    //alert("Redirigiendo al proceso de compra...");
    // Aquí podrías redirigir al checkout, por ejemplo:
    // router.push('/checkout');
    };
</script>

    <style scoped>
    @import url(../assets//styles/base.css);

    .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    }

    .modal-content {
    background-color: var(--color-border) ;
    padding: 1rem;
    border-radius: 8px;
    max-width: 800px;
    width: 100%;
    color: var(--chart-1);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    }

    .item {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    }

    .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    color: var(--color-primary);
    padding: 1rem;
    border-radius: 8px 8px 0 0;
    background-color: var(--color-background);
    top: 0;
    }

    .modal-header p{
    font-weight: 500;
    color: var(--color-primary);
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    background-color: var(--color-background);
    }

    .close-button {
    border: none;
    color: rgb(146, 0, 0);
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    background-color: var(--color-background);
    }

    header{
        height: 45px;
    }

    .close-button:hover{
        transform: scale(1.2);
    }

    .modal-body {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    background-color: #2C3E50;
    align-items: center;
    justify-content: space-evenly;
    }

    /* Información del producto agregado */
    .producto-agregado {
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #2C3E50;
    }

    .producto-imagen {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    object-fit: contain;
    border-radius: 10px;
    }

    .producto-imagen:hover{
        transform: scale(1.5);
    }

    .producto-informacion {
    flex: 1;
    background-color: #2C3E50;
    }

    .producto-titulo {
    font-size: 1rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--color-primary);
    }

    .producto-precio {
    font-size: 0.9rem;
    font-weight: bold;
    color: #ffe0b2;
    }

    /* Resumen del carrito */
    .carrito-resumen {
    padding: 0.2rem;
    border-radius: 8px;
    font-size: 0.9rem;
    text-align: center;
    background-color: #2C3E50;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    }

    /* Botones de acción */
    .modal-actions {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    background-color: #2C3E50;
    }

    .btn-finalizar {
    background-color: #ff9800;
    color: black;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    flex: 1;
    text-align: center;
    }

    .btn-finalizar:hover {
    background-color: #ffffff;
    }

    .btn-continuar {
    background-color: #ffe0b2;
    color: black;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    flex: 1;
    text-align: center;
    }

    .btn-continuar:hover {
    background-color: #000000;
    color: var(--color-primary);
    }

    .item-img {
    width: 35%;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
    }
    .item-info p {
    margin: 0.2rem 0;
    text-align: right;
    flex: 1;
    }

    h2, .item, .item-info, strong,  p{
        background-color: var(--color-border) ;
    }

    h2{
        color: var(--sidebar-primary);
    }
</style>