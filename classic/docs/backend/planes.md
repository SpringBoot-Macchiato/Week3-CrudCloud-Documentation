# Módulo de Planes

## Descripción

Gestiona los planes de suscripción disponibles, definiendo recursos, precios y características de cada tier.

## Entidad Plan

```java
@Entity
@Table(name = "plans")
public class Plan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name; // "Basic", "Pro", "Enterprise"
    private String description;
    private BigDecimal price;
    private String currency; // "USD", "ARS"
    
    // Límites de recursos
    private Integer maxInstances;
    private Integer maxCpu;
    private Integer maxRam; // In GB
    private Integer maxStorage; // In GB
    
    // Características adicionales
    private Boolean backupEnabled;
    private Boolean supportPriority;
    private Integer snapshotRetention; // Days
    
    private Boolean active;
    private LocalDateTime createdAt;
}
```

## Planes Típicos

### Basic
```
Price: $9.99/month
Max Instances: 1
Max CPU: 2 cores
Max RAM: 4 GB
Max Storage: 20 GB
Backup: No
Support: Standard
```

### Pro
```
Price: $29.99/month
Max Instances: 5
Max CPU: 8 cores
Max RAM: 16 GB
Max Storage: 100 GB
Backup: Yes
Support: Priority
```

### Enterprise
```
Price: $99.99/month
Max Instances: Unlimited
Max CPU: 32 cores
Max RAM: 64 GB
Max Storage: 500 GB
Backup: Yes
Support: 24/7
```

## Funcionalidades

### Listar Planes Activos

```java
public List<Plan> getActivePlans() {
    return planRepository.findByActiveTrue();
}
```

### Obtener Detalle de Plan

```java
public PlanResponse getPlanDetails(Long planId) {
    Plan plan = planRepository.findById(planId)
        .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));
    return mapToPlanResponse(plan);
}
```

### Crear/Actualizar Plan (Admin)

Solo usuarios con rol ADMIN pueden crear o modificar planes.

```java
@PreAuthorize("hasRole('ADMIN')")
public Plan createPlan(PlanRequest request) {
    Plan plan = new Plan();
    plan.setName(request.getName());
    plan.setPrice(request.getPrice());
    plan.setMaxInstances(request.getMaxInstances());
    // ... set other properties
    plan.setActive(true);
    plan.setCreatedAt(LocalDateTime.now());
    return planRepository.save(plan);
}
```

### Comparar Planes

Endpoint para mostrar tabla comparativa de features.

```java
public List<PlanComparisonDTO> comparePlans() {
    List<Plan> plans = getActivePlans();
    return plans.stream()
        .map(this::mapToComparisonDTO)
        .collect(Collectors.toList());
}
```

## Validaciones

### Downgrade de Plan

Al cambiar a plan inferior, validar que recursos actuales no excedan límites:

```java
public boolean canDowngrade(User user, Plan newPlan) {
    List<Instance> activeInstances = instanceRepository
        .findByUserIdAndStatus(user.getId(), "running");
    
    int totalCpu = activeInstances.stream().mapToInt(Instance::getCpu).sum();
    int totalRam = activeInstances.stream().mapToInt(Instance::getRam).sum();
    
    return activeInstances.size() <= newPlan.getMaxInstances()
        && totalCpu <= newPlan.getMaxCpu()
        && totalRam <= newPlan.getMaxRam();
}
```

## Repository

```java
public interface PlanRepository extends JpaRepository<Plan, Long> {
    List<Plan> findByActiveTrue();
    Optional<Plan> findByName(String name);
}
```

## PlanResponse DTO

```java
public class PlanResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String currency;
    private Map<String, Object> features;
    private Map<String, Integer> limits;
}
```