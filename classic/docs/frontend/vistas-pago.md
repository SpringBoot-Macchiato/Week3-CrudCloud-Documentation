# Vistas de Pago

## Componentes Principales

### PlanSelection
Muestra planes disponibles con características y precios.

**Características:**
- Cards con información de cada plan
- Botón de selección por plan
- Comparación visual de features
- Highlight del plan recomendado

**Datos mostrados:**
- Nombre del plan
- Precio mensual
- Recursos incluidos (CPU, RAM, Storage)
- Features específicos

### Checkout
Proceso de checkout antes de redirigir a MercadoPago.

**Flujo:**
1. Usuario revisa plan seleccionado
2. Confirma datos de facturación
3. Click en "Proceder al pago"
4. Backend crea preference en MercadoPago
5. Redirect a checkout de MercadoPago

**Estado manejado:**
```javascript
{
  selectedPlan: {},
  loading: false,
  error: null,
  preferenceId: null
}
```

### PaymentSuccess
Página de confirmación después de pago exitoso.

**Elementos:**
- Mensaje de éxito
- Resumen del plan adquirido
- Fecha de activación
- Botón para ir al dashboard

### PaymentHistory
Lista de transacciones del usuario.

**Información mostrada:**
- Fecha de transacción
- Plan adquirido
- Monto pagado
- Estado (aprobado, pendiente, rechazado)
- ID de transacción MercadoPago

## Integración con MercadoPago

### Flujo Completo

1. **Crear Preferencia**
```javascript
const handleCheckout = async () => {
  const response = await paymentService.createPreference(planId);
  window.location.href = response.data.initPoint;
};
```

2. **Redirect a MercadoPago**
Usuario completa el pago en la plataforma de MercadoPago.

3. **Callback URLs**
- Success: `/payment/success?collection_id={id}`
- Failure: `/payment/failure`
- Pending: `/payment/pending`

4. **Webhook Backend**
MercadoPago notifica al backend sobre el estado del pago.

5. **Actualización de Suscripción**
Backend actualiza el plan del usuario en la base de datos.

## Rutas

```javascript
<Route path="/plans" element={<PlanSelection />} />
<Route path="/checkout/:planId" element={<Checkout />} />
<Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/failure" element={<PaymentFailure />} />
<Route path="/payment/history" element={<PaymentHistory />} />
```