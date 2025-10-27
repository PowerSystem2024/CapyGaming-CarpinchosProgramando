### 🔴 **USUARIO NO LOGUEADO**

```
┌─────────────────────────────────────────────────────────┐
│ PASO 1: Abrir checkout                                  │
├─────────────────────────────────────────────────────────┤
│ • Click en "Proceder al pago" (Carrito.vue)            │
│ • Se abre modal CheckoutForm                            │
│ • currentStep = 2 (arranca en paso "Direcciones")      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 2: Cargar datos automáticos                       │
├─────────────────────────────────────────────────────────┤
│ • mounted() ejecuta loadUserData()                      │
│ • AuthService.getCurrentUser() → null                   │
│ • Campos quedan VACÍOS:                                 │
│   - formData.nombre = ''                                │
│   - formData.apellidos = ''                             │
│   - formData.email = ''                                 │
│   - formData.dni = ''                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 3: Usuario ve el paso 2 (Direcciones)             │
├─────────────────────────────────────────────────────────┤
│ • Pantalla muestra: "Paso 2: Direcciones"              │
│ • Campos: alias, dirección, ciudad, CP, provincia, etc. │
│ • Usuario los completa                                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 4: Intenta continuar al paso 3 (Envío)            │
├─────────────────────────────────────────────────────────┤
│ • Click en botón "Continuar"                            │
│ • Se ejecuta: nextStep()                                │
│ • nextStep() llama a: validateCurrentStep()             │
│                                                          │
│ validateCurrentStep() {                                 │
│   switch(this.currentStep) {                            │
│     case 2:  // ← Está en paso 2                       │
│       // Valida SOLO campos del paso 2                 │
│       if (!formData.direccion) error...                 │
│       if (!formData.ciudad) error...                    │
│       // ⚠️ NO valida paso 1                           │
│   }                                                      │
│ }                                                        │
│                                                          │
│ • ✅ Si completó paso 2 → avanza a paso 3              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 5: Completa paso 3 (Método de envío)              │
├─────────────────────────────────────────────────────────┤
│ • Selecciona: Standard / Express / Gratis              │
│ • Click "Continuar"                                     │
│ • validateCurrentStep() valida SOLO paso 3              │
│ • ✅ Avanza a paso 4 (Pago)                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 6: Intenta finalizar compra (Pago)                │
├─────────────────────────────────────────────────────────┤
│ • Selecciona "Mercado Pago"                             │
│ • Acepta términos y condiciones                         │
│ • Click "Finalizar compra"                              │
│ • Se ejecuta: procesarPago()                            │
│                                                          │
│ procesarPago() {                                        │
│   validateCurrentStep()  // Valida paso 4              │
│   await processPayment(this.formData)                   │
│ }                                                        │
│                                                          │
│ • processPayment() recibe formData con:                 │
│   ✅ direccion, ciudad, provincia (paso 2)             │
│   ✅ metodoEnvio (paso 3)                              │
│   ✅ metodoPago (paso 4)                               │
│   ❌ nombre = '' (vacío del paso 1)                    │
│   ❌ email = '' (vacío del paso 1)                     │
│   ❌ dni = '' (vacío del paso 1)                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 7: MercadoPago rechaza la preferencia             │
├─────────────────────────────────────────────────────────┤
│ • usePayment.js envía a backend:                        │
│   {                                                      │
│     items: [...],                                       │
│     payer: {                                            │
│       name: '',        // ❌ VACÍO                      │
│       surname: '',     // ❌ VACÍO                      │
│       email: '',       // ❌ VACÍO                      │
│       identification: { number: '' }  // ❌ VACÍO       │
│     }                                                    │
│   }                                                      │
│                                                          │
│ • Backend hace request a MercadoPago                    │
│ • ❌ MercadoPago responde ERROR:                        │
│   "payer.email is required"                             │
│   "payer.name is required"                              │
│                                                          │
│ • Usuario ve: "Error al procesar el pago"               │
└─────────────────────────────────────────────────────────┘

RESULTADO: ❌ NO PUEDE COMPLETAR LA COMPRA
           (MercadoPago rechaza por datos faltantes)
```

---

### 🟢 **USUARIO LOGUEADO**

```
┌─────────────────────────────────────────────────────────┐
│ PASO 1: Abrir checkout                                  │
├─────────────────────────────────────────────────────────┤
│ • Click en "Proceder al pago"                           │
│ • Se abre modal CheckoutForm                            │
│ • currentStep = 2                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 2: Cargar datos del usuario                       │
├─────────────────────────────────────────────────────────┤
│ • mounted() ejecuta loadUserData()                      │
│ • AuthService.getCurrentUser() → {                      │
│     nombre: "Juan",                                     │
│     apellido: "Pérez",                                  │
│     email: "juan@email.com",                            │
│     dni: "12345678"                                     │
│   }                                                      │
│                                                          │
│ • Campos se RELLENAN automáticamente:                   │
│   ✅ formData.nombre = "Juan"                           │
│   ✅ formData.apellidos = "Pérez"                       │
│   ✅ formData.email = "juan@email.com"                  │
│   ✅ formData.dni = "12345678"                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 3: Completa paso 2 (Direcciones)                  │
├─────────────────────────────────────────────────────────┤
│ • Rellena: dirección, ciudad, CP, provincia             │
│ • Click "Continuar"                                     │
│ • validateCurrentStep() ✅ OK                           │
│ • Avanza a paso 3                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 4: Completa paso 3 (Envío)                        │
├─────────────────────────────────────────────────────────┤
│ • Selecciona método de envío                            │
│ • Click "Continuar"                                     │
│ • validateCurrentStep() ✅ OK                           │
│ • Avanza a paso 4                                       │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 5: Finaliza compra (Pago)                         │
├─────────────────────────────────────────────────────────┤
│ • Selecciona Mercado Pago                               │
│ • Acepta términos                                       │
│ • Click "Finalizar compra"                              │
│ • procesarPago() → processPayment(formData)             │
│                                                          │
│ • formData contiene:                                    │
│   ✅ nombre: "Juan"                                     │
│   ✅ apellidos: "Pérez"                                 │
│   ✅ email: "juan@email.com"                            │
│   ✅ dni: "12345678"                                    │
│   ✅ direccion, ciudad, provincia                       │
│   ✅ metodoEnvio, metodoPago                            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PASO 6: Backend crea preferencia en MercadoPago        │
├─────────────────────────────────────────────────────────┤
│ • Backend recibe datos completos                        │
│ • Crea preferencia con:                                 │
│   {                                                      │
│     payer: {                                            │
│       name: "Juan",                                     │
│       surname: "Pérez",                                 │
│       email: "juan@email.com",                          │
│       identification: { type: "DNI", number: "12345678" }│
│     }                                                    │
│   }                                                      │
│                                                          │
│ • ✅ MercadoPago responde OK                            │
│ • Devuelve initPoint (URL de pago)                      │
│ • Frontend redirige a MercadoPago                       │
└─────────────────────────────────────────────────────────┘

RESULTADO: ✅ COMPRA EXITOSA
           (Usuario puede completar el pago)
```

---

## 🎯 **CONCLUSIÓN**

**Tu intuición era correcta:**

```
NO LOGUEADO → Puede llenar paso 2, 3, 4
           → Pero falta paso 1 (datos personales)
           → MercadoPago RECHAZA por datos incompletos
           → ❌ ERROR al procesar pago

LOGUEADO   → Paso 1 se rellena automáticamente
           → Completa paso 2, 3, 4
           → MercadoPago ACEPTA datos completos
           → ✅ Pago exitoso
```

**La "validación" no es explícita** (no dice "debes loguearte"), pero **funciona de facto** porque MercadoPago requiere `payer.email`, `payer.name`, etc., y esos datos solo se obtienen si estás logueado.

 **¿Es buena práctica?** NO. Debería validar ANTES de llegar a MercadoPago para dar mejor feedback al usuario.

 ¿Ahora sí quedó claro? 😊
