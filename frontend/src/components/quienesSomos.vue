<template>
  <div class="about-us-container">
    <section class="about-us">
      <h2>Quiénes Somos</h2>
      <p>
        Somos una empresa dedicada a brindar soluciones innovadoras y eficientes para nuestros clientes.
        Nuestro equipo está compuesto por profesionales apasionados y comprometidos con la excelencia.
      </p>

      <div class="team">
        <div v-for="member in teamMembers" :key="member.name" class="team-member">
          <img :src="member.image" :alt="member.name" />
          <h3>{{ member.name }}</h3>
          <p>{{ member.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      teamMembers: [
        {
          name: 'Maria Mercedes Atim',
          image: '/src/assets/imagesQuienesSomos/Maria Mercedes Atim.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Ana Paula Ríos Garín',
          image: '/src/assets/imagesQuienesSomos/AnaPaulaRíosGarín.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Nicolas Exequiel Mercado',
          image: '/images/Nicolas Mercado.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Mariana Aguilera',
          image: '/images/Mariana Aguilera.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Melina Aguilar',
          image: '/images/Melina Aguilar.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Ezequiel Quiroz',
          image: '/src/assets/imagesQuienesSomos/EzequielQuiroz.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Wanda Lanatta',
          image: '/images/Wanda Lanatta.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
      ],
    };
  },
};
</script>

<style scoped>
.about-us-container {
  padding: 20px;
}
.about-us {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
.about-us h2 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: #333;
}
.about-us p {
  font-size: 1.2em;
  color: #000000;
}
.team {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}
.team-member {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  width: 250px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.team-member img {
  width: 100%;
  height: auto;
  border-radius: 50%;
}
.team-member h3 {
  font-size: 1.5em;
  margin-top: 15px;
  color: #333;
}
.team-member p {
  font-size: 1em;
  color: #666;
}
@media (max-width: 600px) {
  .team-member {
    width: 100%;
  }
}
</style>