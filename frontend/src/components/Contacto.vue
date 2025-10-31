<template>
  <div class="contacto-container">
    <h1 class="contacto-title">Contacto</h1>
    <div class="contacto-content">
      <ContactoForm />
    </div>
  </div>
</template>

<script>
import ContactoForm from "../components/ContactoForm.vue";

export default {
  components: { ContactoForm }
};
</script>

<style scoped>
.contacto-container {
  padding-top: calc(80px + 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
  background-color: var(--color-background);
}

.contacto-title {
  color: var(--color-primary);
  font-size: 2.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5px;
  text-align: center;
  width: 100%;
  padding: 0 1rem;
}

.contacto-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 1rem;
  box-sizing: border-box;
}

/* ===== RESPONSIVE DESIGN ===== */
/* Tablets y pantallas medianas (768px - 1199px) */
@media (max-width: 1199px) {
  .contacto-container {
    padding-top: calc(75px + 55px);
  }

  .contacto-title {
    font-size: 2.5rem;
    margin-bottom: 1.2rem;
    padding: 0 1.5rem;
  }

  .contacto-content {
    max-width: 1000px;
    padding: 0 1.5rem;
  }
}

/* Tablets pequeñas (600px - 767px) */
@media (max-width: 767px) {
  .contacto-container {
    padding-top: calc(70px + 50px);
  }

  .contacto-title {
    font-size: 2.2rem;
    margin-bottom: 1rem;
    padding: 0 1rem;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  }

  .contacto-content {
    padding: 0 1rem;
  }
}

/* Móviles (480px - 599px) */
@media (max-width: 599px) {
  .contacto-container {
    padding-top: calc(65px + 45px);
    min-height: calc(100vh - 110px);
  }

  .contacto-title {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
    padding: 0 0.8rem;
    letter-spacing: 0.2px;
  }

  .contacto-content {
    padding: 0 0.8rem;
  }
}

/* Móviles pequeños (hasta 479px) */
@media (max-width: 479px) {
  .contacto-container {
    padding-top: calc(60px + 40px);
    min-height: calc(100vh - 100px);
  }

  .contacto-title {
    font-size: 1.6rem;
    margin-bottom: 0.6rem;
    padding: 0 0.5rem;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
  }

  .contacto-content {
    padding: 0 0.5rem;
  }
}

/* Ajustes para pantallas muy grandes (más de 1600px) */
@media (min-width: 1600px) {
  .contacto-container {
    padding-top: calc(85px + 65px);
  }

  .contacto-title {
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  .contacto-content {
    max-width: 1400px;
  }
}
</style>