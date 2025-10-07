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
          description: 'Actualmente curso la Tecnicatura Universitaria en Programación en la Universidad Tecnológica Nacional (UTN FRSR).He realizado cursos de desarrollo Full-Stack con Java, así como también de diseño gráfico utilizando Adobe Illustrator y Adobe Photoshop.He trabajado en equipos aplicando metodologías ágiles, desarrollando proyectos con tecnologías como HTML, CSS, JavaScript, Java, Python, Git, entre otras.Me apasiona seguir aprendiendo, colaborar y crear soluciones tecnológicas que generen impacto.',
        },
        {
          name: 'Ana Paula Ríos Garín',
          image: '../src/assets/imagesQuienesSomos/Ana Paula Ríos Garín.jpg',
          description: '🎓 Student of Programming Technician at UTN FRSR💻 Full-stack developer passionate about JavaScript and accessible design🎨 Digital artist and creator of creative technical solutions📍 Tres de Febrero, Buenos Aires',
        },
        {
          name: 'Nicolas Exequiel Mercado',
          image: '../src/assets/imagesQuienesSomos/Nicolas Mercado.jpg',
          description: 'No hay mucho que decir sobre mi la verdad, solo que me gusta programar y aprender cosas nuevas.',
        },
        {
          name: 'Mariana Aguilera',
          image: '../src/assets/imagesQuienesSomos/Mariana Aguilera.jpg',
          description: 'Estoy estudiando la Tecnicatura en Programación en la Universidad Tecnológica Nacional San Rafael, lenguajes como: Python, Java, JavaScript. Bases de Datos: SQL, MySQL.',
        },
        {
          name: 'Melina Aguilar',
          image: '../src/assets/imagesQuienesSomos/Melina Aguilar.jpg',
          description: 'Estoy estudiando la Tecnicatura en Programación en la Universidad Tecnológica Nacional San Rafael, lenguajes como: Python, Java, JavaScript. Bases de Datos: SQL, MySQL.',
        },
        {
          name: 'Ezequiel Quiroz',
          image: '../src/assets/imagesQuienesSomos/Ezequiel Quiroz.jpg',
          description: '💡 Me encuentro formándome como desarrollador y programador.🎓 Estudio en la Universidad Tecnológica Nacional (UTN) - Facultad Regional San Rafael.🚀 Estoy aprendiendo y desarrollando proyectos académicos en diferentes tecnologías.',
        },
        {
          name: 'Wanda Lanatta',
          image: "../src/assets/imagesQuienesSomos/Wanda Lanatta.jpg",
          description: '🎓 Estudiante de la Tecnicatura Universitaria en Programación en la Universidad Tecnológica Nacional (UTN).💻 Apasionada por el mundo del desarrollo y el aprendizaje de nuevas tecnologías.🌱 Actualmente enfocada en mejorar mis habilidades en JavaScript, Java y Python, además de reforzar mis bases en HTML y CSS.🤝 Me motiva colaborar en proyectos que representen un desafío, donde pueda aportar y al mismo tiempo crecer como desarrolladora.',
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
