<template>
  <div>
    <h1></h1>
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
div {
    padding-top: calc(80px + 60px); /* --- */
}
</style>
