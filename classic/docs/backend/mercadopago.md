# Módulo de MercadoPago

## Descripción

Integración con MercadoPago SDK para procesar pagos de suscripciones y gestionar webhooks de notificaciones.

## Configuración

```java
@Configuration
public class MercadoPagoConfig {
    
    @Value("${mercadopago.access.token}")
    private String accessToken;
    
    @PostConstruct
    public void init() {
        MercadoPago.SDK.setAccessToken(accessToken);
    }
}
```

## Entidad Payment

```java
@Entity
@Table(name = "payments")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String mercadoPagoId;
    private String preferenceId;
    private String status; // "pending", "approved", "rejected"
    private BigDecimal amount;
    private String currency;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;
}
```

## Flujo de Pago

### 1. Crear Preferencia de Pago

```java
public PreferenceResponse createPreference(Long userId, Long planId) {
    User user = userRepository.findById(userId).orElseThrow();
    Plan plan = planRepository.findById(planId).orElseThrow();
    
    Preference preference = new Preference();
    
    Item item = new Item();
    item.setTitle(plan.getName())
        .setQuantity(1)
        .setUnitPrice(plan.getPrice());
    
    preference.appendItem(item);
    
    Payer payer = new Payer();
    payer.setEmail(user.getEmail());
    preference.setPayer(payer);
    
    // URLs de callback
    BackUrls backUrls = new BackUrls();
    backUrls.setSuccess("https://frontend-url.com/payment/success");
    backUrls.setFailure("https://frontend-url.com/payment/failure");
    backUrls.setPending("https://frontend-url.com/payment/pending");
    preference.setBackUrls(backUrls);
    
    // Notificación webhook
    preference.setNotificationUrl("https://api-url.com/api/payments/webhook");
    
    preference.save();
    
    // Guardar registro en BD
    Payment payment = new Payment();
    payment.setPreferenceId(preference.getId());
    payment.setUser(user);
    payment.setPlan(plan);
    payment.setAmount(plan.getPrice());
    payment.setStatus("pending");
    paymentRepository.save(payment);
    
    return new PreferenceResponse(preference.getId(), preference.getInitPoint());
}
```

### 2. Webhook de Notificación

MercadoPago envía notificaciones POST al endpoint configurado.

```java
@PostMapping("/webhook")
public ResponseEntity<Void> handleWebhook(@RequestBody Map<String, Object> payload) {
    String type = (String) payload.get("type");
    
    if ("payment".equals(type)) {
        Map<String, Object> data = (Map<String, Object>) payload.get("data");
        Long paymentId = Long.valueOf(data.get("id").toString());
        
        processPayment(paymentId);
    }
    
    return ResponseEntity.ok().build();
}
```

### 3. Procesar Pago

```java
private void processPayment(Long mercadoPagoPaymentId) {
    try {
        com.mercadopago.resources.Payment mpPayment = 
            com.mercadopago.resources.Payment.findById(mercadoPagoPaymentId);
        
        Payment payment = paymentRepository
            .findByPreferenceId(mpPayment.getPreferenceId())
            .orElseThrow();
        
        payment.setMercadoPagoId(mpPayment.getId().toString());
        payment.setStatus(mpPayment.getStatus());
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);
        
        if ("approved".equals(mpPayment.getStatus())) {
            // Asignar plan al usuario
            userPlanService.assignPlan(
                payment.getUser().getId(),
                payment.getPlan().getId(),
                payment.getMercadoPagoId()
            );
        }
    } catch (Exception e) {
        log.error("Error processing payment: {}", e.getMessage());
    }
}
```

## Estados de Pago

- **pending**: Pago iniciado, esperando confirmación
- **approved**: Pago aprobado exitosamente
- **rejected**: Pago rechazado
- **refunded**: Pago reembolsado
- **cancelled**: Pago cancelado

## Seguridad del Webhook

Validar que las notificaciones vengan de MercadoPago:

```java
@PostMapping("/webhook")
public ResponseEntity<Void> handleWebhook(
    @RequestBody Map<String, Object> payload,
    @RequestHeader("x-signature") String signature
) {
    if (!validateSignature(payload, signature)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
    // Process webhook...
}
```

## Repository

```java
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPreferenceId(String preferenceId);
    Optional<Payment> findByMercadoPagoId(String mercadoPagoId);
    List<Payment> findByUserId(Long userId);
    List<Payment> findByStatus(String status);
}
```