<template>
  <div class="about-us-container">
    <section class="about-us">
      <h2>Quiénes Somos</h2>
      <p class="descripcion-capy">
        "Somos una empresa dedicada a brindar soluciones innovadoras y eficientes para nuestros clientes.
        Nuestro equipo está compuesto por profesionales apasionados y comprometidos con la excelencia."
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
import melina from '../assets/imagesQuienesSomos/MelinaAguilar.jpg';
import wan from '../assets/imagesQuienesSomos/WandaLanatta.jpg';
import mer from '../assets/imagesQuienesSomos/MaríaMercedesAtim.png';
import ana from '../assets/imagesQuienesSomos/AnaPaulaRíosGarín.jpg';
import nico from '../assets/imagesQuienesSomos/NicolasMercado.jpg';
import marian from '../assets/imagesQuienesSomos/MarianaAguilera.jpg';
import ezequiel from '../assets/imagesQuienesSomos/EzequielQuiroz.jpg';
export default {
  name: 'AboutUs',
  data() {
    return {
      teamMembers: [
        {
          name: 'Maria Mercedes Atim',
          image: mer,
          description: 'Garantizamos precios competitivos y buscamos mejorar ofertas para darte la mejor experiencia al menor costo.',
        },
        {
          name: 'Ana Paula Ríos Garín',
          image: ana,
          description: 'Ofrecemos soporte técnico y asesoría especializada para garantizar productos y servicios de calidad, con ayuda experta siempre disponible.',
        },
        {
          name: 'Nicolas Exequiel Mercado',
          image: nico,
          description: 'Ofrecemos soluciones y equipamiento de calidad, con atención experta y mejora continua, para apoyar el desarrollo profesional y personal de nuestros clientes.',
        },
        {
          name: 'Mariana Aguilera',
          image: marian,
          description: 'Buscamos ser líderes nacionales mediante innovación constante y adaptación a las necesidades del mercado y clientes.',
        },
        {
          name: 'Melina Aguilar',
          image: melina,
          description: 'Promovemos responsabilidad, respeto y confianza con los clientes, fomentamos el trabajo en equipo, cuidamos el medio ambiente y ofrecemos productos innovadores, de calidad y alto rendimiento.',
        },
        {
          name: 'Ezequiel Quiroz',
          image: ezequiel,
          description: 'Valoramos tus opiniones para mejorar continuamente y ofrecerte la mejor atención, respondiendo personalmente a tus comentarios.',
        },
        {
          name: 'Wanda Lanatta',
          image: wan,
          description: 'Somos una empresa creada en 2025 por un grupo de entusiastas de la tecnología y el gaming, dando lo mejor para nuestros clientes.',
        },
      ],
    };
  },
};
</script>

<style scoped>
@import url(../assets/styles/base.css);
.description-capy {
  font-size: 1.2em;
  margin-bottom: 30px;
  color: #F39C12; /* naranja */
  top: 2px
}

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
  color: var(#F39C12);
  font-family: 'Poppins', sans-serif;
}

.about-us p {
  font-size: 1.5em;
  color: #F39C12; /* naranja */
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
