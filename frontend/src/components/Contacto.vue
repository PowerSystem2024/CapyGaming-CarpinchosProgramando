<template>
  <div>
    <h1>Contacto</h1>
    <ContactoForm />
  </div>
</template>

<script>
import ContactoForm from "../components/ContactoForm.vue";

export default {
  components: { ContactoForm }
};
</script>

<style scoped>


 h1{
  margin-top: 3rem;
  color: var(--color-primary);
  font-size: 2.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: 0.5; /* Para mejor legibilidad */
}

div {
    padding-top: calc(80px + 60px); /* --- */
}
</style>
