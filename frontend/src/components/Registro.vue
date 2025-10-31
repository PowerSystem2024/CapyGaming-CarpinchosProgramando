<template>
  <div class="auth-modal-content">
    <h1>Crear cuenta</h1>

    <form @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label for="name">Nombre</label>
        <input
          id="name"
          type="text"
          v-model.trim="form.nombre"
          placeholder="ej: Ana Pérez"
          autocomplete="name"
        />
        <p v-if="errors.name" class="error">{{ errors.name }}</p>
      </div>

      <div class="field">
        <label for="apellido">Apellido</label>
        <input
          id="apellido"
          type="text"
          v-model.trim="form.apellido"
          placeholder="ej: Ana Pérez"
          autocomplete="apellido"
        />
        <p v-if="errors.apellido" class="error">{{ errors.apellido}}</p>
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

      <p class="alt">
        ¿Ya tenés cuenta?
        <a class="link" href="#" @click.prevent="goToLogin">Iniciar sesión</a>
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
const { register } = useAuth()

const form = reactive({
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  dni: '',
  direccion: '', // ← AGREGAR CAMPO DIRECCIÓN
  password: '',
  confirm: '',
  accept: false
})

const errors = reactive({
  nombre: '', // ← AGREGAR ERROR PARA NOMBRE
  apellido: '',
  email: '',
  password: '',
  confirm: '',
  accept: '',
  telefono: '',
  dni: '',
  direccion: '' // ← AGREGAR ERROR PARA DIRECCIÓN
})

const showPass = ref(false)
const loading = ref(false)

function validate() {
  // Limpiar errores anteriores
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true

  // Validar nombre
  if (!form.nombre.trim()) {
    errors.nombre = 'El nombre es requerido'
    isValid = false
  }

  // Validar apellido
  if(!form.apellido){
    errors.apellido = 'El apellido es requerido'
    isValid = false
  }

  // Validar email
  if (!form.email.includes('@')) {
    errors.email = 'Ingresá un email válido'
    isValid = false
  }

  // Validar contraseña
  if (form.password.length < 6) {
    errors.password = 'Mínimo 6 caracteres'
    isValid = false
  }

  // Validar confirmación
  if (form.confirm !== form.password) {
    errors.confirm = 'Las contraseñas no coinciden'
    isValid = false
  }

  // Validar términos
  if (!form.accept) {
    errors.accept = 'Debés aceptar los términos'
    isValid = false
  }

  // Validar DNI
  if (form.dni.length !== 8) {
    errors.dni = 'El DNI debe tener 8 caracteres'
    isValid = false
  }

  // Validar teléfono
  if (form.telefono.length < 9) {
    errors.telefono = 'El teléfono debe tener al menos 9 caracteres'
    isValid = false
  }

  // Validar dirección
  if (!form.direccion.trim()) {
    errors.direccion = 'La dirección es requerida'
    isValid = false
  }

  return isValid
}

async function onSubmit() {
  console.log('🔍 Iniciando registro...') // ← Para debug
  
  if (!validate()) {
    console.log('❌ Validación falló:', errors) // ← Para debug
    return
  }

  loading.value = true
  
  try {
    console.log('📤 Enviando datos al backend...') // ← Para debug
    
    // Usar el servicio real de registro
    const result = await register({
      nombre: form.nombre,
      apellido: form.apellido,
      email: form.email,
      telefono: form.telefono,
      dni: form.dni,
      direccion: form.direccion,
      password: form.password
    })

    if (result.success) {
      console.log('✅ Registro exitoso') // ← Para debug
      emit('success')
    } else {
      console.log('❌ Error en registro:', result.error) // ← Para debug
      // Mostrar error específico del backend
      if (result.error.includes('ya existe')) {
        errors.email = 'Este email o DNI ya está registrado'
      } else {
        alert(result.error || 'Error en el registro')
      }
    }
  } catch (error) {
    console.error('💥 Error de conexión:', error) // ← Para debug
    alert('Error de conexión: ' + error.message)
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
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Layout */
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
  color: var(--color-primary);       /* naranja del proyecto */
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
  background: var(--color-popover);          /* evita el fondo global en inputs */
  color: var(--color-popover-foreground);
  outline: none;
  box-sizing: border-box;
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
  transition: all 0.3s ease;
  box-sizing: border-box;
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
  white-space: nowrap;
  transition: all 0.3s ease;
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

/* Media Queries para Responsive */

/* Pantallas grandes (desktops, 1200px en adelante) */
@media (min-width: 1200px) {
  .auth-modal-content {
    padding: 2.5rem;
    max-width: 480px;
  }
  
  h1 {
    font-size: 1.9rem;
    margin-bottom: 1.25rem;
  }
  
  .field, .form-group {
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
  
  .checkbox {
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
    max-width: 450px;
  }
  
  h1 {
    font-size: 1.6rem;
  }
  
  .field, .form-group {
    margin-bottom: 0.9rem;
  }
  
  input {
    padding: 0.7rem 0.85rem;
  }
  
  button.btn {
    padding: 0.85rem 1rem;
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
    max-width: 420px;
  }
  
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }
  
  .field, .form-group {
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
  
  button.ghost {
    padding: 0.5rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .checkbox {
    font-size: 0.8rem;
    margin: 0.2rem 0 0.8rem;
  }
  
  .error {
    font-size: 0.8rem;
  }
  
  .alt {
    margin-top: 0.8rem;
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
    margin-bottom: 0.7rem;
  }
  
  .field, .form-group {
    margin-bottom: 0.7rem;
  }
  
  label {
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
  }
  
  input {
    padding: 0.6rem 0.75rem;
    font-size: 0.85rem;
    border-radius: 6px;
  }
  
  .input-row,
  .password-row {
    gap: 0.4rem;
  }
  
  button.btn {
    padding: 0.75rem 0.8rem;
    font-size: 0.85rem;
    border-radius: 8px;
  }
  
  button.ghost {
    padding: 0.45rem 0.5rem;
    font-size: 0.75rem;
    border-radius: 6px;
  }
  
  .checkbox {
    font-size: 0.75rem;
    margin: 0.15rem 0 0.7rem;
  }
  
  .error {
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .alt {
    margin-top: 0.7rem;
    font-size: 0.8rem;
  }
  
  .link {
    font-size: 0.8rem;
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
  
  input {
    padding: 0.55rem 0.7rem;
    font-size: 0.8rem;
  }
  
  button.btn {
    padding: 0.7rem 0.75rem;
    font-size: 0.8rem;
  }
  
  button.ghost {
    padding: 0.4rem 0.45rem;
    font-size: 0.7rem;
  }
  
  .checkbox {
    font-size: 0.7rem;
  }
  
  .alt {
    font-size: 0.75rem;
  }
}
</style>