<template>
    <div class="menu-item" @mouseenter="isOpen=true" @mouseleave="isOpen = false">
        <div class="dropdown-trigger">
            <a href="#">{{ title }} ⮟</a>
        </div>

        <div class="sub-menu" v-if="isOpen">
            <div v-for="(item, i) in items" :key="i" class="menu-drop" @mouseenter="hovered = i" @mouseleave="hovered = null">
                <a :href="item.link" class="menu-link">
                    <span> {{ item.title }} </span> 
                    <span v-if="item.children" class="arrow-icon">⮞</span>
                </a>

                <!-- Submenú a la derecha -->
                <div v-if="item.children && hovered === i" class="submenu-right" @mouseenter="hovered = i" @mouseleave="null">
                    <div v-for="(sub, j) in item.children" :key="j" class="submenu-item">
                        <a :href="sub.link">{{ sub.title }}</a>
                    </div>
                </div>
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
                isOpen: false,
                hovered: null
            };
        }
    }
</script>

<style>
@import url(../assets/styles/base.css);

.menu-item {
    position: relative;
    display: inline-block;
}

.dropdown-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    cursor: pointer;
}

.dropdown-trigger a {
    color: var(--color-foreground);
    text-decoration: none;
    padding-bottom: 3px;
    border-bottom: 3px solid transparent;
    transition: color 0.3s, border-bottom-color 0.3s;
    white-space: nowrap;
}

.dropdown-trigger a:hover {
    color: var(--color-primary);
}

.menu-drop {
    position: relative;
    display: block;
    padding: 10px 10px;
    border-radius: 5px;  
    cursor: pointer;            
    background-color: var(--color-background);
    transition: all 0.3s ease;
}

.menu-drop:hover {
    background: var(--color-primary);
}

/* Letra más fina */
.sub-menu .menu-drop a {
    font-weight: 300;
}

.menu-item .sub-menu {
    position: absolute;
    text-align: left;
    top: calc(100% + 0px);
    background: var(--color-background);
    padding: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    box-shadow: 0 4px 8px #10181fa9;
    z-index: 1000;
}

/* ESTILOS PARA DROP DEL DROP */
.submenu-right {
    position: absolute;
    top: calc(100% - 55px);
    left: calc(100% - 0px);
    background-color: var(--color-background);
    padding: 10px;
    white-space: nowrap;
    border-radius: 5px;
    box-shadow: 4px 0 8px #111920;
    z-index: 1001;
}

.submenu-item a {
    display: block;
    padding: 8px 12px;
    color: var(--color-foreground);
    text-decoration: none;
    font-weight: 400;
    transition: all 0.3s ease;
}

.submenu-item a:hover {
    background: var(--color-primary) !important;
    color: var(--color-background);
    font-weight: 400 !important;
    border-radius: 5px;
}

.arrow-icon {
    justify-content: right;
    margin-left: 8px;
    font-size: 1rem;
    color: var(--color-foreground);
    transition: color 0.3s ease;
}

.menu-drop:hover .arrow-icon {
    color: var(--color-background);
    background: transparent;
    font-weight: 400 !important;
}

.menu-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: var(--color-foreground);
    text-decoration: none;
    font-weight: 400;
    background: transparent;
    box-sizing: border-box;
    transition: color 0.3s ease;
}

.menu-drop:hover .menu-link {
    color: var(--color-background);
}

.menu-drop:hover .menu-link span {
    color: var(--color-background);
    background: transparent;
    font-weight: 400;
}

/* ===== RESPONSIVE DESIGN ===== */
/* Tablets y pantallas medianas (768px - 1199px) */
@media (max-width: 1199px) {
    .dropdown-trigger {
        font-size: 0.95rem;
    }

    .dropdown-trigger a {
        padding: 0.3rem 0.8rem;
    }

    .menu-item .sub-menu {
        min-width: 200px;
        left: 0;
        transform: translateX(0);
    }

    .submenu-right {
        top: 0;
        left: 100%;
        min-width: 180px;
    }

    .menu-drop {
        padding: 8px 10px;
    }

    .submenu-item a {
        padding: 7px 10px;
        font-size: 0.9rem;
    }
}

/* Tablets pequeñas (600px - 767px) */
@media (max-width: 767px) {
    .menu-item {
        width: 100%;
        display: block;
    }

    .dropdown-trigger {
        width: 100%;
        justify-content: flex-start;
        font-size: 0.9rem;
        padding: 0.5rem 1rem;
    }

    .dropdown-trigger a {
        width: 100%;
        padding: 0.5rem 0;
        border-bottom: none;
    }

    .menu-item .sub-menu {
        position: static;
        width: 100%;
        transform: none;
        box-shadow: none;
        border-radius: 0;
        padding: 0;
        background: var(--color-accent);
        margin-top: 0.5rem;
    }

    .menu-drop {
        padding: 0.8rem 1rem;
        border-radius: 0;
        border-bottom: 1px solid var(--color-border);
    }

    .menu-drop:hover {
        background: var(--color-primary);
    }

    .submenu-right {
        position: static;
        width: 100%;
        box-shadow: none;
        border-radius: 0;
        padding: 0.5rem 0 0.5rem 1.5rem;
        background: var(--color-card);
        margin-top: 0.5rem;
    }

    .submenu-item a {
        padding: 0.6rem 1rem;
        font-size: 0.85rem;
        border-radius: 0;
    }

    .arrow-icon {
        font-size: 0.9rem;
    }

    /* Ocultar flecha del trigger en móvil */
    .dropdown-trigger a::after {
        content: "⮟";
        margin-left: 0.5rem;
    }
}

/* Móviles (480px - 599px) */
@media (max-width: 599px) {
    .dropdown-trigger {
        font-size: 0.85rem;
        padding: 0.4rem 0.8rem;
    }

    .menu-drop {
        padding: 0.7rem 0.8rem;
    }

    .submenu-right {
        padding: 0.4rem 0 0.4rem 1.2rem;
    }

    .submenu-item a {
        padding: 0.5rem 0.8rem;
        font-size: 0.8rem;
    }

    .arrow-icon {
        font-size: 0.85rem;
        margin-left: 0.5rem;
    }
}

/* Móviles pequeños (hasta 479px) */
@media (max-width: 479px) {
    .dropdown-trigger {
        font-size: 0.8rem;
        padding: 0.3rem 0.6rem;
    }

    .menu-drop {
        padding: 0.6rem 0.6rem;
    }

    .submenu-right {
        padding: 0.3rem 0 0.3rem 1rem;
    }

    .submenu-item a {
        padding: 0.4rem 0.6rem;
        font-size: 0.75rem;
    }

    .arrow-icon {
        font-size: 0.8rem;
        margin-left: 0.3rem;
    }
}

/* Ajustes para pantallas muy grandes (más de 1600px) */
@media (min-width: 1600px) {
    .dropdown-trigger {
        font-size: 1.1rem;
    }

    .menu-item .sub-menu {
        min-width: 250px;
    }

    .submenu-right {
        min-width: 220px;
    }

    .menu-drop {
        padding: 12px 15px;
    }

    .submenu-item a {
        padding: 10px 15px;
        font-size: 1rem;
    }
}
</style>