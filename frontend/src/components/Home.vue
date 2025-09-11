<template>
    <div class="home-page">
        <Ofertas @abrirPreview="$emit('abrirPreview')" />
        <Marcas />
        <quienesSomos />
        <!-- Acá podrías agregar productos destacados o categorías -->
    </div>
</template>

<script setup>
import Ofertas from '../components/Ofertas.vue';
import Marcas from '../components/Marcas.vue';
import quienesSomos from '../components/quienesSomos.vue';
</script>

<style scoped>
@import url(../assets/styles/base.css);
.home-page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
}
</style>