<template>
    <div class="menu-item" @mouseenter="isOpen=true" @mouseleave="isOpen = false">
    <div class="dropdown-trigger">
        <a href="#">{{ title }}</a>

        <span class="icon-wrapper">
            <svg class="icon-drop default" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#FDEBD0" d="m11.808 14.77l-3.715-4.458A.8.8 0 0 1 8.708 9h6.584a.8.8 0 0 1 .614 1.312l-3.714 4.458a.25.25 0 0 1-.384 0"/></svg>
            <svg class="icon-drop hover" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#F39C12" d="m11.808 14.77l-3.715-4.458A.8.8 0 0 1 8.708 9h6.584a.8.8 0 0 1 .614 1.312l-3.714 4.458a.25.25 0 0 1-.384 0"/></svg>
        </span>
    </div>

    <div class="sub-menu" v-if="isOpen">
       <div v-for="(item, i) in items" :key="i" class="menu-drop" @mouseenter="hovered = i" @mouseleave="hovered = null">
    <a :href="item.link" class="menu-link">
        <span> {{ item.title }} </span> 
        <span v-if="item.children" class="arrow-icon">▶</span>
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

.dropdown-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  cursor: pointer;
  background-color: transparent;
}

.dropdown-trigger a {
  color: var(--color-foreground);
  text-decoration: none;
  padding-bottom: 3px;
  border-bottom: 3px solid transparent; /* para que tenga base invisible como los demás */
  transition: color 0.3s, border-bottom-color 0.3s;
}

.dropdown-trigger a:hover {
  color: var(--color-primary);
}

.menu-item svg {
    width: 30px;
}
.menu-item a{
    color: inherit;
} 

.menu-drop {
    position: relative;
    display: block;             /* se comporta como bloque completo */
    padding: 10px 10px;         /* espacio dentro de la casilla */
    border-radius: 5px;  
    cursor: pointer;            
    background-color: var(--color-card);

}

.menu-drop:hover {
    background: var(--color-primary);
}

/* Letra más fina */
nav .sub-menu .menu-drop a {
    font-weight: 300; /* más liviano que normal (400) */
}

nav .menu-item .sub-menu {
    position: absolute;
    text-align: left;
    top: calc(100% + 0px);
    background: var(--color-card);
    padding: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: max-content;
}

/* Para que el icono del drop cambie de color */
.icon-wrapper {
    display: flex;
    background: transparent;
}

.icon-drop {
  width: 20px;
  vertical-align: middle;
  transition: all 0.01s ease-in-out;
  fill: currentColor;
  background-color: transparent;
}

.icon-drop.hover {
    position: absolute;
    opacity: 0;
}

.dropdown-trigger:hover {
  color: var(--color-primary);
}

.dropdown-trigger:hover .icon-drop.default {
  opacity: 0;
}

.dropdown-trigger:hover .icon-drop.hover {
  opacity: 1;
}


/* ESTILOS PARA DROP DEL DROP */
.submenu-right {
  position: absolute;
  top: 0;
  top: calc(100% - 55px);
  left: calc(100% - 0px);
  background: var(--color-card);
  background-color: var(--color-card);
  padding: 10px;
  white-space: nowrap;
  border-radius: 5px;
}

.submenu-item a {
  display: block;
  padding: 8px 12px;
  color: var(--color-foreground);
  text-decoration: none;
  font-weight: 400;
  background: var(--color-card) !important;
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
  font-size: 0.8rem;
  color: var(--color-foreground);
}
.menu-drop:hover .arrow-icon {
  color: var(--color-background);
  background: transparent;
}

.menu-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-foreground);
  text-decoration: none;
  font-weight: 400;
  background: none;
  background-color: transparent;
  box-sizing: border-box;
}

.menu-drop:hover .menu-link .arrow-icon {
  color: var(--color-background);
 font-weight: 400 !important;
}


</style>