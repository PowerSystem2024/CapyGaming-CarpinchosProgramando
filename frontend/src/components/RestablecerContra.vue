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
  background-color: white;
  border-radius: 8px;
}

h1 {
  margin: 0 0 .5rem;
  font-weight: 700;
  font-size: 1.6rem;
  color: #F39C12;
  text-align: center;
}

.subtitle {
  font-size: .95rem;
  color: #666;
  margin: 0 0 1.2rem;
  text-align: center;
}

.field {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  font-weight: 700;
  margin-bottom: .35rem;
  color: #333;
}

input {
  width: 100%;
  padding: .75rem .9rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: white;
  color: #333;
  outline: none;
  font-size: 16px;
}

input:focus {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52,152,219,.25);
}

.password-row {
  display: flex;
  gap: .5rem;
  align-items: center;
}

.password-row input {
  flex: 1;
}

button.btn {
  width: 100%;
  padding: .9rem 1rem;
  border-radius: 12px;
  border: none;
  background: #F39C12;
  color: white;
  font-weight: 700;
  cursor: pointer;
  font-size: 16px;
}

button.btn:hover {
  background: #e67e22;
}

button.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}

button.ghost {
  border: 1px solid #ddd;
  background: #f8f9fa;
  color: #333;
  border-radius: 10px;
  padding: .6rem .8rem;
  cursor: pointer;
  white-space: nowrap;
}

.error {
  margin: .35rem 0 0;
  color: #e74c3c;
  font-size: .9rem;
}

.alt {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

.link {
  color: #3498db;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>