<template>
  <div class="auth-modal-content">
    <h1>Recuperar contraseña - DEBUG</h1>
    <p class="subtitle">
      Estado: loading={{ loading }}, successMessage={{ successMessage }}
    </p>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model="email"
          placeholder="ejemplo@mail.com"
          autocomplete="email"
          required
        />
        <p>Email value: "{{ email }}"</p>
        <p v-if="error" class="error">Error: {{ error }}</p>
        <p v-if="successMessage" class="success">Success: {{ successMessage }}</p>
      </div>

      <button class="btn primary" type="submit">
        <span>Enviar código</span>
      </button>

      <p class="alt">
        ¿Recordaste tu contraseña?
        <a class="link" href="#" @click.prevent="goToLogin">Iniciar sesión</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue'

const emit = defineEmits(['switch-view', 'show-reset-form'])

const email = ref('')
const error = ref('')
const loading = ref(false)
const successMessage = ref('')

onMounted(() => {
  console.log('🔧 RecuperarContra mounted - Estado inicial:')
  console.log('email:', email.value)
  console.log('loading:', loading.value)
  console.log('successMessage:', successMessage.value)
})

function validate() {
  console.log('📝 Validando email:', email.value)
  if (!email.value.includes('@')) {
    error.value = 'Ingresá un email válido'
    return false
  }
  error.value = ''
  return true
}

async function onSubmit() {
  console.log('🚀 onSubmit ejecutado')
  if (!validate()) return
  
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    console.log('📤 Enviando solicitud para:', email.value)
    // Simulación temporal
    await new Promise(resolve => setTimeout(resolve, 1000))
    successMessage.value = 'Código enviado (simulación)'
  } catch (err) {
    console.error('💥 Error:', err)
    error.value = 'Error: ' + err.message
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
  background-color: white;
  border-radius: 8px;
}

h1 {
  margin:0 0 .5rem;
  font-weight:700; font-size:1.6rem;
  color: #F39C12;
  text-align:center;
}
.subtitle {
  font-size:.95rem;
  color: #666;
  margin: 0 0 1.2rem;
  text-align:center;
}
.field { margin-bottom: 1rem; text-align:left; }
label { display:block; font-weight:700; margin-bottom:.35rem; color: #333; }

input {
  width:100%;
  padding:.75rem .9rem;
  border-radius:10px;
  border:1px solid #ccc;
  background: white;
  color: #333;
  outline: none;
  font-size: 16px; /* Evita zoom en iOS */
}
input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52,152,219,.25);
}

button.btn {
  width:100%;
  padding:.9rem 1rem;
  border-radius:12px;
  border:none;
  background: #F39C12;
  color: white;
  font-weight:700; 
  cursor:pointer;
  font-size: 16px;
}
button.btn:hover { background: #e67e22; }
button.btn:active { transform: scale(0.98); }

.error { margin:.35rem 0 0; color: #e74c3c; font-size:.9rem; }
.success { margin:.35rem 0 0; color: #27ae60; font-size:.9rem; }
.alt { margin-top:1rem; text-align:center; color: #666; }
.link { color: #3498db; text-decoration:none; }
.link:hover { text-decoration: underline; }
</style>