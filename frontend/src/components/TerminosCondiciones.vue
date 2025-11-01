<template>
  <div class="terms-wrapper">
    <!-- Espacio para el navbar fijo -->
    <div class="navbar-spacer"></div>
    
    <div class="terms-container">
      <div class="terms-header" id="terms-top">
        <h1>Términos y Condiciones</h1>
      </div>
      
      <div class="card terms-card">
        <div class="terms-content">
          <div class="terms-notice">
            <p><strong>Aviso:</strong> Este sitio web forma parte de un proyecto académico desarrollado en el marco de una universidad. Ninguna transacción realizada a través del mismo implica la venta real de productos, ni Capygaming se hace responsable de entregas o pagos. Los contenidos, precios y promociones son únicamente simulaciones con fines educativos.</p>
          </div>
          
          <div class="terms-intro">
            <p>Bienvenido a Capygaming. Al acceder o utilizar este sitio web, usted acepta estos Términos y Condiciones y nuestra Política de Privacidad. Si no está de acuerdo con alguno de los términos aquí expuestos, por favor absténgase de utilizar el sitio y de proporcionar cualquier información personal a través del mismo.</p>
          </div>
          
          <div class="terms-sections">
            <div class="terms-section" v-for="section in sections" :key="section.id">
              <h3>{{ section.id }}. {{ section.title }}</h3>
              <p>{{ section.content }}</p>
            </div>
          </div>
          
          <div class="terms-links">
            <h3>Para más información, visite las siguientes páginas:</h3>
            <ul>
              <li v-for="link in links" :key="link.name">
                <a :href="link.url" target="_blank">{{ link.name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TermsAndConditions',
  data() {
    return {
      sections: [
        {
          id: 1,
          title: "Vigencia y Modificaciones",
          content: "Estos Términos y Condiciones estarán vigentes mientras se encuentren publicados en el sitio web. Capygaming se reserva el derecho de modificar, actualizar o eliminar cualquier parte de los mismos sin previo aviso. El uso continuado del sitio después de cualquier cambio implica la aceptación de los nuevos términos."
        },
        {
          id: 2,
          title: "Acceso y Uso del Sitio",
          content: "El uso del sitio está permitido solo para personas con capacidad legal para contratar y mayores de 18 años. En caso de usuarios corporativos, la persona que registre la cuenta debe tener facultad para obligar legalmente a la entidad. Usted se compromete a proporcionar información veraz, completa y precisa al registrarse o realizar cualquier operación. No está permitido: realizar actividades ilegales, subir contenido ofensivo, infringir derechos de terceros, modificar el sitio o las cuentas de otros usuarios, ni utilizar el sitio con fines comerciales sin autorización."
        },
        {
          id: 3,
          title: "Registro de Usuarios y Confidencialidad",
          content: "Para comprar en el sitio, deberá registrarse proporcionando todos los datos solicitados. Usted es responsable de mantener la confidencialidad de su contraseña y de toda actividad que se realice desde su cuenta. Ante uso no autorizado, deberá notificarlo inmediatamente a legales@capygaming.com."
        },
        {
          id: 4,
          title: "Compras, Stock y Pagos",
          content: "Todas las compras están sujetas a disponibilidad de stock y aprobación de pago por el proveedor autorizado (ej. MercadoPago). Los precios incluyen IVA y pueden cambiar sin previo aviso. Las imágenes son ilustrativas y las especificaciones pueden variar. Al confirmar una compra, se considera que se ha celebrado un contrato de compraventa válido. Capygaming puede solicitar información adicional para concretar la operación, y comunicará cualquier eventual no disponibilidad o rechazo de pago vía correo electrónico."
        },
        {
          id: 5,
          title: "Promociones",
          content: "Las promociones son válidas solo para compras online, salvo que se indique lo contrario. No son acumulativas a menos que se indique expresamente. Las promociones y precios pueden cambiar sin previo aviso."
        },
        {
          id: 6,
          title: "Envíos y Retiros",
          content: "Las entregas se realizan dentro del territorio argentino mediante empresas de transporte autorizadas. Los gastos de envío corren por cuenta del cliente, salvo que se indique lo contrario. Verifique que el producto esté en buen estado y con todos sus accesorios al momento de la entrega. En caso de retiro en sucursal, se solicitará presentar comprobante de compra, DNI y tarjeta de crédito utilizada (si corresponde)."
        },
        {
          id: 7,
          title: "Cambios y Devoluciones",
          content: "Los productos pueden cambiarse o devolverse dentro de los 10 días corridos desde la recepción, siempre que estén en perfecto estado, con embalaje y accesorios originales. Los costos de envío de devolución serán a cargo del cliente. Se debe conservar la factura de compra y remito de entrega para realizar cualquier gestión."
        },
        {
          id: 8,
          title: "Propiedad Intelectual",
          content: "Todo el contenido del sitio, incluyendo textos, imágenes, software, logos, música y videos, pertenece a Capygaming o sus proveedores y está protegido por leyes de propiedad intelectual. No está permitido copiar, reproducir, modificar o explotar los contenidos sin autorización expresa de Capygaming."
        },
        {
          id: 9,
          title: "Protección de Datos Personales",
          content: "Sus datos serán almacenados y utilizados para procesar pedidos, mejorar la experiencia de usuario y enviar promociones autorizadas. Los datos podrán compartirse únicamente con terceros necesarios para la entrega de productos o servicios contratados. Usted puede solicitar la eliminación, actualización o rectificación de sus datos enviando un correo a legales@capygaming.com. Para más información sobre sus derechos, puede consultar la Dirección Nacional de Protección de Datos Personales."
        },
        {
          id: 10,
          title: "Cookies",
          content: "El sitio puede usar cookies para mejorar la experiencia de usuario, personalizar servicios y medir efectividad de promociones. Usted puede configurar su navegador para rechazar cookies, aunque esto podría afectar la funcionalidad del sitio."
        },
        {
          id: 11,
          title: "Enlaces a Sitios de Terceros",
          content: "Capygaming puede incluir enlaces a sitios externos, los cuales no implican respaldo ni responsabilidad sobre su contenido. Usted acepta que al acceder a estos sitios estará sujeto a sus propios términos y condiciones."
        },
        {
          id: 12,
          title: "Responsabilidades del Usuario e Indemnidad",
          content: "Usted se compromete a usar el sitio de manera responsable y a indemnizar a Capygaming frente a cualquier reclamo, daño o perjuicio derivado de su uso indebido del sitio, violación de estos términos o de derechos de terceros."
        },
        {
          id: 13,
          title: "Fallas del Sistema",
          content: "Capygaming no garantiza la disponibilidad continua del sitio ni la ausencia de errores técnicos. En caso de interrupciones, se procurará restablecer el servicio lo antes posible."
        },
        {
          id: 14,
          title: "Ley Aplicable y Jurisdicción",
          content: "Estos términos se rigen por las leyes de la República Argentina. Cualquier disputa se resolverá ante los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires, con exclusión de cualquier otro fuero."
        }
      ],
      links: [
        {
          name: "AFIP",
          url: "https://servicioscf.afip.gob.ar/publico/denuncias/denunciaCD.aspx"
        },
        {
          name: "Datos personales",
          url: "https://www.argentina.gob.ar/aaip/datospersonales"
        },
        {
          name: "Defensa del Consumidor",
          url: "https://www.buenosaires.gob.ar/defensaconsumidor/direccion-general"
        },
        {
          name: "Tribunal Arbitral de consumo",
          url: "https://www.argentina.gob.ar/produccion/consumidor/sistema-nacional-de-arbitraje-deconsumo"
        }
      ]
    }
  },
  mounted() {
    // Scroll para asegurar que el título sea visible después del navbar
    this.$nextTick(() => {
      setTimeout(() => {
        const element = document.getElementById('terms-top');
        if (element) {
          // Calculamos la altura total del navbar (navbar + sub-navbar)
          const navbarHeight = 140; // Altura estimada total del navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
          
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth'
          });
        }
      }, 100);
    });
  }
}
</script>

<style scoped>
.terms-wrapper {
  background-color: var(--color-background);
  min-height: 100vh;
  width: 100%;
}

.terms-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem;
}

/* Header del título */
.terms-header {
  width: 100%;
  text-align: center;
  padding: 3rem 0 2rem 0;
  margin: 0;
  background-color: var(--color-background);
}

.terms-header h1 {
  color: var(--color-primary);
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0;
  padding: 0;
  line-height: 1.2;
  background-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

/* Contenido principal */
.terms-card {
  text-align: left;
  padding: 2.5rem;
  margin: 0 0 3rem 0;
  background-color: var(--color-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.terms-content {
  background-color: transparent;
}

.terms-notice {
  background-color: var(--color-muted);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid var(--color-destructive);
}

.terms-notice p {
  background-color: transparent;
  margin: 0;
  color: var(--color-foreground);
}

.terms-intro {
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
  background-color: transparent;
}

.terms-intro p {
  background-color: transparent;
  color: var(--color-card-foreground);
}

.terms-sections {
  background-color: transparent;
}

.terms-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background-color: transparent;
}

.terms-section:last-of-type {
  border-bottom: none;
}

.terms-section h3 {
  color: var(--color-primary);
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
  background-color: transparent;
}

.terms-section p {
  line-height: 1.7;
  color: var(--color-card-foreground);
  background-color: transparent;
  margin: 0;
}

.terms-links {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid var(--color-border);
  background-color: transparent;
}

.terms-links h3 {
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
  background-color: transparent;
  font-size: 1.3rem;
}

.terms-links ul {
  list-style-type: none;
  padding-left: 0;
  background-color: transparent;
}

.terms-links li {
  margin-bottom: 0.8rem;
  background-color: transparent;
}

.terms-links a {
  color: var(--color-secondary);
  transition: all 0.3s ease;
  background-color: transparent;
  font-weight: 500;
  padding: 0.3rem 0;
  display: inline-block;
}

.terms-links a:hover {
  color: var(--sidebar-accent);
  transform: translateX(5px);
}

/* Responsividad mejorada */
@media (max-width: 1024px) {
  .terms-container {
    padding: 0 1.5rem;

  }
  

  
  .terms-header {
    padding: 2.5rem 0 1.5rem 0;
  }
  
  .terms-header h1 {
    font-size: 2.4rem;
  }
  
  .terms-card {
    padding: 2rem;
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .terms-container {
    padding: 0 1rem;
  }
  

  
  .terms-header {
    padding: 2rem 0 1rem 0;
  }
  
  .terms-header h1 {
    font-size: 2rem;
  }
  
  .terms-card {
    padding: 1.5rem;
    margin: 0 0 1.5rem 0;
  }
  
  .terms-section h3 {
    font-size: 1.2rem;
  }
  
  .terms-links h3 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .terms-container {
    padding: 0 0.5rem;
  }
  
  .terms-header {
    padding: 1.5rem 0 0.5rem 0;
  }
  
  .terms-header h1 {
    font-size: 1.8rem;
  }
  
  .terms-card {
    padding: 1rem;
    margin: 0 0 1rem 0;
    border-radius: 8px;
  }
  
  .terms-notice {
    padding: 1rem;
  }
  
  .terms-section {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }
  
  .terms-links {
    margin-top: 2rem;
    padding-top: 1.5rem;
  }
}

@media (max-width: 360px) {

  .terms-header h1 {
    font-size: 1.6rem;
  }
  
  .terms-card {
    padding: 0.8rem;
  }
}

/* Asegurar que todos los elementos de texto tengan fondo transparente */
.terms-wrapper * {
  background-color: transparent;
}

.terms-wrapper h1,
.terms-wrapper h2,
.terms-wrapper h3,
.terms-wrapper p,
.terms-wrapper li,
.terms-wrapper a,
.terms-wrapper strong {
  background-color: transparent;
}

/* Scroll suave para toda la página */
html {
  scroll-behavior: smooth;
}
</style>