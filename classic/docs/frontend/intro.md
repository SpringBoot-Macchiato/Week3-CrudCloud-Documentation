# Frontend - Introducción

## Descripción

Aplicación React moderna que proporciona la interfaz de usuario para Week3-CrudCloud. Implementa un diseño responsive y consume la API REST del backend.

## Ramas Principales

### `develop`
Rama principal de desarrollo con las últimas features integradas.

### `feature/backend-integration`
Implementación de servicios para consumir la API del backend. Incluye:
- Configuración de Axios
- Interceptores para JWT
- Servicios por módulo (auth, instances, plans, payments)
- Manejo centralizado de errores

### `feature/responsive`
Adaptación de componentes para diferentes tamaños de pantalla:
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px, 1440px
- Componentes adaptativos
- Menú hamburguesa para mobile

### `feature/viewsPay`
Vistas relacionadas con pagos:
- Selección de planes
- Checkout
- Confirmación de pago
- Historial de transacciones

## Características Principales

- **SPA (Single Page Application)**: Navegación sin recargas
- **Autenticación Persistente**: JWT almacenado en localStorage
- **Feedback Visual**: Loaders, toasts, mensajes de error
- **Validación de Formularios**: Client-side validation
- **Protección de Rutas**: Rutas privadas con guards

## Instalación

```bash
git clone https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Frontend.git
cd Week3-CrudCloud-Frontend
npm install
```

## Variables de Entorno

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## Ejecutar en Desarrollo

```bash
npm start
```

Disponible en `http://localhost:3000`