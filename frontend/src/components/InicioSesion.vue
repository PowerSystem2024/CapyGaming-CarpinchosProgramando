<template>
  <div class="auth-modal-content">
    <h1>Iniciar sesión</h1>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          v-model.trim="form.email"
          placeholder="ejemplo@mail.com"
          required
        />
        <p v-if="errors.email" class="error">{{ errors.email }}</p>
      </div>

      <div class="field">
        <label for="password">Contraseña</label>
        <div class="password-row">
          <input
            id="password"
            :type="showPass ? 'text' : 'password'"
            v-model="form.password"
            minlength="6"
            required
          />
          <button class="ghost" type="button" @click="showPass = !showPass">
            {{ showPass ? 'Ocultar' : 'Mostrar' }}
          </button>
        </div>
        <p v-if="errors.password" class="error">{{ errors.password }}</p>
      </div>

      <div class="row">
        <label class="checkbox">
          <input type="checkbox" v-model="form.remember" />
          Recordarme
        </label>
        <!-- CAMBIO: router-link → link con evento -->
        <a class="link" href="#" @click.prevent="goToForgot">¿Olvidaste tu contraseña?</a>
      </div>

      <button class="btn primary" :disabled="loading">
        <span v-if="loading">Ingresando...</span>
        <span v-else>Ingresar</span>
      </button>
      
      <!-- CAMBIO: router-link → link con evento -->
      <p class="alt">
        ¿No tenés cuenta?
        <a class="link" href="#" @click.prevent="goToRegister">Regístrate</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, defineEmits } from 'vue'
import { useAuth } from '../composables/useAuth.js' // ← AGREGAR ESTO

// AGREGAR: Emits para comunicación con el modal
const emit = defineEmits(['success', 'switch-view'])

// AGREGAR: Usar el composable de autenticación
const { login } = useAuth()

const form = reactive({ email: '', password: '', remember: false })
const errors = reactive({ email: '', password: '' })
const loading = ref(false)
const showPass = ref(false)

function validate() {
  errors.email = ''
  errors.password = ''
  
  let isValid = true

  if (!form.email.includes('@')) {
    errors.email = 'Ingresá un email válido'
    isValid = false
  }

  if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres'
    isValid = false
  }

  return isValid
}

async function onSubmit() {
  if (!validate()) return
  
  loading.value = true
  
  try {
    // Usar el servicio real de login
    const result = await login(form.email, form.password)

    if (result.success) {
      // Guardar en localStorage si eligió "Recordarme"
      if (form.remember) {
        localStorage.setItem('rememberMe', 'true')
      }
      emit('success')
    } else {
      // Mostrar error específico del backend
      if (result.error.includes('Credenciales inválidas')) {
        errors.email = 'Email o contraseña incorrectos'
        errors.password = 'Email o contraseña incorrectos'
      } else {
        alert(result.error)
      }
    }
  } catch (error) {
    alert('Error de conexión: ' + error.message)
  } finally {
    loading.value = false
  }
}

// AGREGAR: Funciones para cambiar entre formularios
function goToRegister() {
  emit('switch-view', 'register')
}

function goToForgot() {
  emit('switch-view', 'forgot')
}
</script>

<style scoped>
.auth-modal-content {
  padding: 2rem;
  background-color: var(--color-card);
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Estructura */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  padding: 2rem;
  box-sizing: border-box;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--color-card);
  color: var(--color-card-foreground);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  padding: 2rem;
  margin: 6rem auto 3rem;
  box-sizing: border-box;
}

/* Títulos */
h1 {
  margin: 0 0 1rem;
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--color-primary);
  text-align: center;
  background-color: var(--color-card);
}

/* Campos */
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
  border: 1px solid var(--color-input);
  background: var(--color-popover);
  color: var(--color-popover-foreground);
  outline: none;
  box-sizing: border-box;
  font-size: 1rem;
}

input::placeholder {
  color: var(--color-muted-foreground);
}

input:focus {
  border-color: var(--color-ring);
  box-shadow: 0 0 0 3px rgba(52,152,219,.25);
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

/* Botones */
button.btn {
  width: 100%;
  padding: .9rem 1rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  font-weight: 700;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

span {
  background-color: var(--color-primary);
}

button.btn:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

button.btn:disabled {
  opacity: .6;
  cursor: not-allowed;
  transform: none;
}

button.ghost {
  border: 1px solid var(--color-border);
  background: var(--color-muted);
  color: var(--color-accent-foreground);
  border-radius: 10px;
  padding: .6rem .8rem;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.3s ease;
}

button.ghost:hover {
  background: var(--color-accent);
}

form {
  background-color: var(--color-card);
}

p.alt {
  text-align: center;
  margin: 1rem 0 0;
  color: var(--color-popover-foreground);
  background-color: var(--color-card);
  font-size: 1rem;
}

/* Filas auxiliares */
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin: .25rem 0 1rem;
  background-color: var(--color-card);
  flex-wrap: wrap;
}

.link {
  color: var(--color-secondary);
  text-decoration: none;
  background-color: var(--color-card);
  transition: color 0.3s ease;
}

.link:hover {
  text-decoration: underline;
  color: var(--color-ring);
}

/* Errores */
.error {
  margin: .35rem 0 0;
  color: var(--color-destructive);
  font-size: .9rem;
  background-color: var(--color-card);
}

/* ===== RESPONSIVE DESIGN ===== */

/* Pantallas grandes (1200px+) - Ya está optimizado */

/* Tablets y pantallas medianas (768px - 1199px) */
@media (max-width: 1199px) {
  .auth-modal-content {
    padding: 1.8rem;
    max-width: 380px;
  }

  .auth-card {
    max-width: 380px;
    padding: 1.8rem;
    margin: 5rem auto 2.5rem;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.9rem;
  }

  input {
    padding: 0.7rem 0.8rem;
    font-size: 0.95rem;
  }

  button.btn {
    padding: 0.8rem 0.9rem;
    font-size: 0.95rem;
  }

  button.ghost {
    padding: 0.55rem 0.7rem;
    font-size: 0.85rem;
  }

  .row {
    gap: 0.8rem;
    margin: 0.2rem 0 0.9rem;
  }
}

/* Tablets pequeñas (600px - 767px) */
@media (max-width: 767px) {
  .auth-modal-content {
    padding: 1.5rem;
    max-width: 340px;
  }

  .auth-page {
    padding: 1.5rem;
  }

  .auth-card {
    max-width: 340px;
    padding: 1.5rem;
    margin: 4rem auto 2rem;
    border-radius: 14px;
  }

  h1 {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
  }

  .field {
    margin-bottom: 0.9rem;
  }

  input {
    padding: 0.65rem 0.75rem;
    font-size: 0.9rem;
    border-radius: 8px;
  }

  button.btn {
    padding: 0.75rem 0.8rem;
    font-size: 0.9rem;
    border-radius: 10px;
  }

  button.ghost {
    padding: 0.5rem 0.6rem;
    font-size: 0.8rem;
    border-radius: 8px;
  }

  .password-row {
    gap: 0.4rem;
  }

  .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    margin: 0.2rem 0 0.8rem;
  }

  .checkbox {
    order: 1;
  }

  .link {
    order: 2;
    align-self: flex-end;
  }

  p.alt {
    font-size: 0.95rem;
    margin: 0.8rem 0 0;
  }

  .error {
    font-size: 0.85rem;
  }
}

/* Móviles (480px - 599px) */
@media (max-width: 599px) {
  .auth-modal-content {
    padding: 1.2rem;
    max-width: 300px;
  }

  .auth-page {
    padding: 1rem;
  }

  .auth-card {
    max-width: 300px;
    padding: 1.2rem;
    margin: 3rem auto 1.5rem;
    border-radius: 12px;
  }

  h1 {
    font-size: 1.3rem;
    margin-bottom: 0.7rem;
  }

  input {
    padding: 0.6rem 0.7rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }

  button.btn {
    padding: 0.7rem 0.75rem;
    font-size: 0.85rem;
    border-radius: 8px;
  }

  button.ghost {
    padding: 0.45rem 0.55rem;
    font-size: 0.75rem;
  }

  .field {
    margin-bottom: 0.8rem;
  }

  .row {
    margin: 0.15rem 0 0.7rem;
  }

  p.alt {
    font-size: 0.9rem;
    margin: 0.7rem 0 0;
  }

  .error {
    font-size: 0.8rem;
  }
}

/* Móviles pequeños (hasta 479px) */
@media (max-width: 479px) {
  .auth-modal-content {
    padding: 1rem;
    max-width: 280px;
    border-radius: 10px;
  }

  .auth-page {
    padding: 0.8rem;
  }

  .auth-card {
    max-width: 280px;
    padding: 1rem;
    margin: 2rem auto 1rem;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,.2);
  }

  h1 {
    font-size: 1.2rem;
    margin-bottom: 0.6rem;
  }

  input {
    padding: 0.55rem 0.6rem;
    font-size: 0.8rem;
  }

  button.btn {
    padding: 0.65rem 0.7rem;
    font-size: 0.8rem;
    min-height: 44px;
  }

  button.ghost {
    padding: 0.4rem 0.5rem;
    font-size: 0.7rem;
    min-height: 40px;
  }

  .password-row {
    gap: 0.3rem;
  }

  .row {
    margin: 0.1rem 0 0.6rem;
  }

  p.alt {
    font-size: 0.85rem;
    margin: 0.6rem 0 0;
  }

  .error {
    font-size: 0.75rem;
  }
}

/* Ajustes para pantallas muy grandes (más de 1600px) */
@media (min-width: 1600px) {
  .auth-modal-content {
    max-width: 460px;
    padding: 2.5rem;
  }

  .auth-card {
    max-width: 460px;
    padding: 2.5rem;
    margin: 7rem auto 4rem;
  }

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1.2rem;
  }

  input {
    padding: 0.9rem 1rem;
    font-size: 1.1rem;
  }

  button.btn {
    padding: 1rem 1.2rem;
    font-size: 1.1rem;
  }
}
</style>