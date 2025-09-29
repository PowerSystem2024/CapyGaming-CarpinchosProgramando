<script setup>
import Marcas from '../components/marcas.vue';
</script>

<template>
  <footer class="footer">

    <div class="footer-brands">
    <Marcas />
    </div>

    <div class="footer-content">
      <!-- Columna 1 -->
      <div class="footer-section">
        <h4>Productos</h4>
        <ul>
          <li><router-link to="/categoria/hardware">Hardware</router-link></li>
          <li><router-link to="/categoria/notebooks">Notebooks</router-link></li>
          <li><router-link to="/categoria/monitores">Monitores</router-link></li>
          <li><router-link to="/categoria/perifericos">Periféricos</router-link></li>
          <li><router-link to="/categoria/conectividad">Conectividad</router-link></li>
          <li><router-link to="/categoria/gaming">Gaming</router-link></li>
          <li><router-link to="/categoria/impresoras">Impresoras</router-link></li>
        </ul>
      </div>

      <!-- Columna 2 -->
      <div class="footer-section">
        <h4>Acerca de</h4>
        <ul>
          <li><router-link to="/quienessomos">Quiénes somos</router-link></li>
          <li><a href="#">Términos y condiciones</a></li>
          <li><a href="#">Contáctanos</a></li>
          <li><a href="#">Preguntas frecuentes</a></li>
        </ul>
      </div>

      <!-- Columna 3 -->
      <div class="footer-section">
        <h4>Medios de pago</h4>
        <div class="pagos-icons">
          <img src="../assets/IconosNavBarFooter/MERCADOPAGOHZ.svg" alt="MercadoPago" />
        </div>
      </div>

      <!-- Columna 4 -->
      <div class="footer-section">
        <h4>Contacto</h4>
        <ul>
          <li><a href="#">Tel: (001) 12233344XXX</a></li>
          <li><a href="#">capygaming@example.com.ar</a></li>
          <p class="contact-horario">LUN A VIER DE 10 A 13 / 14 A 17 HS</p>
        </ul>
        <div class="social-icons">
          <a href="#"><img src="../assets/IconosNavBarFooter/twitter.svg" alt="Twitter" /></a>
          <a href="#"><img src="../assets/IconosNavBarFooter/instagram.svg" alt="Instagram" /></a>
          <a href="#"><img src="../assets/IconosNavBarFooter/facebook.svg" alt="Facebook" /></a>
        </div>
      </div>

    </div>

    <!-- Línea separadora -->
    <div class="footer-separator"></div>

    <!-- Abajo centrado -->
    <div class="footer-bottom">
      <p>
        &copy; 2025 CapyGaming - Todas las marcas comerciales y las marcas registradas son propiedad exclusiva de sus respectivos dueños.
      </p>
    </div>

  </footer>
</template>

<style scoped>
.footer {
  width: 100%; /*Agrego esto */
  margin: 0;
  background: var(--color-background);
  color: white;
  font-family: "Poppins", sans-serif;
  padding: 8px 0 10px 0;
}

/* Footer principal */
.footer-content {
  padding-top: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  gap: 50px;
  text-align: left;
}

.footer-section {
  flex: 1;
  min-width: 220px;
}

.footer-section h4 {
  margin-bottom: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin: 5px 0;
}

.footer-section a {
  color: #aaa;
  text-decoration: none;
}

.footer-section a:hover {
  color: white;
}

.contact-horario {
  font-size: 14px;
  color: var(--color-primary);
  margin: 2px 0;
}

.social-icons {
  margin-top: 25px;
}
.social-icons img {
  width: 35px;
  margin-right: 10px;
  cursor: pointer;
  border-radius: 50%;
}

.pagos-icons {
  width: 130px;
  height: auto;
  display: flex;
  background-color: #fff;
}

.footer-bottom {
  font-size: 14px;
  color: #aaa;
  text-align: center;
  margin-top: 15px;
}

.footer-separator {
  border-top: 1px solid #ffffff2a;
  margin: 20px auto;
  width: 90%;
}
</style>

