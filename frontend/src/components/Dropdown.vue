<template>
    <div class="menu-item" @mouseenter="isOpen=true" @mouseleave="isOpen = false">
        <a href="#">
            {{ title }}
        </a>
        <svg viewBox="0 0 1030 638" width="10px" class="svgcolor">
            <path d="M1017 68L541 626q-11 12-26 12t-26-12L13 68Q-3 49 6 24.5T39 0h952q24 0 33 24.5t-7 43.5z" fill="#fff"></path>
        </svg>


        <div class="sub-menu" v-if="isOpen">
            <div v-for="(item, i) in items" :key="i" class="menu-item">
                <a :href="item.link">{{ item.title }}</a>
            </div>
        </div>


    </div>
</template>

<script>

    export default {
        name: 'dropdown',
        props: ['title', 'items'],

        data(){
            return{
                isOpen: false
            }
        }
    }
</script>

<style>
@import url(../assets/styles/base.css);

    .menu-item svg {
        width: 10px;
        margin-left: 10px;
    }

    /* El texto y el svg heredan el color del contenedor */
    .menu-item {
        color: #fff; /* color base */
    }

    .menu-item:hover {
        color: var(--color-primary); /* cambia texto*/
    }


    .menu-item a{
        color: inherit;
    }

    /* Espaciado entre los links */
    nav .sub-menu .menu-item {
    margin-bottom: 12px; /* separa cada item del siguiente */
    }
    
    /* Opcional: quitar el margen del último item */
    nav .sub-menu .menu-item:last-child {
    margin-bottom: 0;
    }

    /* Letra más fina */
    nav .sub-menu .menu-item a {
    font-weight: 380; /* más liviano que normal (400) */
    }

    nav .menu-item .sub-menu {
        position: absolute;
        background-color: none;
        text-align: left;
        top: calc(100% + 3px);
        padding: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: max-content;
    }

</style>