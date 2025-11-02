<template>
  <div class="contacto">
    <h2>Contáctanos</h2>
    <p class="contacto-descripcion">
      ¿Tenés alguna consulta o sugerencia? Completá el formulario y nos pondremos en contacto a la brevedad.
      Estamos aquí para ayudarte.
    </p>
    <form @submit.prevent="enviarMensaje">
      <input v-model="nombre" type="text" name="nombre" placeholder="Tu nombre" required />
      <input v-model="email" type="email" name="email" placeholder="Tu correo" required />
      <textarea v-model="mensaje" name="mensaje" placeholder="Tu mensaje" required></textarea>
      <button type="submit" :disabled="enviando">
        {{ enviando ? "Enviando..." : "Enviar" }}
      </button>
    </form>

    <p v-if="exito" class="success">✅ ¡Mensaje enviado con éxito!</p>
    <p v-if="error" class="error">❌ Error al enviar el mensaje. Intenta de nuevo.</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nombre: "",
      email: "",
      mensaje: "",
      enviando: false,
      exito: false,
      error: false,
    };
  },
  methods: {
    async enviarMensaje() {
      this.enviando = true;
      this.exito = false;
      this.error = false;

      try {
        const response = await fetch("https://formspree.io/f/xovkwkgp", { 
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: this.nombre,
            email: this.email,
            mensaje: this.mensaje,
          }),
        });

        if (response.ok) {
          this.exito = true;
          this.nombre = this.email = this.mensaje = "";
        } else {
          this.error = true;
        }
      } catch (err) {
        this.error = true;
      } finally {
        this.enviando = false;
      }
    },
  },
};
</script>

<style scoped>
@import url(../assets/styles/base.css);

/* CONTENEDOR DEL FORMULARIO */
.contacto {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--color-card);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  border: 2px solid var(--color-primary);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3),
              0 0 0 1px rgba(243, 156, 18, 0.1);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.contacto:hover {
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4),
              0 0 0 2px rgba(243, 156, 18, 0.3);
  transform: translateY(-2px);
}

/* TÍTULO DEL FORMULARIO */
.contacto h2 {
  text-align: center;
  color: var(--color-primary);
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* DESCRIPCIÓN DEL FORMULARIO */
.contacto-descripcion {
  text-align: center;
  color: var(--color-muted-foreground);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 3px solid var(--color-primary);
}

/* FORM */
.contacto form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* INPUTS Y TEXTAREA */
.contacto input,
.contacto textarea {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Poppins', sans-serif;
  color: var(--color-foreground);
  background: var(--color-background);
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.contacto input::placeholder,
.contacto textarea::placeholder {
  color: var(--color-muted-foreground);
  font-style: italic;
}

.contacto input:hover,
.contacto textarea:hover {
  border-color: var(--color-primary);
  background: var(--color-accent);
}

.contacto input:focus,
.contacto textarea:focus {
  border-color: var(--color-primary);
  background: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.15),
              0 2px 8px rgba(243, 156, 18, 0.2);
  transform: translateY(-1px);
}

/* TEXTAREA */
.contacto textarea {
  resize: vertical;
  min-height: 150px;
  line-height: 1.5;
}

/* BOTÓN ENVIAR */
.contacto button {
  background: linear-gradient(135deg, var(--color-primary) 0%, #e68a00 100%);
  color: var(--color-primary-foreground);
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Poppins', sans-serif;
  margin-top: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
  position: relative;
  overflow: hidden;
}

.contacto button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.contacto button:hover::before {
  left: 100%;
}

.contacto button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(243, 156, 18, 0.4);
}

.contacto button:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(243, 156, 18, 0.3);
}

button:disabled {
  background: var(--color-muted);
  color: var(--color-muted-foreground);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* MENSAJES */
.success {
  color: #4caf50;
  background: rgba(76, 175, 80, 0.1);
  border: 2px solid #4caf50;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  animation: slideInUp 0.4s ease;
}

.error {
  color: #f44336;
  background: rgba(244, 67, 54, 0.1);
  border: 2px solid #f44336;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  animation: shake 0.4s ease;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* Desktop grande */
@media (max-width: 1199px) {
  .contacto {
    padding: 2rem;
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .contacto {
    padding: 1.5rem;
    margin: 0 1rem;
  }

  .contacto h2 {
    font-size: 1.4rem;
  }

  .contacto input,
  .contacto textarea {
    font-size: 14px;
    padding: 12px 14px;
  }

  .contacto button {
    font-size: 14px;
    padding: 12px 20px;
  }
}

@media (max-width: 480px) {
  .contacto {
    padding: 1rem;
    margin: 0 0.5rem;
  }

  .contacto input,
  .contacto textarea {
    padding: 10px 12px;
  }

  .contacto h2 {
    font-size: 1.2rem;
  }

  .contacto button {
    font-size: 13px;
    padding: 10px 16px;
  }
}
</style>
