# Estructura del Frontend

## Árbol de Directorios

```
src/
├── components/
│   ├── common/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Modal/
│   │   └── Loader/
│   ├── layout/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Sidebar/
│   └── features/
│       ├── Auth/
│       ├── Instances/
│       ├── Plans/
│       └── Payments/
├── pages/
│   ├── Home/
│   ├── Login/
│   ├── Register/
│   ├── Dashboard/
│   ├── Plans/
│   └── Payment/
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── instanceService.js
│   ├── planService.js
│   └── paymentService.js
├── context/
│   ├── AuthContext.jsx
│   └── AppContext.jsx
├── hooks/
│   ├── useAuth.js
│   └── useApi.js
├── utils/
│   ├── validators.js
│   ├── formatters.js
│   └── constants.js
├── styles/
│   ├── global.css
│   └── variables.css
├── App.jsx
└── index.js
```

## Descripción de Carpetas

### `/components`
Componentes reutilizables organizados por tipo:
- **common**: Componentes genéricos (botones, inputs, modals)
- **layout**: Estructura de la aplicación (header, footer, sidebar)
- **features**: Componentes específicos de funcionalidades

### `/pages`
Páginas principales de la aplicación. Cada página es una vista completa.

### `/services`
Módulos para comunicación con backend:
- `api.js`: Configuración base de Axios
- Servicios específicos por dominio

### `/context`
Context API para estado global:
- `AuthContext`: Estado de autenticación
- `AppContext`: Estado general de la aplicación

### `/hooks`
Custom hooks reutilizables:
- `useAuth`: Lógica de autenticación
- `useApi`: Wrapper para llamadas API

### `/utils`
Utilidades y helpers:
- Validadores de formularios
- Formateadores de datos
- Constantes de la aplicación

### `/styles`
Estilos globales y variables CSS