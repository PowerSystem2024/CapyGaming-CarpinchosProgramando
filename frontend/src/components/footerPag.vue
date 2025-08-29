<template>
  <footer class="footer">

    <!-- Cinta amarilla con marcas -->
    <div class="footer-brands">
      <img src="../assets/marcas/logo1.png" alt="Marca 1" />
      <img src="../assets/marcas/logo3.png" alt="Marca 2" />
      <img src="../assets/marcas/logo4.png" alt="Marca 3" />
      <img src="../assets/marcas/logo5.png" alt="Marca 4" />
      <img src="../assets/marcas/logo6.png" alt="Marca 5" />
      <img src="../assets/marcas/logo7.png" alt="Marca 6" />
    </div>

    <div class="footer-content">
      <!-- Columna 1 -->
      <div class="footer-section">
        <h4>Productos</h4>
        <ul>
          <li><a href="#">Computadoras</a></li>
          <li><a href="#">Hardware</a></li>
          <li><a href="#">Monitores</a></li>
          <li><a href="#">Periféricos</a></li>
          <li><a href="#">Portables</a></li>
          <li><a href="#">Gaming</a></li>
        </ul>
      </div>

      <!-- Columna 2 -->
      <div class="footer-section">
        <h4>Acerca de</h4>
        <ul>
          <li><a href="#">Quiénes somos</a></li>
          <li><a href="#">Términos y condiciones</a></li>
          <li><a href="#">Contáctanos</a></li>
          <li><a href="#">Preguntas frecuentes</a></li>
        </ul>
      </div>

      <!-- Columna 3 -->
      <div class="footer-section">
        <h4>Medios de pago</h4>
        <div class="pagos-icons">
          <img src="../assets/mercadopago.svg" alt="MercadoPago" />
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
          <a href="#"><img src="../assets/twitter.svg" alt="Twitter" /></a>
          <a href="#"><img src="../assets/instagram.svg" alt="Instagram" /></a>
          <a href="#"><img src="../assets/facebook.svg" alt="Facebook" /></a>
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
  background: var(--color-background);
  color: white;
  font-family: "Roboto", sans-serif;
  padding: 8px 0 10px 0;
}

/* Cinta amarilla de marcas */
.footer-brands {
  background: var(--color-primary); /* Amarillo */
  display: flex;
  justify-content: space-around; /* distribuye las marcas horizontalmente */
  align-items: center;
  flex-wrap: wrap;
}

.footer-brands img {
  height: 100px; /* tamaño de los logos */
  margin: 5px;
}

/* Footer principal */
.footer-content {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  gap: 50px;
  text-align: left;
  padding-bottom: 15px;
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
  margin-top: 10px;
}
.social-icons img {
  width: 24px;
  margin-right: 10px;
  cursor: pointer;
}

.pagos-icons img {
  width: 40px;
  margin-right: 10px;
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

