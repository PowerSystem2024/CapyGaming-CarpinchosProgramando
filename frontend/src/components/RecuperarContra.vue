<template>
  <div class="auth-modal-content">
    <h1>Recuperar contraseña</h1>
    <p class="subtitle">
      Ingresá tu email para recibir un código de recuperación
    </p>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model.trim="email"
          placeholder="ejemplo@mail.com"
          autocomplete="email"
          required
          :disabled="loading"
        />
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
      </div>

      <button class="btn primary" :disabled="loading">
        <span v-if="loading">Enviando código...</span>
        <span v-else>Enviar código</span>
      </button>

      <p class="alt">
        ¿Recordaste tu contraseña?
        <a class="link" href="#" @click.prevent="goToLogin">Iniciar sesión</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useAuth } from '../composables/useAuth.js'

const emit = defineEmits(['switch-view', 'show-reset-form'])

const { forgotPassword } = useAuth()

const email = ref('')
const error = ref('')
const loading = ref(false)
const successMessage = ref('')

function validate() {
  if (!email.value.includes('@')) {
    error.value = 'Ingresá un email válido'
    return false
  }
  error.value = ''
  return true
}

async function onSubmit() {
  if (!validate()) return
  
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const result = await forgotPassword(email.value)

    if (result.success) {
      successMessage.value = result.message || 'Código enviado a tu email'
      // Emitir evento para mostrar el formulario de reset
      setTimeout(() => {
        emit('show-reset-form', email.value)
      }, 2000)
    } else {
      // Manejar diferentes tipos de errores
      if (result.error === 'EMAIL_NOT_FOUND') {
        error.value = 'No existe una cuenta asociada a este email'
      } else {
        error.value = result.error || 'Error al enviar el código'
      }
    }
  } catch (err) {
    console.error('💥 Error en recuperación:', err)
    error.value = 'Error de conexión: ' + err.message
  } finally {
    loading.value = false
  }
}

function goToLogin() {
  emit('switch-view', 'login')
}
</script>

<style scoped>
.auth-modal-content {
  padding: 2rem;
  background-color: var(--color-card);
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
}

.auth-page {
  min-height: 100vh;
  display:flex; align-items:center; justify-content:center;
  background: var(--color-background);
  padding: 2rem;
}
.auth-card {
  width:100%; max-width: 420px;
  background: var(--color-card);
  color: var(--color-card-foreground);
  border:1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  padding: 2rem;
}
h1 {
  margin:0 0 .5rem;
  font-weight:700; font-size:1.6rem;
  color: var(--color-primary);
  text-align:center;
  background-color: var(--color-card);
}
.subtitle {
  font-size:.95rem;
  color: var(--color-muted-foreground);
  margin: 0 0 1.2rem;
  text-align:center;
  background-color: var(--color-card);
}
.field { margin-bottom: 1rem; text-align:left; background-color: var(--color-card); }
label { display:block; font-weight:700; margin-bottom:.35rem; color: var(--color-accent-foreground); background-color: var(--color-card); }

input {
  width:100%;
  padding:.75rem .9rem;
  border-radius:10px;
  border:1px solid var(--color-input);
  background: var(--color-popover);
  color: var(--color-popover-foreground);
  background-color: var(--color-card);
  box-sizing: border-box;
}
input::placeholder { color: var(--color-muted-foreground); }
input:focus {
  border-color: var(--color-ring);
  box-shadow: 0 0 0 3px rgba(52,152,219,.25);
}

button.btn {
  width:100%;
  padding:.9rem 1rem;
  border-radius:12px;
  border:1px solid var(--color-border);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  font-weight:700; cursor:pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
}
button.btn:hover { filter:brightness(1.05); }
button.btn:disabled { opacity:.6; cursor:not-allowed; }

form {
  background-color: var(--color-card);
}

span {
  background-color: var(--color-primary);
}

.error { margin:.35rem 0 0; color: var(--color-destructive); font-size:.9rem; background-color: var(--color-card);}
.success { margin:.35rem 0 0; color: var(--color-success); font-size:.9rem; background-color: var(--color-card); padding: 0.5rem; border-radius: 5px; border: 1px solid var(--color-success);}
.alt { margin-top:1rem; text-align:center; background-color: var(--color-card);}
.link { color: var(--color-secondary); text-decoration:none; background-color: var(--color-card); }
.link:hover { text-decoration: underline; }

/* Media Queries para Responsive */

/* Pantallas grandes (desktops, 1200px en adelante) */
@media (min-width: 1200px) {
  .auth-modal-content {
    padding: 2.5rem;
    max-width: 450px;
  }
  
  h1 {
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
  }
  
  .subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .field {
    margin-bottom: 1.25rem;
  }
  
  input {
    padding: 0.85rem 1rem;
    font-size: 1rem;
  }
  
  button.btn {
    padding: 1rem 1.25rem;
    font-size: 1.05rem;
  }
  
  .alt {
    margin-top: 1.25rem;
    font-size: 0.95rem;
  }
}

/* Pantallas medianas (tablets, 768px a 1199px) */
@media (max-width: 1199px) and (min-width: 768px) {
  .auth-modal-content {
    padding: 2rem;
    max-width: 420px;
  }
  
  h1 {
    font-size: 1.7rem;
  }
  
  .subtitle {
    font-size: 0.95rem;
  }
  
  input {
    padding: 0.8rem 0.95rem;
  }
  
  button.btn {
    padding: 0.95rem 1.1rem;
  }
}

/* Pantallas pequeñas (móviles grandes, 576px a 767px) */
@media (max-width: 767px) and (min-width: 576px) {
  .auth-modal-content {
    padding: 1.75rem;
    max-width: 380px;
  }
  
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.4rem;
  }
  
  .subtitle {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
  
  .field {
    margin-bottom: 0.9rem;
  }
  
  input {
    padding: 0.7rem 0.85rem;
    font-size: 0.95rem;
  }
  
  button.btn {
    padding: 0.85rem 1rem;
    font-size: 0.95rem;
  }
  
  .error, .success {
    font-size: 0.85rem;
  }
  
  .alt {
    margin-top: 0.9rem;
    font-size: 0.9rem;
  }
}

/* Pantallas muy pequeñas (móviles, hasta 575px) */
@media (max-width: 575px) {
  .auth-modal-content {
    padding: 1.5rem;
    max-width: 100%;
    margin: 0 auto;
  }
  
  h1 {
    font-size: 1.4rem;
    margin-bottom: 0.35rem;
  }
  
  .subtitle {
    font-size: 0.85rem;
    margin-bottom: 0.9rem;
    line-height: 1.4;
  }
  
  .field {
    margin-bottom: 0.8rem;
  }
  
  label {
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
  
  input {
    padding: 0.65rem 0.8rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  button.btn {
    padding: 0.8rem 0.9rem;
    font-size: 0.9rem;
    border-radius: 10px;
  }
  
  .error, .success {
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  
  .success {
    padding: 0.4rem;
  }
  
  .alt {
    margin-top: 0.8rem;
    font-size: 0.85rem;
  }
  
  .link {
    font-size: 0.85rem;
  }
}

/* Pantallas extra pequeñas (móviles muy pequeños, hasta 380px) */
@media (max-width: 380px) {
  .auth-modal-content {
    padding: 1.25rem;
  }
  
  h1 {
    font-size: 1.3rem;
  }
  
  .subtitle {
    font-size: 0.8rem;
  }
  
  input {
    padding: 0.6rem 0.75rem;
    font-size: 0.85rem;
  }
  
  button.btn {
    padding: 0.75rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .alt {
    font-size: 0.8rem;
  }
}
</style>