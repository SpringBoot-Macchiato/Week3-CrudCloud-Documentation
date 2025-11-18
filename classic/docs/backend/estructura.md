# Estructura del Backend

## Árbol de Directorios

```
src/main/java/com/macchiato/crudcloud/
├── controller/
│   ├── AuthController.java
│   ├── InstanceController.java
│   ├── PlanController.java
│   ├── UserController.java
│   └── PaymentController.java
├── service/
│   ├── AuthService.java
│   ├── InstanceService.java
│   ├── PlanService.java
│   ├── UserService.java
│   └── PaymentService.java
├── repository/
│   ├── UserRepository.java
│   ├── InstanceRepository.java
│   ├── PlanRepository.java
│   └── PaymentRepository.java
├── model/
│   ├── User.java
│   ├── Instance.java
│   ├── Plan.java
│   ├── UserPlan.java
│   └── Payment.java
├── dto/
│   ├── request/
│   │   ├── LoginRequest.java
│   │   ├── RegisterRequest.java
│   │   ├── InstanceRequest.java
│   │   └── PaymentRequest.java
│   └── response/
│       ├── AuthResponse.java
│       ├── InstanceResponse.java
│       └── PaymentResponse.java
├── security/
│   ├── JwtAuthenticationFilter.java
│   ├── JwtTokenProvider.java
│   ├── SecurityConfig.java
│   └── OAuth2SuccessHandler.java
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   └── UnauthorizedException.java
├── config/
│   ├── CorsConfig.java
│   ├── MercadoPagoConfig.java
│   └── SwaggerConfig.java
└── util/
    ├── DateUtils.java
    └── ValidationUtils.java

resources/
├── application.properties
└── application-prod.properties
```

## Capas de la Aplicación

### Controller
Endpoints REST que reciben requests HTTP.
- Validación de entrada
- Mapeo de DTOs
- Delegación a servicios
- Manejo de responses

### Service
Lógica de negocio de la aplicación.
- Operaciones complejas
- Validaciones de negocio
- Coordinación entre repositorios
- Integración con servicios externos

### Repository
Acceso a datos usando Spring Data JPA.
- Queries automáticas
- Queries personalizadas (@Query)
- Interacción con base de datos

### Model
Entidades JPA que representan tablas de base de datos.
- Anotaciones JPA (@Entity, @Table, @Column)
- Relaciones entre entidades
- Constraints de base de datos

### DTO
Data Transfer Objects para comunicación API.
- Request DTOs: Datos de entrada
- Response DTOs: Datos de salida
- Separación de modelo interno

### Security
Configuración de seguridad y JWT.
- Filtros de autenticación
- Generación y validación de tokens
- Configuración de endpoints públicos/privados

### Exception
Manejo centralizado de excepciones.
- GlobalExceptionHandler con @ControllerAdvice
- Excepciones personalizadas
- Respuestas de error estandarizadas

### Config
Configuraciones de beans y servicios externos.
- CORS configuration
- MercadoPago SDK
- Swagger/OpenAPI

## Patrón de Arquitectura

```
Controller → Service → Repository → Database
    ↓          ↓
   DTO    Business Logic
```