# Módulo de Instancias

## Descripción

Gestiona el ciclo de vida completo de instancias cloud para cada usuario, incluyendo creación, actualización, consulta y eliminación.

## Entidad Instance

```java
@Entity
@Table(name = "instances")
public class Instance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String type; // e.g., "t2.micro", "t2.small"
    private String status; // "running", "stopped", "terminated"
    private Integer cpu;
    private Integer ram; // In GB
    private Integer storage; // In GB
    private String region;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

## Funcionalidades

### Crear Instancia
Valida que el usuario tenga un plan activo con recursos suficientes.

**Validaciones:**
- Usuario autenticado
- Plan activo válido
- Recursos disponibles en el plan
- Nombre único por usuario

### Listar Instancias
Retorna todas las instancias del usuario autenticado.

**Filtros opcionales:**
- Por estado (running, stopped)
- Por tipo
- Por región

### Actualizar Instancia
Permite modificar configuración de instancia existente.

**Campos editables:**
- Nombre
- Tipo (si el plan lo permite)
- CPU/RAM/Storage (dentro de límites del plan)

### Eliminar Instancia
Elimina instancia (soft delete o hard delete según configuración).

**Proceso:**
1. Valida ownership
2. Cambia estado a "terminated"
3. Libera recursos del plan
4. Elimina de base de datos (opcional)

## Límites por Plan

El sistema valida límites según el plan del usuario:

```java
public boolean canCreateInstance(User user, InstanceRequest request) {
    UserPlan userPlan = user.getCurrentPlan();
    List<Instance> activeInstances = instanceRepository.findByUserAndStatus(user, "running");
    
    int totalCpu = activeInstances.stream().mapToInt(Instance::getCpu).sum();
    int totalRam = activeInstances.stream().mapToInt(Instance::getRam).sum();
    
    return totalCpu + request.getCpu() <= userPlan.getPlan().getMaxCpu()
        && totalRam + request.getRam() <= userPlan.getPlan().getMaxRam()
        && activeInstances.size() < userPlan.getPlan().getMaxInstances();
}
```

## Estados de Instancia

- **running**: Instancia activa y funcionando
- **stopped**: Instancia detenida temporalmente
- **terminated**: Instancia eliminada

## Repository

```java
public interface InstanceRepository extends JpaRepository<Instance, Long> {
    List<Instance> findByUserId(Long userId);
    List<Instance> findByUserIdAndStatus(Long userId, String status);
    Optional<Instance> findByIdAndUserId(Long id, Long userId);
    Long countByUserIdAndStatus(Long userId, String status);
}
```