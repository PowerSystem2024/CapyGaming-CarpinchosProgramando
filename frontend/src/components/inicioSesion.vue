<template>
  <div class="auth-page">
    <div class="auth-card">
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
          <router-link class="link" to="/recuperarContra">¿Olvidaste tu contraseña?</router-link>
        </div>

        <button class="btn primary" :disabled="loading">
          <span v-if="loading">Ingresando...</span>
          <span v-else>Ingresar</span>
        </button>
        <p class="alt">
          ¿No tenés cuenta?
          <router-link class="link" to="/registro">Regístrate</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

const router = useRouter()
const { login } = useAuth()

const form = reactive({ email: '', password: '', remember: false })
const errors = reactive({ email: '', password: '' })
const loading = ref(false)
const showPass = ref(false)

function validate() {
  // Limpiar errores anteriores
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
    const result = await login(form.email, form.password)

    if (result.success) {
      // Redirigir al home después del login exitoso
      router.push('/')
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
</script>

<style scoped>
/* Estructura */
.auth-page{
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  padding: 2rem;
}

.auth-card{
  width: 100%;
  max-width: 420px;
  background: var(--color-card);
  color: var(--color-card-foreground);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  padding: 2rem;
  margin: 6rem auto 3rem;
}

/* Títulos */
h1{
  margin: 0 0 1rem;
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--color-primary);
  text-align: center;
  background-color: var(--color-card);
}

/* Campos */
.field{ margin-bottom: 1rem; text-align: left; background-color: var(--color-card);}
label{ display:block; font-weight:700; margin-bottom:.35rem; color: var(--color-accent-foreground); background-color: var(--color-card);}

input{
  width:100%;
  padding:.75rem .9rem;
  border-radius:10px;
  border:1px solid var(--color-input);
  background: var(--color-popover);
  color: var(--color-popover-foreground);
  outline: none;
}
input::placeholder{ color: var(--color-muted-foreground); }
input:focus{
  border-color: var(--color-ring);
  box-shadow: 0 0 0 3px rgba(52,152,219,.25);
}

.password-row{ display:flex; gap:.5rem; align-items:center; background-color: var(--color-card);}
.password-row input{ flex: 1; }

/* Botones */
button.btn{
  width:100%;
  padding:.9rem 1rem;
  border-radius:12px;
  border:1px solid var(--color-border);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  font-weight:700;
  cursor: pointer;
}

span {
  background-color: var(--color-primary);
}

button.btn:hover{ filter: brightness(1.05); }
button.btn:disabled{ opacity:.6; cursor:not-allowed; }

button.ghost{
  border:1px solid var(--color-border);
  background: var(--color-muted);
  color: var(--color-accent-foreground);
  border-radius:10px;
  padding:.6rem .8rem;
  cursor: pointer;
}

form {
  background-color: var(--color-card);
}

p.alt{
  text-align: center;
  margin: 1rem 0 0;
  color: var(--color-popover-foreground);
  background-color: var(--color-card);
}

/* Filas auxiliares */
.row{
  display:flex; justify-content:space-between; align-items:center;
  gap:1rem; margin:.25rem 0 1rem;
  background-color: var(--color-card);
}
.link{ color: var(--color-secondary); text-decoration: none; background-color: var(--color-card); }
.link:hover{ text-decoration: underline; }

/* Errores */
.error{ margin:.35rem 0 0; color: var(--color-destructive); font-size:.9rem; background-color: var(--color-card);}
</style>