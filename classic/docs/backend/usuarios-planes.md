# Módulo de Usuarios y Planes

## Descripción

Gestiona la relación entre usuarios y planes de suscripción, incluyendo asignación, cambios y validación de límites.

## Entidad User

```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String password; // BCrypt hashed
    private String provider; // "local", "google"
    private String providerId;
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "user")
    private List<UserPlan> userPlans;
    
    @OneToMany(mappedBy = "user")
    private List<Instance> instances;
}
```

## Entidad UserPlan

Relación muchos a muchos entre User y Plan con información adicional.

```java
@Entity
@Table(name = "user_plans")
public class UserPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "plan_id")
    private Plan plan;
    
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status; // "active", "expired", "cancelled"
    private String paymentId; // Referencia a pago
}
```

## Funcionalidades

### Asignar Plan a Usuario

Se ejecuta automáticamente después de un pago exitoso.

```java
public UserPlan assignPlan(Long userId, Long planId, String paymentId) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    Plan plan = planRepository.findById(planId)
        .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));
    
    // Desactivar plan anterior si existe
    deactivateCurrentPlan(user);
    
    UserPlan userPlan = new UserPlan();
    userPlan.setUser(user);
    userPlan.setPlan(plan);
    userPlan.setStartDate(LocalDateTime.now());
    userPlan.setEndDate(LocalDateTime.now().plusMonths(1));
    userPlan.setStatus("active");
    userPlan.setPaymentId(paymentId);
    
    return userPlanRepository.save(userPlan);
}
```

### Obtener Plan Actual

```java
public UserPlan getCurrentPlan(Long userId) {
    return userPlanRepository.findByUserIdAndStatus(userId, "active")
        .orElse(null); // Usuario sin plan activo
}
```

### Cambiar Plan

Permite upgrade o downgrade de plan.

**Validaciones:**
- Si es downgrade, verificar que recursos actuales no excedan nuevos límites
- Calcular prorrateo (opcional)
- Actualizar fecha de renovación

### Cancelar Plan

```java
public void cancelPlan(Long userId) {
    UserPlan currentPlan = getCurrentPlan(userId);
    if (currentPlan != null) {
        currentPlan.setStatus("cancelled");
        // Mantener activo hasta endDate
        userPlanRepository.save(currentPlan);
    }
}
```

## Validación de Límites

```java
public boolean hasAvailableResources(User user, int requiredCpu, int requiredRam) {
    UserPlan currentPlan = getCurrentPlan(user.getId());
    if (currentPlan == null) return false;
    
    List<Instance> activeInstances = instanceRepository
        .findByUserIdAndStatus(user.getId(), "running");
    
    int usedCpu = activeInstances.stream().mapToInt(Instance::getCpu).sum();
    int usedRam = activeInstances.stream().mapToInt(Instance::getRam).sum();
    
    return (usedCpu + requiredCpu) <= currentPlan.getPlan().getMaxCpu()
        && (usedRam + requiredRam) <= currentPlan.getPlan().getMaxRam();
}
```

## Repository

```java
public interface UserPlanRepository extends JpaRepository<UserPlan, Long> {
    Optional<UserPlan> findByUserIdAndStatus(Long userId, String status);
    List<UserPlan> findByUserId(Long userId);
    Optional<UserPlan> findByPaymentId(String paymentId);
}
```