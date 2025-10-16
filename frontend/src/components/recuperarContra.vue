[file name]: recuperarContra.vue
<template>
  <div class="auth-modal-content">
    <h1>Recuperar contraseña</h1>
    <p class="subtitle">
      Ingresá tu email y te enviaremos instrucciones para restablecer tu contraseña.
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
        />
        <p v-if="error" class="error">{{ error }}</p>
      </div>

      <button class="btn primary" :disabled="loading">
        <span v-if="loading">Enviando...</span>
        <span v-else>Enviar enlace</span>
      </button>

      <!-- CAMBIO: router-link → link con evento -->
      <p class="alt">
        ¿Recordaste tu contraseña?
        <a class="link" href="#" @click.prevent="goToLogin">Iniciar sesión</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue'

// AGREGAR: Emits para comunicación con el modal
const emit = defineEmits(['switch-view'])

const email   = ref('')
const error   = ref('')
const loading = ref(false)

function validate () {
  if (!email.value.includes('@')) {
    error.value = 'Ingresá un email válido'
    return false
  }
  error.value = ''
  return true
}

async function onSubmit () {
  if (!validate()) return
  loading.value = true
  try {
    // Simulación: enviar email
    await new Promise(r => setTimeout(r, 1000))
    alert(`Se envió un enlace de recuperación a: ${email.value}`)
    email.value = ''
    // OPCIONAL: ir al login después del éxito
    emit('switch-view', 'login')
  } finally {
    loading.value = false
  }
}

// AGREGAR: Función para cambiar a login
function goToLogin() {
  emit('switch-view', 'login')
}
</script>

<style scoped>
.auth-modal-content {
  padding: 2rem;
  background-color: var(--color-card);
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
.alt { margin-top:1rem; text-align:center; background-color: var(--color-card);}
.link { color: var(--color-secondary); text-decoration:none; background-color: var(--color-card); }
.link:hover { text-decoration: underline; }
</style>