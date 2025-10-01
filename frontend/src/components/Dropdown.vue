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
  border-bottom: 3px solid transparent; /* para que tenga base invisible como los demás */
  transition: color 0.3s, border-bottom-color 0.3s;
}

.dropdown-trigger a:hover {
  color: var(--color-primary);
}

.menu-drop {
    position: relative;
    display: block;             /* se comporta como bloque completo */
    padding: 10px 10px;         /* espacio dentro de la casilla */
    border-radius: 5px;  
    cursor: pointer;            
    background-color: var(--color-background);
}

.menu-drop:hover {
    background: var(--color-primary);
}

/* Letra más fina */
.sub-menu .menu-drop a {
    font-weight: 300; /* más liviano que normal (400) */
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
  box-shadow: 0 4px 8px #10181fa9; /* sombra hacia abajo */

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
  box-shadow: 4px 0 8px #111920; /* sombra hacia la derecha */
}

.submenu-item a {
  display: block;
  padding: 8px 12px;
  color: var(--color-foreground);
  text-decoration: none;
  font-weight: 400;
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
}


.menu-drop:hover  .arrow-icon {
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
}
.menu-drop:hover .menu-link {
  color: var(--color-background); /* o usa un color oscuro como #000 */
}

.menu-drop:hover .menu-link span {
  color: var(--color-background); /* aplica también a los spans internos */
  background: transparent;
  font-weight: 400;
}


</style>