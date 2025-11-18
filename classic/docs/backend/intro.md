# Backend - Introducción

## Descripción

API REST desarrollada en Spring Boot que gestiona la lógica de negocio, autenticación, persistencia de datos e integraciones externas para Week3-CrudCloud.

## Ramas Principales

### `develop`
Rama principal de desarrollo con todas las features integradas.

### `Feature/instances`
Gestión de instancias cloud (CRUD completo):
- Crear instancias
- Listar instancias por usuario
- Actualizar configuración
- Eliminar instancias

### `Feature/Users-Plans`
Relación entre usuarios y sus planes de suscripción:
- Asignación de planes a usuarios
- Historial de cambios de plan
- Validación de límites por plan

### `Feature/Plans`
Gestión de planes de suscripción:
- CRUD de planes
- Definición de recursos por plan
- Precios y características

### `Feature/MercadoPago`
Integración con MercadoPago SDK:
- Creación de preferencias de pago
- Webhook para notificaciones
- Validación de pagos

### `Feature/Login`
Autenticación tradicional con JWT:
- Login con email/password
- Registro de usuarios
- Generación de tokens JWT
- Validación de tokens

### `Feature/Google`
Autenticación OAuth2 con Google:
- Login con cuenta Google
- Creación automática de usuarios
- Integración con Spring Security OAuth2

## Características Principales

- **REST API**: Endpoints bien estructurados
- **Spring Security**: Autenticación y autorización
- **JPA/Hibernate**: ORM para persistencia
- **DTO Pattern**: Separación de entidades y DTOs
- **Exception Handling**: Manejo centralizado de errores
- **Validation**: Validación de datos con Bean Validation

## Instalación

```bash
git clone https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Backend.git
cd Week3-CrudCloud-Backend
mvn clean install
```

## Variables de Entorno

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/crudcloud
spring.datasource.username=postgres
spring.datasource.password=password
jwt.secret=your_jwt_secret_key
mercadopago.access.token=your_mp_token
spring.security.oauth2.client.registration.google.client-id=your_client_id
spring.security.oauth2.client.registration.google.client-secret=your_client_secret
```

## Ejecutar en Desarrollo

```bash
mvn spring-boot:run
```

API disponible en `http://localhost:8080`