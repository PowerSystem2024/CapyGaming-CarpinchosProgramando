<template>
  <div class="contacto">
    <h2>Contáctanos</h2>
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

/* CONTENEDOR DEL FORMULARIo */
 .contacto {
    max-width: 600px;
    margin: 40px auto;
    padding: 25px;
    background: rgb(202, 106, 0); /* Fondo */
    border-radius: 8px;
    display: flex;
    flex-direction: column;

    /* Borde fino real */
    border: 1px solid rgba(0, 0, 0, 0.2) !important;

    /* Sombra muy fina */
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05) !important;

    outline: none !important; /* Quitar outline si estaba */

}

/* TÍTULO DEL FORMULARIO */
.contacto h2 {
  text-align: center;
  color: #ebe4e4;
  font-family: 'Segoe UI', sans-serif;
  font-size: 1.6rem;
  margin-bottom: 20px;
}

/*INPUTS Y TEXTAREA*/
.contacto input,
.contacto textarea {
  margin: 10px 0;
  padding: 12px;
  width: 100%;
  border: none; /* Quitar borde */
  border-bottom: 1px solid #ccc; /* Línea inferior suave */
  border-radius: 0; /* Sin bordes redondeados */
  font-size: 15px;
  color: #eee7e7; /* Texto oscuro para mejor lectura */
  background: transparent; /* Fondo transparente */
  outline: none; /* Quitar recuadro por defecto */
  transition: border-color 0.3s ease;
}

.contacto input::placeholder,
.contacto textarea::placeholder {
  color: #999; /* Placeholder visible pero suave */
}

.contacto input:focus,
.contacto textarea:focus {
  border-bottom: 2px solid #F39C12; /* Línea inferior naranja al enfocar */
}

/* TEXTAREA*/
.contacto textarea {
  resize: vertical;
  min-height: 140px;
}

/*BOTÓN ENVIAR*/
.contacto button {
  background: #F39C12; /* Naranja */
  color: white;
  padding: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  margin-top: 15px;
  transition: background 0.3s ease, transform 0.2s ease;
}

.contacto button:hover:not(:disabled) {
  background: #e68a00; /* Naranja más oscuro al pasar cursor */
  transform: translateY(-2px);
}

button:disabled {
  background: gray;
  cursor: not-allowed;
}

/* MENSAJES*/
.success {
  color: green;
  margin-top: 12px;
  text-align: center;
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 12px;
  text-align: center;
  font-weight: bold;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .contacto {
    padding: 15px;
    margin: 20px;
  }

  .contacto h2 {
    font-size: 1.4rem;
  }

  .contacto input,
  .contacto textarea {
    font-size: 14px;
    padding: 10px;
  }

  .contacto button {
    font-size: 14px;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .contacto {
    padding: 12px;
    margin: 15px;
  }

  .contacto h2 {
    font-size: 1.2rem;
  }

  .contacto button {
    font-size: 13px;
    padding: 10px;
  }
}
</style>
