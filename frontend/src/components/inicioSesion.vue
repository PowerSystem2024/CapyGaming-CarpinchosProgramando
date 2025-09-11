<!-- src/views/LoginView.vue -->
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
          <!-- <a class="link" href="/recuperarContra">¿Olvidaste tu contraseña?</a> -->
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

const form = reactive({ email: '', password: '', remember: false })
const errors = reactive({ email: '', password: '' })
const loading = ref(false)
const showPass = ref(false)

function validate () {
  errors.email = form.email.includes('@') ? '' : 'Ingresá un email válido'
  errors.password = form.password.length >= 6 ? '' : 'Mínimo 6 caracteres'
  return !errors.email && !errors.password
}

async function onSubmit () {
  if (!validate()) return
  loading.value = true
  try {
    // Simulación de login (frontend-only)
    await new Promise(r => setTimeout(r, 600))
    if (form.remember) {
      localStorage.setItem('auth', JSON.stringify({ email: form.email }))
    }
    // Redirigir a home o catálogo
    window.location.href = '/'
  } finally {
    loading.value = false
  }
}

function onForgot () {
  alert('Acá iría el flujo de recuperación (cuando haya backend).')
}
</script>

<style scoped>
/* Estructura */
.auth-page{
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);        /* #1C2833 */
  padding: 2rem;
}

.auth-card{
  width: 100%;
  max-width: 420px;
  background: var(--color-card);              /* #212F3C */
  color: var(--color-card-foreground);        /* #FDEBD0 */
  border: 1px solid var(--color-border);      /* #2C3E50 */
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  padding: 2rem;
}

/* Títulos */
h1{
  margin: 0 0 1rem;
  font-weight: 700;
  font-size: 1.6rem;
  color: var(--color-primary);                /* #F39C12: naranja del proyecto */
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
  border:1px solid var(--color-input);        /* #2C3E50 */
  background: var(--color-popover);           /* #212F3C */
  color: var(--color-popover-foreground);     /* #FDEBD0 */
  outline: none;
}
input::placeholder{ color: var(--color-muted-foreground); } /* #AAB7B8 */
input:focus{
  border-color: var(--color-ring);            /* #3498DB */
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
  background: var(--color-primary);           /* CTA naranja */
  color: var(--color-primary-foreground);     /* contraste sobre naranja */
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
  color: var(--color-popover-foreground);       /* #AAB7B8 */
  background-color: var(--color-card);
}

/* Filas auxiliares */
.row{
  display:flex; justify-content:space-between; align-items:center;
  gap:1rem; margin:.25rem 0 1rem;
  background-color: var(--color-card);
}
.link{ color: var(--color-secondary); text-decoration: none; background-color: var(--color-card); } /* Azul */
.link:hover{ text-decoration: underline; }

/* Errores */
.error{ margin:.35rem 0 0; color: var(--color-destructive); font-size:.9rem; background-color: var(--color-card);}
</style>