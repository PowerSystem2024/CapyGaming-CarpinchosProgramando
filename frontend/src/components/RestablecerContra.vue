<template>
  <div class="auth-modal-content">
    <h1>Restablecer contraseña</h1>
    <p class="subtitle">Ingresá el código que recibiste y tu nueva contraseña</p>
    
    <form @submit.prevent="onSubmit" novalidate>
      <!-- Campo para el código -->
      <div class="field">
        <label for="code">Código de verificación</label>
        <input
          id="code"
          type="text"
          v-model.trim="form.code"
          placeholder="123456"
          maxlength="6"
          required
        />
        <p v-if="errors.code" class="error">{{ errors.code }}</p>
      </div>

      <!-- Nueva contraseña -->
      <div class="field">
        <label for="password">Nueva contraseña</label>
        <div class="password-row">
          <input
            id="password"
            :type="showPass ? 'text' : 'password'"
            v-model="form.password"
            minlength="6"
            autocomplete="new-password"
            required
          />
          <button class="ghost" type="button" @click="showPass = !showPass">
            {{ showPass ? 'Ocultar' : 'Mostrar' }}
          </button>
        </div>
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <!-- Confirmar contraseña -->
      <div class="field">
        <label for="confirm">Confirmar nueva contraseña</label>
        <input
          id="confirm"
          :type="showPass ? 'text' : 'password'"
          v-model="form.confirm"
          minlength="6"
          autocomplete="new-password"
          required
        />
        <p v-if="errors.confirm" class="error">{{ errors.confirm }}</p>
      </div>

      <button class="btn primary" :disabled="loading">
        <span v-if="loading">Restableciendo...</span>
        <span v-else>Restablecer contraseña</span>
      </button>

      <p class="alt">
        <a class="link" href="#" @click.prevent="goToLogin">Volver al inicio de sesión</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, defineEmits, defineProps } from 'vue'

// Props para recibir el email del formulario anterior
const props = defineProps({
  userEmail: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['switch-view'])

const form = reactive({
  code: '',
  password: '',
  confirm: ''
})

const errors = reactive({
  code: '',
  password: '',
  confirm: ''
})

const showPass = ref(false)
const loading = ref(false)

function validate() {
  errors.code = ''
  errors.password = ''
  errors.confirm = ''
  
  let isValid = true

  if (form.code.length !== 6) {
    errors.code = 'El código debe tener 6 dígitos'
    isValid = false
  }

  if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres'
    isValid = false
  }

  if (form.confirm !== form.password) {
    errors.confirm = 'Las contraseñas no coinciden'
    isValid = false
  }

  return isValid
}

async function onSubmit() {
  if (!validate()) return
  
  loading.value = true
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: props.userEmail,  // ← Usar el email del props
        code: form.code,         // ← Usar código en lugar de token
        newPassword: form.password
      }),
    })

    const data = await response.json()

    if (response.ok) {
      alert('Contraseña restablecida exitosamente')
      emit('switch-view', 'login')
    } else {
      alert(data.error || 'Error al restablecer la contraseña')
    }
  } catch (error) {
    alert('Error de conexión: ' + error.message)
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
  border-radius: 8px;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  box-sizing: border-box;
}

h1 {
  margin: 0 0 .5rem;
  font-weight: 700;
  font-size: 1.6rem;
  color: #F39C12;
  text-align: center;
  background-color: var(--color-card);
}

.subtitle {
  font-size: .95rem;
  color: white;
  margin: 0 0 1.2rem;
  text-align: center;
  background-color: var(--color-card);
}

.field {
  margin-bottom: 1rem;
  text-align: left;
  background-color: var(--color-card);
}

label {
  display: block;
  font-weight: 700;
  margin-bottom: .35rem;
  color: var(--color-accent-foreground);
  background-color: var(--color-card);
}

input {
  width: 100%;
  padding: .75rem .9rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: var(--color-popover);
  color: white;
  outline: none;
  font-size: 16px;
  box-sizing: border-box;
}

input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52,152,219,.25);
}

.password-row {
  display: flex;
  gap: .5rem;
  align-items: center;
  background-color: var(--color-card);
}

.password-row input {
  flex: 1;
}

button.btn {
  width:100%;
  padding:.9rem 1rem;
  border-radius:12px;
  border:1px solid var(--color-border);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  font-weight:700; 
  cursor:pointer;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

button.btn:hover { filter:brightness(1.05); }
button.btn:disabled { opacity:.6; cursor:not-allowed; }

button.ghost{
  border:1px solid var(--color-border);
  background: var(--color-muted);
  color: var(--color-accent-foreground);
  border-radius:10px;
  padding:.6rem .8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.error {
  margin: .35rem 0 0;
  color: #e74c3c;
  font-size: .9rem;
  background-color: var(--color-card);
}

.alt {
  margin-top: 1rem;
  text-align: center;
  color: #666;
  background-color: var(--color-card);
}

.link {
  color: #3498db;
  text-decoration: none;
  background-color: var(--color-card);
}

.link:hover {
  text-decoration: underline;
}

span {
  background-color: var(--color-primary);
}

form {
  background-color: var(--color-card);
}

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
  
  button.ghost {
    padding: 0.7rem 0.9rem;
    font-size: 0.9rem;
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
  
  button.ghost {
    padding: 0.55rem 0.75rem;
    font-size: 0.85rem;
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
  
  label {
    font-size: 0.9rem;
    margin-bottom: 0.3rem;
  }
  
  input {
    padding: 0.7rem 0.85rem;
    font-size: 0.95rem;
    border-radius: 8px;
  }
  
  button.btn {
    padding: 0.85rem 1rem;
    font-size: 0.95rem;
    border-radius: 10px;
  }
  
  button.ghost {
    padding: 0.5rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .error {
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
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }
  
  input {
    padding: 0.65rem 0.8rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }
  
  .password-row {
    gap: 0.4rem;
  }
  
  button.btn {
    padding: 0.8rem 0.9rem;
    font-size: 0.9rem;
    border-radius: 10px;
  }
  
  button.ghost {
    padding: 0.45rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 6px;
  }
  
  .error {
    font-size: 0.8rem;
    margin-top: 0.25rem;
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
  
  button.ghost {
    padding: 0.4rem 0.45rem;
    font-size: 0.7rem;
  }
  
  .alt {
    font-size: 0.8rem;
  }
}
</style>