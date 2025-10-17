[file name]: RestablecerContra.vue
<template>
  <div class="auth-modal-content">
    <h1>Restablecer contraseña</h1>
    
    <form @submit.prevent="onSubmit" novalidate>
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
import { reactive, ref, defineEmits, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const emit = defineEmits(['switch-view'])
const route = useRoute()
const router = useRouter()

const form = reactive({
  password: '',
  confirm: ''
})

const errors = reactive({
  password: '',
  confirm: ''
})

const showPass = ref(false)
const loading = ref(false)
const token = ref('')

onMounted(() => {
  token.value = route.query.token
  if (!token.value) {
    alert('Token de recuperación inválido')
    emit('switch-view', 'login')
  }
})

function validate() {
  errors.password = ''
  errors.confirm = ''
  
  let isValid = true

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
        token: token.value,
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
}

/* Usar los mismos estilos que los otros formularios */
</style>