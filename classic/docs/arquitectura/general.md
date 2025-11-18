# Arquitectura General

## Visión General

Week3-CrudCloud implementa una arquitectura cliente-servidor con separación clara de responsabilidades.

## Componentes Principales

### Frontend (React)
- **Capa de Presentación**: Componentes React para UI/UX
- **Capa de Servicios**: Módulos para comunicación con API
- **Gestión de Estado**: Context API / Redux para estado global
- **Enrutamiento**: React Router para navegación SPA

### Backend (Spring Boot)
- **Capa de Controladores**: REST API endpoints
- **Capa de Servicios**: Lógica de negocio
- **Capa de Repositorios**: Acceso a datos con JPA
- **Seguridad**: Spring Security + JWT + OAuth2

### Base de Datos
- **PostgreSQL**: Almacenamiento persistente
- **Esquema Relacional**: Usuarios, Planes, Instancias, Pagos

### Servicios Externos
- **MercadoPago**: Procesamiento de pagos
- **Google OAuth2**: Autenticación social

## Diagrama de Arquitectura

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │ HTTP/HTTPS
┌──────▼──────┐
│   Frontend  │
│    React    │
└──────┬──────┘
       │ REST API
┌──────▼──────┐      ┌────────────┐
│   Backend   │◄─────┤  Google    │
│ Spring Boot │      │   OAuth2   │
└──────┬──────┘      └────────────┘
       │
┌──────▼──────┐      ┌────────────┐
│ PostgreSQL  │      │ MercadoPago│
│  Database   │      │    API     │
└─────────────┘      └────────────┘
```

## Patrones de Diseño

- **MVC**: Separación en Modelo-Vista-Controlador
- **Repository Pattern**: Abstracción de acceso a datos
- **Service Layer**: Encapsulación de lógica de negocio
- **DTO Pattern**: Transferencia de datos entre capas