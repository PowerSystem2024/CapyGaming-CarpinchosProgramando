<template>
  <div class="contacto">
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
  max-width: 700px;
  margin: 0 auto;
  padding: 2.5rem;
  background: var(--color-card); 
  border-radius: 12px; 
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border); 
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2); 
  transition: all 0.3s ease;

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
  margin: 15px 0;
  padding: 14px 16px;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 15px;
  color: var(--color-foreground); 
  background: var(--color-background); 
  outline: none;
  transition: all 0.3s ease;
}

.contacto input::placeholder,
.contacto textarea::placeholder {
  color: var(--color-muted-foreground); /* Placeholder visible pero suave */
}

.contacto input:hover,
.contacto textarea:hover {
  border-color: var(--color-primary);
}
.contacto input:focus,
.contacto textarea:focus {
  border-color: var(--color-primary); /* 👈 Borde naranja completo */
  box-shadow: 0 0 0 3px rgba(243, 156, 18, 0.1); /* 👈 Glow naranja al enfocar */
  background: var(--color-card);
}

/* TEXTAREA*/
.contacto textarea {
  resize: vertical;
  min-height: 140px;
}

/*BOTÓN ENVIAR*/
.contacto button {
  background: var(--color-primary);
  color: #000; 
  padding: 14px 24px;
  border: none;
  border-radius: 8px; 
  cursor: pointer;
  font-size: 16px;
  font-weight: 600; 
  margin-top: 15px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
}

.contacto button:hover:not(:disabled) {
  background: #e68a00;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(243, 156, 18, 0.4);
}

.contacto button:active:not(:disabled) {
  transform: translateY(0); 
}

button:disabled {
  background: var(--color-muted);
  color: var(--color-muted-foreground);
  cursor: not-allowed;
  box-shadow: none;
}

/* MENSAJES*/
.success {
  background: rgba(40, 167, 69, 0.1); 
  color: #4caf50;
  border: 1px solid rgba(40, 167, 69, 0.3);
  border-left: 4px solid #4caf50;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  text-align: left; 
  font-weight: 500;
}

.error {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
  border: 1px solid rgba(244, 67, 54, 0.3);
  border-left: 4px solid var(--color-destructive);
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 16px;
  text-align: left;
  font-weight: 500;
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
