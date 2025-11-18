# Flujo de Comunicación

## Frontend → Backend

### 1. Autenticación

```
Usuario → Login Form → POST /api/auth/login → JWT Token → LocalStorage → Headers
```

- Usuario ingresa credenciales
- Frontend envía POST a `/api/auth/login`
- Backend valida y retorna JWT
- Token se almacena y se incluye en headers subsecuentes

### 2. Gestión de Instancias

```
Usuario → Dashboard → GET /api/instances → Muestra Lista
Usuario → Crear → POST /api/instances → Actualiza Vista
```

### 3. Proceso de Pago

```
Usuario → Selecciona Plan → POST /api/payments/create-preference
Backend → MercadoPago API → Preference ID
Frontend → Redirect a MercadoPago
MercadoPago → Callback → POST /api/payments/webhook
Backend → Actualiza Plan del Usuario
```

## Flujo de Autenticación JWT

1. **Login**: Usuario envía credenciales
2. **Validación**: Backend verifica contra base de datos
3. **Token Generation**: Genera JWT con claims (userId, roles)
4. **Response**: Retorna token al frontend
5. **Storage**: Frontend almacena en localStorage
6. **Authorization**: Cada request incluye header `Authorization: Bearer <token>`
7. **Validation**: Backend valida token en cada request

## Flujo OAuth2 (Google)

1. Usuario hace clic en "Login with Google"
2. Redirect a Google OAuth consent screen
3. Usuario autoriza aplicación
4. Google redirect con authorization code
5. Backend intercambia code por access token
6. Backend obtiene perfil del usuario
7. Crea/actualiza usuario en base de datos
8. Genera JWT propio
9. Retorna token al frontend

## Comunicación Asíncrona

- **Axios Interceptors**: Manejo automático de tokens y errores
- **Error Handling**: Responses 401 → redirect a login
- **Loading States**: Feedback visual durante peticiones