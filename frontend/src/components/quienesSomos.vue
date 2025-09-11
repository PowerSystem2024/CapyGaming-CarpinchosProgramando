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
          image: '../src/assets/imagesQuienesSomos/María Mercedes Atim.png',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Ana Paula Ríos Garín',
          image: '../src/assets/imagesQuienesSomos/Ana Paula Ríos Garín.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Nicolas Exequiel Mercado',
          image: '../src/assets/imagesQuienesSomos/Nicolas Mercado.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Mariana Aguilera',
          image: '../src/assets/imagesQuienesSomos/Mariana Aguilera.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Melina Aguilar',
          image: '../src/assets/imagesQuienesSomos/Melina Aguilar.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Ezequiel Quiroz',
          image: '../src/assets/imagesQuienesSomos/Ezequiel Quiroz.jpg',
          description: 'Descripción breve del miembro del equipo.',
        },
        {
          name: 'Wanda Lanatta',
          image: "../src/assets/imagesQuienesSomos/Wanda Lanatta.jpg",
          description: 'Descripción breve del miembro del equipo.',
        },
       
      ],
    };
  },
};
</script>

<style scoped>
@import url(../assets/styles/base.css);

.about-us-container {
  padding: 20px;
  padding-top: calc(30px + 60px);  /* 60px = altura del navbar */
  background-color: var(--color-background);
}

.about-us {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  background-color: var(--background-color);
  color: #f9f9f9;
}

.about-us h2 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: var(--color-primary);
  font-family: 'Poppins', sans-serif;
}

.about-us p {
  font-size: 1.2em;
  color: var(--color-foreground);
  margin-bottom: 30px;
}

.team {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  background-color: var(--background-color);
  color: #f9f9f9;
}

.team-member {
  background-color: var(--background-color);
  border-radius: 8px;
  padding: 15px;
  width: 250px;
  
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #f9f9f9;
}

.team-member:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(243, 156, 18, 0.2);
}

.team-member img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
  margin: 0 auto 15px;
  display: block;
  background-color: transparent;
}

.team-member h3 {
  font-size: 1.4em;
  margin-top: 15px;
  margin-bottom: 10px;
  color: var(--color-primary);
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
}

.team-member p {
  font-size: 0.95em;
  color: var(--color-muted-foreground);
  line-height: 1.4;
}

@media (max-width: 600px) {
  .team-member {
    width: 100%;
    max-width: 300px;
  }
  
  .about-us h2 {
    font-size: 2em;
  }
  
  .about-us p {
    font-size: 1.1em;
  }
}
</style>
