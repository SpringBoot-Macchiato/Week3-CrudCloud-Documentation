# Introducción

## Week3-CrudCloud

Week3-CrudCloud es un sistema completo de gestión de instancias cloud con arquitectura distribuida, compuesto por un frontend en React y un backend en Spring Boot.

## Características Principales

- **Gestión de Instancias**: Creación, actualización y eliminación de instancias cloud
- **Sistema de Planes**: Múltiples planes de suscripción para usuarios
- **Pagos Integrados**: Integración con MercadoPago para procesamiento de pagos
- **Autenticación Múltiple**: Login tradicional y OAuth2 con Google
- **Interfaz Responsive**: Diseño adaptativo para todos los dispositivos

## Tecnologías

### Frontend
- React 18+
- React Router para navegación
- Axios para consumo de APIs
- CSS Modules / Styled Components

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- PostgreSQL
- OAuth2 Client

## Repositorios

- **Frontend**: [Week3-CrudCloud-Frontend](https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Frontend)
- **Backend**: [Week3-CrudCloud-Backend](https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Backend)
- **Documentación**: [Week3-CrudCloud-Documentation](https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Documentation)

## Inicio Rápido

1. Clonar los repositorios frontend y backend
2. Configurar variables de entorno
3. Ejecutar con Docker Compose
4. Acceder a `http://localhost:3000`

Para más detalles, consulta la sección de [Despliegue](despliegue/docker.md).