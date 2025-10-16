<template>
  <div class="pago-resultado">
    <div class="resultado-container fallido">
      <div class="icono-container">
        <span class="icono-error">✕</span>
      </div>

      <h1>Pago rechazado</h1>
      <p class="mensaje-principal">Lo sentimos, no pudimos procesar tu pago.</p>

      <div class="mensaje-secundario">
        <p>Esto puede deberse a:</p>
        <ul>
          <li>Fondos insuficientes</li>
          <li>Datos de pago incorrectos</li>
          <li>Problemas con la entidad emisora</li>
          <li>Límites de compra alcanzados</li>
        </ul>
      </div>

      <p class="mensaje-ayuda">
        Por favor, verifica tus datos e intenta nuevamente. Tu pedido no ha sido confirmado.
      </p>

      <div class="acciones">
        <router-link to="/carrito" class="btn btn-primary">
          Volver al carrito
        </router-link>
        <router-link to="/" class="btn btn-secondary">
          Ir al inicio
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PagoFallido'
}
</script>

<style scoped>
.pago-resultado {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--color-background);
}

.resultado-container {
  max-width: 600px;
  width: 100%;
  background: var(--color-card);
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.resultado-container.fallido {
  border-top: 4px solid #f44336;
}

.icono-container {
  margin-bottom: 30px;
}

.icono-error {
  display: inline-block;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  background: #f44336;
  color: white;
  font-size: 50px;
  font-weight: bold;
}

.resultado-container h1 {
  color: var(--color-foreground);
  font-size: 2rem;
  margin-bottom: 15px;
}

.mensaje-principal {
  color: var(--color-muted-foreground);
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.mensaje-secundario {
  background: var(--color-accent);
  border-radius: 12px;
  padding: 25px;
  margin: 30px 0;
  text-align: left;
}

.mensaje-secundario p {
  color: var(--color-foreground);
  font-weight: 600;
  margin-bottom: 15px;
}

.mensaje-secundario ul {
  list-style: none;
  padding: 0;
}

.mensaje-secundario li {
  color: var(--color-muted-foreground);
  padding: 8px 0;
  padding-left: 25px;
  position: relative;
}

.mensaje-secundario li:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #f44336;
  font-size: 1.5rem;
}

.mensaje-ayuda {
  color: var(--color-muted-foreground);
  margin: 20px 0;
  line-height: 1.6;
}

.acciones {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn {
  padding: 14px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--sidebar-ring);
  transform: translateY(-2px);
}

.btn-secondary {
  background: var(--color-accent);
  color: var(--color-foreground);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-muted);
}

@media (max-width: 640px) {
  .resultado-container {
    padding: 40px 20px;
  }

  .acciones {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
