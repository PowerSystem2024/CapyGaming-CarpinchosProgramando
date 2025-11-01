<template>
  <div class="faq-page-wrapper">
    <h1 class="top-title"> Preguntas Frecuentes</h1>
    
    <div class="faq-container">
      <aside class="faq-categories">
        <h2 class="category-title">Categorías</h2>
        <ul>
          <li
            v-for="(categoria, index) in categorias"
            :key="index"
            :class="{ active: categoriaSeleccionada === index }"
            @click="cambiarCategoria(index)"
          >
            <span class="category-content">
              {{ categoria.nombreCorto || categoria.nombre }}
            </span>
          </li>
        </ul>
      </aside>

      <section class="faq-content">
        <transition name="fade-slide" mode="out-in">
          <h2 :key="categoriaSeleccionada">{{ categorias[categoriaSeleccionada].nombre }}</h2>
        </transition>
        <div class="faq-items">
          <transition-group name="staggered-fade" tag="div">
            <div
              v-for="(pregunta, index) in categorias[categoriaSeleccionada].preguntas"
              :key="index"
              class="faq-item"
              :style="{ '--stagger-index': index }"
            >
              <div
                  class="faq-question"
                  @click="togglePregunta(index)"
                  :class="{ 'open': pregunta.abierta }"
              >
                <span class="question-content">
                  <span class="question-text">{{ pregunta.pregunta }}</span>
                  <span class="arrow" :class="{ 'open': pregunta.abierta }">
                    <span class="arrow-icon">⮟</span>
                    <span class="arrow-hover"></span>
                  </span>
                </span>
              </div>
              
              <transition name="smooth-expand">
                  <div
                      v-show="pregunta.abierta"
                      class="faq-answer"
                  >
                    <div class="answer-inner">
                      {{ pregunta.respuesta }}
                    </div>
                  </div>
              </transition>
            </div>
          </transition-group>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
      categoriaSeleccionada: 0,
      topQuestions: [false, false, false],
      categorias: [
        {
          nombre: "Información General",
          nombreCorto: "General", // ← Nombre corto para el sidebar
          preguntas: [
            { 
              pregunta: "¿Qué es Capygaming?", 
              respuesta: "Capygaming es un proyecto académico universitario que simula una tienda online de videojuegos y hardware. Todo el sitio, incluidos productos, precios y promociones, es parte de la simulación y solo sirven para aprender y experimentar con un sitio de e-commerce. No representa transacciones reales.", 
              abierta: false 
            }
          ]
        },
        {
          nombre: "Registro de Usuario y Seguridad",
          nombreCorto: "Registro y Seguridad",
          preguntas: [
            { pregunta: "¿Es seguro registrarse en el sitio?", respuesta: "Sí, aunque el sitio es un proyecto académico, tratamos tus datos con responsabilidad. Se almacenan únicamente para simular registros y compras dentro del proyecto. No se realizan envíos ni cobros reales.", abierta: false },
            { pregunta: "¿Qué hago si olvido mi contraseña?", respuesta: "Podés simular la recuperación de contraseña. Esto es parte de la experiencia de aprendizaje, no es un restablecimiento real.", abierta: false }
          ]
        },
        {
          nombre: "Compras y Promociones",
          nombreCorto: "Compras",
          preguntas: [
            { pregunta: "¿Cómo funciona la compra de productos en Capygaming?", respuesta: "Podés agregar productos al carrito, simular pagos mediante Mercado Pago y finalizar la compra. Todo esto es una práctica educativa y no genera obligaciones reales.", abierta: false },
            { pregunta: "¿Puedo aplicar códigos de descuento o promociones?", respuesta: "Sí, podés probar códigos dentro de la simulación (codigo: Capy10), pero no se aplicarán a compras reales.", abierta: false },
            { pregunta: "¿Por qué algunos productos aparecen como “Sin Stock”?", respuesta: "Esto forma parte de la simulación para replicar cómo funcionan los sistemas de stock en un e-commerce real.", abierta: false } 
          ]
        },
        {
          nombre: "Propiedad Intelectual y Contenido",
          nombreCorto: "Contenido",
          preguntas: [
            { pregunta: "¿Puedo usar este sitio como ejemplo para otros proyectos o trabajos?", respuesta: "Sí, siempre que se respete que es un proyecto académico y se mencione su carácter educativo. No se permite el uso de fines comerciales reales.", abierta: false }
          ]
        },
        {
          nombre: "Contacto y Soporte",
          nombreCorto: "Contacto",
          preguntas: [
            { pregunta: "¿Cómo puedo hacer consultas sobre el proyecto?", respuesta: "Para dudas o sugerencias sobre el proyecto, podés enviar un correo a 'capygaming.2025@gmail.com'.", abierta: false }
          ]
        }
      ]
    };
  },
  methods: {
    togglePregunta(index) {
      const preguntas = this.categorias[this.categoriaSeleccionada].preguntas;
      // Cierra todas las demás preguntas para que solo una esté abierta a la vez
      preguntas.forEach((p, i) => {
        if (i !== index) {
          p.abierta = false;
        }
      });
      // Abre o cierra la pregunta seleccionada
      preguntas[index].abierta = !preguntas[index].abierta;
    },
    toggleTopQuestion(index) {
      // Cierra todas las demás preguntas superiores
      this.topQuestions.forEach((_, i) => {
        if (i !== index) {
          this.topQuestions[i] = false;
        }
      });
      // Abre o cierra la pregunta seleccionada
      this.topQuestions[index] = !this.topQuestions[index];
    },
    cambiarCategoria(index) {
      // Animación de cambio de categoría
      this.categoriaSeleccionada = index;
    }
  }
};
</script>

<style scoped>
@import url('../assets/styles/base.css');

.top-subtitle {
  color: var(--color-primary);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
}
/* ===== Estructura general de la página ===== */
.faq-page-wrapper {
  padding-left: 12rem;
  padding-right: 12rem;
  padding-bottom: 5rem;
  padding-top: 0.5rem;
  background-color: var(--color-background);
  color: var(--color-foreground);
  margin-top: 2.5rem;
}

/* --- Sección: Top Header --- */
.top-header {
  margin-bottom: 2rem;
}

.top-title {
  margin-top: 0;
  color: var(--color-primary);
  font-size: 2.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5; /*  Para mejor legibilidad */
}

.top-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.top-button {
  flex: 1;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  color: var(--color-foreground);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  padding: 0;
  text-align: left;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  white-space: normal;
  position: relative;
  overflow: hidden;
  min-height: 70px;
}

.button-content {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 1.5rem 1rem;
  transition: transform 0.3s ease;
}

.top-button:hover .button-content {
  transform: translateX(8px);
  border-color: var(--color-primary);
}

.top-button:hover {
  box-shadow: 0 4px 16px rgba(243, 156, 18, 0.3); /* glow naranja */
  border-color: var(--color-primary);
}

.top-button.active {
  border-color: var(--color-primary);
  background-color: rgba(243, 156, 18, 0.1); /* agregar fondo sutil */
  box-shadow: 0 4px 16px rgba(243, 156, 18, 0.4); /* glow más fuerte */
}

.button-background {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--color-accent), transparent);
  transition: left 0.6s ease;
  opacity: 0.1;
}

.top-button:hover .button-background {
  left: 100%;
}

.top-arrow {
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  color: var(--color-muted);
  flex-shrink: 0;
  margin-left: 0.5rem;
  display: inline-block;
}

.top-arrow.open {
  transform: rotate(180deg) scale(1.2);
  color: var(--color-accent);
}

.top-answers {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.top-answer {
  padding: 0;
  background-color: var(--color-panel);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  color: var(--color-muted);
  line-height: 1.6;
  overflow: hidden;
}

.answer-content {
  padding: 1.5rem;
  transform-origin: top;
}

/* ===== Contenedor FAQ (Categorías y Contenido) ===== */
.faq-container {
  display: flex;
  gap: 0;
  background-color: var(--color-background);
  color: var(--color-foreground);
  border-radius: 16px;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

/* ===== Panel lateral (Categorías) ===== */
.faq-categories {
  background-color: var(--color-card);
  border-right: 1px solid var(--color-border);
  background: var(--color-card);
  padding: 0;
  width: 280px;
  flex-shrink: 0;
}

.category-title{
  color: var(--color-primary);
}

.faq-categories .category-title {
  margin: 0;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  border-bottom: 1px solid var(--color-border);
}

.faq-categories ul {
  list-style: none;
  padding: 0;
}

.faq-categories li {
  padding: 0;
  margin: 0;
  cursor: pointer;
  background-color: transparent;
  color: var(--color-foreground);
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s ease;
  position: relative;
  /*overflow: hidden;*/
}



.faq-categories li:last-child {
  border-bottom: none;
}

.category-content {
  display: block;
  padding: 1rem 1.5rem;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.faq-categories li:hover .category-content {
  background-color: var(--color-primary);
  font-weight: 600;
}

.faq-categories li.active {
  background: linear-gradient(90deg, 
    rgba(243, 156, 18, 0.2) 0%, 
    rgba(243, 156, 18, 0.05) 100%
  );
  color: var(--color-primary); /* texto naranja */
  font-weight: 600;
  border-left: solid var(--color-primary); /* borde naranja grueso */
}

/* ===== Contenido principal ===== */
.faq-content {
  flex: 1;
  background-color: var(--colo-card);
  border: none;
  border-radius: 0;
  padding: 1.5rem 2rem;
  overflow: hidden;
}

.faq-content h2 {
  color: var(--color-foreground);
  font-size: 1.4rem;
  margin-bottom: 1rem;
}

/* Estilos de las preguntas (Acordeón) */
.faq-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.faq-item {
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background-color: var(--color-card); 
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  margin: 10px;

}

.faq-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, 
    var(--color-primary), 
    var(--color-primary) 
  );
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 0.4s ease;
}

.faq-item:hover::before {
  transform: scaleY(1);
}

.faq-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 2px 10px rgba(243, 156, 18, 0.25); /* sombra naranja */
}

.faq-question {
  padding: 1rem;
  cursor: pointer;
  position: relative;
  font-weight: 500;
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.faq-question.open{
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.faq-question.open .question-text {
  color: var(--color-primary);
}
.question-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.question-text {
  flex: 1;
  margin-right: 1rem;
}

.question-text:hover {
  color: var(--chart-1);
}

/* --- Flechas mejoradas --- */
.arrow {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
}

.arrow-icon {
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.3s ease;
  color: var(--color-muted-foreground);
  display: inline-block;
}

.arrow:hover .arrow-icon {
  color: var(--color-primary);
}

.arrow-hover {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--color-accent);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.3s ease;
}


.arrow.open .arrow-icon {
  transform: rotate(180deg) scale(1.2);
  color: var(--color-primary);
  filter: drop-shadow(0 0 8px rgba(243, 156, 18, 0.6)); /* glow */
}

.faq-answer {
  padding: 0 1.2rem;
  color: var(--color-muted-foreground); /* en vez de var(--color-muted) */
  line-height: 1.7; /* mejor legibilidad */
  overflow: hidden;
  
  /* Agregar fondo diferenciado */
  background-color: rgba(0, 150, 250, 0.03); /* azul muy sutil */
}

.answer-inner {
  padding: 1rem 0;
  border-top: 2px solid var(--color-primary); /* más grueso */
  /* Agregar gradiente en el borde */
  border-image: linear-gradient(
    to right, 
    var(--color-primary), 
    var(--color-primary)
  ) 1;
}

/* ======================================= */
/* ANIMACIONES AVANZADAS Y MÁS FLUIDAS */
/* ======================================= */

/* Animación mejorada para las respuestas del acordeón principal */
.smooth-expand-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
}

.smooth-expand-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  overflow: hidden;
}

.smooth-expand-enter-from {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.smooth-expand-enter-to {
  max-height: 300px;
  opacity: 1;
  transform: translateY(0) scale(1);
}

.smooth-expand-leave-from {
  max-height: 300px;
  opacity: 1;
  transform: translateY(0) scale(1);
}

.smooth-expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-5px) scale(0.98);
}

/* Animación escalonada para las preguntas */
.staggered-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(var(--stagger-index, 0) * 0.08s);
}

.staggered-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  transition-delay: calc(var(--stagger-index, 0) * 0.05s);
}

.staggered-fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.staggered-fade-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.staggered-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.staggered-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.staggered-fade-move {
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Animación para respuestas superiores */
.staggered-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transition-delay: calc(var(--stagger-index, 0) * 0.1s);
}

.staggered-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53);
  transition-delay: calc(var(--stagger-index, 0) * 0.05s);
}

.staggered-slide-enter-from {
  max-height: 0;
  opacity: 0;
  transform: translateY(-15px) scale(0.95);
}

.staggered-slide-enter-to {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0) scale(1);
}

.staggered-slide-leave-from {
  max-height: 200px;
  opacity: 1;
  transform: translateY(0) scale(1);
}

.staggered-slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.staggered-slide-move {
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Animación para cambio de categorías */
.fade-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* ======================================= */
/* MEDIA QUERIES (RESPONSIVO) */
/* ======================================= */

/* Pantallas Medianas y Pequeñas (max-width: 900px) */
@media (max-width: 900px) {
  .faq-page-wrapper {
      padding: 1rem;
      margin-top:1rem;
  }

  .faq-container {
    flex-direction: column;
    border: none;
    overflow: visible;
  }
  
  .top-buttons {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .top-button {
    flex-basis: 100%;
    min-height: 60px;
  }

  .button-content {
    padding: 1rem 0.8rem;
  }
  
  .faq-categories {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
    border-radius: 12px 12px 0 0;
  }

  .faq-categories ul {
    display: flex;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-border);
  }

  .faq-categories li {
    flex-shrink: 0;
    border-bottom: none;
    border-right: 1px solid var(--color-border);
  }

  .category-content {
    padding: 0.75rem 1rem;
    white-space: nowrap;
  }
  
  .faq-categories li:last-child {
    border-right: none;
  }
  
  .faq-categories .category-title {
    display: none;
  }
  
  .faq-content {
    border-radius: 0 0 12px 12px;
    border: 1px solid var(--color-border);
    margin-top: 1rem;
    padding: 1rem;
  }
  
  .faq-content h2 {
    font-size: 1.2rem;
  }
  
  .faq-question {
    font-size: 0.95rem;
    padding: 0.8rem;
  }
  
  .faq-answer {
    padding: 0 0.8rem;
    font-size: 0.9rem;
  }

  .category-indicator {
    display: none;
  }
}

/* === EFECTO CAPYGAMING AL INTERACTUAR === */

/* Cuando el usuario hace clic y la pregunta está abierta */
.faq-item.active {
  border: 1px solid #ff8c32; /* borde naranja */
  background-color: rgba(255, 140, 50, 0.08); /* fondo naranja sutil */
  transition: all 0.3s ease;
}

/* El texto de la pregunta se vuelve naranja */
.faq-item.active .faq-question {
  color: #ff8c32;
  transition: color 0.3s ease;
}

/* Flecha (icono ▼ o ▾) animada y naranja cuando está abierta */
.arrow {
  transition: transform 0.3s ease, color 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
  color: #ff8c32;
}


/* Pantallas Móviles Pequeñas (max-width: 500px) */
@media (max-width: 500px) {
    .faq-page-wrapper {
        padding: 1rem;
        margin-top:1rem;
    }
    
    .top-title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .top-button {
        font-size: 0.9rem;
    }
    
    .top-answer .answer-content {
        padding: 1rem;
        font-size: 0.9rem;
    }

    .faq-item:hover {
        transform: none;
        box-shadow: none;
    }
}
</style>