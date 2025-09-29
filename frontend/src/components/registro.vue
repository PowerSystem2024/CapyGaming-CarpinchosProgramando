[file name]: registro.vue
[file content begin]
<template>
  <div class="auth-modal-content">
    <h1>Crear cuenta</h1>

    <form @submit.prevent="onSubmit" novalidate>
      <!-- ... todos los campos se mantienen igual ... -->
      <div class="field">
        <label for="name">Nombre y apellido</label>
        <input
          id="name"
          type="text"
          v-model.trim="form.name"
          placeholder="ej: Ana Pérez"
          autocomplete="name"
        />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div class="field">
        <label for="email">Email</label>
        <div class="input-row">
          <input
            id="email"
            type="email"
            v-model.trim="form.email"
            placeholder="ejemplo@mail.com"
            autocomplete="email"
            required
          />
        </div>
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
        <label for="confirm">Confirmar contraseña</label>
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

      <div class="form-group">
        <label for="telefono">Teléfono</label>
        <input
          type="text"
          id="telefono"
          class="phone-number-input"
          v-model="form.telefono"
          required
          placeholder="Ingrese su número de teléfono"
        />
        <p v-if="errors.telefono" class="error">{{ errors.telefono }}</p>
      </div>

      <div class="form-group">
        <label for="dni">DNI</label>
        <input
          type="text"
          id="dni"
          v-model="form.dni"
          required
          placeholder="Ingrese su DNI"
        />
        <p v-if="errors.dni" class="error">{{ errors.dni }}</p>
      </div>

      <div class="form-group">
        <label for="direccion">Dirección</label>
        <input
          type="text"
          id="direccion"
          v-model="form.direccion"
          required
          placeholder="Ingrese su dirección"
        />
        <p v-if="errors.direccion" class="error">{{ errors.direccion }}</p>
      </div>

      <label class="checkbox">
        <input type="checkbox" v-model="form.accept" />
        Acepto los términos y condiciones
      </label>
      <p v-if="errors.accept" class="error">{{ errors.accept }}</p>

      <button class="btn primary" :disabled="loading">
        <span v-if="loading">Creando cuenta...</span>
        <span v-else>Registrarme</span>
      </button>

      <!-- CAMBIO: router-link → link con evento -->
      <p class="alt">
        ¿Ya tenés cuenta?
        <a class="link" href="#" @click.prevent="goToLogin">Iniciar sesión</a>
      </p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, defineEmits } from 'vue'
import { useAuth } from '../composables/useAuth.js'

// AGREGAR: Emits para comunicación con el modal
const emit = defineEmits(['success', 'switch-view'])

const { register } = useAuth()

const form = reactive({
  name: '',
  email: '',
  telefono: '',
  dni: '',
  direccion: '',
  password: '',
  confirm: '',
  accept: false
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirm: '',
  accept: '',
  telefono: '',
  dni: '',
  direccion: ''
})

const showPass = ref(false)
const loading = ref(false)

function validate() {
  Object.keys(errors).forEach(key => errors[key] = '');
  
  let isValid = true;

  if (!form.name.trim()) {
    errors.name = 'El nombre es requerido';
    isValid = false;
  }

  if (!form.email.includes('@')) {
    errors.email = 'Ingresá un email válido';
    isValid = false;
  }

  if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres';
    isValid = false;
  }

  if (form.confirm !== form.password) {
    errors.confirm = 'Las contraseñas no coinciden';
    isValid = false;
  }

  if (!form.accept) {
    errors.accept = 'Debés aceptar los términos';
    isValid = false;
  }

  if (form.dni.length !== 8) {
    errors.dni = 'El DNI debe tener 8 caracteres';
    isValid = false;
  }

  if (form.telefono.length < 9) {
    errors.telefono = 'El teléfono debe tener al menos 9 caracteres';
    isValid = false;
  }

  if (!form.direccion.trim()) {
    errors.direccion = 'La dirección es requerida';
    isValid = false;
  }

  return isValid;
}

async function onSubmit() {
  if (!validate()) return;
  
  loading.value = true;
  
  try {
    const nameParts = form.name.split(' ');
    const nombre = nameParts[0] || '';
    const apellido = nameParts.slice(1).join(' ') || '';

    const result = await register({
      nombre: nombre,
      apellido: apellido,
      email: form.email,
      telefono: form.telefono,
      dni: form.dni,
      password: form.password,
      direccion: form.direccion
    });

    if (result.success) {
      // CAMBIO: Emitir éxito en lugar de redirigir
      emit('success')
    } else {
      if (result.error.includes('ya existe')) {
        errors.email = 'Este email o DNI ya está registrado';
      } else {
        alert(result.error || 'Error en el registro');
      }
    }
  } catch (error) {
    alert('Error de conexión: ' + error.message);
  } finally {
    loading.value = false;
  }
}

// AGREGAR: Función para cambiar a login
function goToLogin() {
  emit('switch-view', 'login')
}
</script>

<style scoped>
/* Layout */

.auth-modal-content {
  padding: 2rem;
  background-color: var(--color-card);
}

.auth-page{
  min-height: 100vh;
  display:flex; align-items:center; justify-content:center;
  background: var(--color-background);
  padding: 2rem;
}
.auth-card{
  width:100%; max-width: 420px;
  background: var(--color-card);
  color: var(--color-card-foreground);
  border:1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  padding: 2rem;
  margin: 6rem auto 3rem;
}

/* Titular */
h1{
  margin:0 0 1rem;
  font-weight:700; font-size:1.7rem;
  color: var(--color-primary);
  text-align:center;
  background-color: var(--color-card);
}

/* Campos */
.field{ margin-bottom: 1rem; text-align:left; background-color: var(--color-card);}
label{ display:block; font-weight:700; margin-bottom:.35rem; color: var(--color-accent-foreground); background-color: var(--color-card); }

.form-group {
  margin-bottom: 1rem;
  text-align: left;
  background-color: var(--color-card);
}

.input-row,
.password-row{ display:flex; gap:.5rem; align-items:center; background: var(--color-card); }

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

.checkbox{
  display:flex; align-items:center; gap:.5rem;
  margin:.25rem 0 1rem; user-select:none;
  color: var(--color-accent-foreground);
  font-size: small;
}

/* Botones */
button.btn{
  width:100%;
  padding:.9rem 1rem;
  border-radius:12px;
  border:1px solid var(--color-border);
  background: var(--color-primary);
  color: var(--color-primary-foreground);
  font-weight:700; cursor:pointer;
}
button.btn:hover{ filter:brightness(1.05); }
button.btn:disabled{ opacity:.6; cursor:not-allowed; }

button.ghost{
  border:1px solid var(--color-border);
  background: var(--color-muted);
  color: var(--color-accent-foreground);
  border-radius:10px;
  padding:.6rem .8rem;
  cursor:pointer;
}

form {
  background-color: var(--color-card);
}

span {
  background-color: var(--color-primary);
}

.link{ color: var(--color-secondary); text-decoration:none; background-color: var(--color-card); }
.link:hover{ text-decoration: underline; }

.error{ margin:.35rem 0 0; color: var(--color-destructive); font-size:.9rem; background-color: var(--color-card); }
.alt{ margin-top: 1rem; text-align:center; background-color: var(--color-card); }
</style>