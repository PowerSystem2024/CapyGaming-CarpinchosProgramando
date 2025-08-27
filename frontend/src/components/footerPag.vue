<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Columna 1 -->
      <div class="footer-section">
        <h4>Mi Tienda</h4>
        <p>Productos únicos para vos ✨</p>
      </div>

      <!-- Columna 2 -->
      <div class="footer-section">
        <h4>Enlaces</h4>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Productos</a></li>
          <li><a href="#">Contacto</a></li>
        </ul>
      </div>

      <!-- Columna 3 -->
      <div class="footer-section">
        <h4>Redes</h4>
        <div class="social-icons">
          <a href="#"><img src="../assets/twitter.svg" alt="Twitter" /></a>
          <a href="#"><img src="../assets/instagram.svg" alt="Instagram" /></a>
          <a href="#"><img src="../assets/facebook.svg" alt="Facebook" /></a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 CapyGaming - Todos los derechos reservados</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  background: #222;
  color: white;
  padding: 20px 0;
  text-align: center;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 10px;
}

.footer-section {
  margin: 10px;
}

.footer-section h4 {
  margin-bottom: 10px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
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

.social-icons img {
  width: 24px;
  margin: 0 5px;
  cursor: pointer;
}

.footer-bottom {
  margin-top: 15px;
  font-size: 14px;
  color: #aaa;
}
</style>
