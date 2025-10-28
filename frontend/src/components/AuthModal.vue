[file name]: AuthModal.vue
<template>
  <div v-if="visible" class="modal-overlay">
    <div class="modal-content">
      <!-- Botón cerrar -->
      <button class="close-btn" @click="close">
        ×
      </button>

      <!-- Contenido dinámico -->
      <component
        :is="currentComponent"
        :key="currentView"
        @success="handleSuccess"
        @switch-view="switchView"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue'
import InicioSesion from './InicioSesion.vue'
import Registro from './Registro.vue'
import RecuperarContra from './RecuperarContra.vue'

// Props y emits
const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close', 'success'])

// Estado para controlar qué formulario mostrar
const currentView = ref('login')

// Mapeo de vistas a componentes
const components = {
  login: InicioSesion,
  register: Registro,
  forgot: RecuperarContra
}

// Componente actual basado en la vista
const currentComponent = computed(() => components[currentView.value])

// Cerrar modal
function close() {
  emit('close')
  // Resetear a login después de cerrar
  setTimeout(() => {
    currentView.value = 'login'
  }, 300)
}

// Cambiar entre formularios
function switchView(view) {
  currentView.value = view
}

// Manejar éxito de autenticación
function handleSuccess() {
  emit('success')
  close()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: var(--color-background);
  border-radius: 16px;
  max-width: 440px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease;
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-foreground);
  z-index: 10;
  transition: background-color 0.2s ease;
  font-size: 1rem;
  font-weight: bold;
  line-height: 1;
  box-sizing: border-box;
  flex-shrink: 0;
}

.close-btn:hover {
  background: var(--color-accent);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .modal-content {
    margin: 1rem;
    max-height: 95vh;
  }
  
  .close-btn {
    top: 0.5rem;
    right: 0.5rem;
    width: 32px;
    height: 32px;
    min-width: 32px;
    min-height: 32px;
    font-size: 1.2rem;
  }
}
</style>