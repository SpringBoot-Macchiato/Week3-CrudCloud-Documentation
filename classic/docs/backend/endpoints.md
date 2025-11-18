# API Endpoints

## Base URL
http://localhost:8080/api

## Autenticación

### POST /auth/register
Registra un nuevo usuario.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": 1,
  "name": "John Doe"
}
```

### POST /auth/login
Inicia sesión con credenciales.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": 1,
  "name": "John Doe"
}
```

### POST /auth/google
Login con Google OAuth2.

**Request Body:**
```json
{
  "token": "google_id_token_here"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "userId": 1,
  "name": "John Doe"
}
```

---

## Usuarios

### GET /users/me
Obtiene información del usuario autenticado.

**Headers:**
Authorization: Bearer {token}

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00"
}
```

### GET /users/\{id\}
Obtiene información de un usuario por ID.

**Headers:**
Authorization: Bearer {token}

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-15T10:30:00"
}
```

---

## Planes

### GET /plans
Lista todos los planes activos.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Basic",
    "description": "Plan básico",
    "price": 9.99,
    "currency": "USD",
    "maxInstances": 1,
    "maxCpu": 2,
    "maxRam": 4,
    "maxStorage": 20
  },
  {
    "id": 2,
    "name": "Pro",
    "description": "Plan profesional",
    "price": 29.99,
    "currency": "USD",
    "maxInstances": 5,
    "maxCpu": 8,
    "maxRam": 16,
    "maxStorage": 100
  }
]
```

### GET /plans/\{id\}
Obtiene detalle de un plan específico.

**Response:**
```json
{
  "id": 1,
  "name": "Basic",
  "description": "Plan básico",
  "price": 9.99,
  "currency": "USD",
  "maxInstances": 1,
  "maxCpu": 2,
  "maxRam": 4,
  "maxStorage": 20
}
```

---

## Instancias

### GET /instances
Lista todas las instancias del usuario autenticado.

**Headers:**
Authorization: Bearer {token}

**Query Params (opcional):**
- status: running, stopped, terminated

**Response:**
```json
[
  {
    "id": 1,
    "name": "web-server-1",
    "type": "t2.micro",
    "status": "running",
    "cpu": 1,
    "ram": 2,
    "storage": 10,
    "region": "us-east-1",
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

### POST /instances
Crea una nueva instancia.

**Request Body:**
```json
{
  "name": "web-server-2",
  "type": "t2.small",
  "cpu": 2,
  "ram": 4,
  "storage": 20,
  "region": "us-east-1"
}
```

**Response:**
```json
{
  "id": 2,
  "name": "web-server-2",
  "status": "running",
  "createdAt": "2024-01-15T11:00:00"
}
```

### GET /instances/\{id\}
Obtiene detalle de una instancia específica.

**Response:**
```json
{
  "id": 1,
  "name": "web-server-1",
  "type": "t2.micro",
  "status": "running",
  "cpu": 1,
  "ram": 2,
  "storage": 10,
  "region": "us-east-1",
  "createdAt": "2024-01-15T10:30:00"
}
```

### PUT /instances/\{id\}
Actualiza una instancia existente.

**Request Body:**
```json
{
  "name": "web-server-2-updated",
  "cpu": 4,
  "ram": 8
}
```

### DELETE /instances/\{id\}
Elimina una instancia.

**Response:**
```json
{
  "message": "Instance deleted successfully"
}
```

---

## Pagos

### POST /payments/create-preference
Crea una preferencia de pago en MercadoPago.

**Headers:**
Authorization: Bearer {token}

**Request Body:**
```json
{
  "planId": 2
}
```

**Response:**
```json
{
  "preferenceId": "123456789-abcd-efgh",
  "initPoint": "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=..."
}
```

### POST /payments/webhook
Webhook para notificaciones de MercadoPago.

**Request Body:** (enviado por MercadoPago)
```json
{
  "type": "payment",
  "data": {
    "id": "1234567890"
  }
}
```

### GET /payments/history
Obtiene historial de pagos del usuario.

**Headers:**
Authorization: Bearer {token}

**Response:**
```json
[
  {
    "id": 1,
    "mercadoPagoId": "1234567890",
    "status": "approved",
    "amount": 29.99,
    "currency": "USD",
    "planName": "Pro",
    "createdAt": "2024-01-15T12:00:00"
  }
]
```

---

## User Plans

### GET /user-plans/current
Obtiene el plan actual del usuario.

**Headers:**
Authorization: Bearer {token}

**Response:**
```json
{
  "id": 1,
  "planName": "Pro",
  "startDate": "2024-01-15T00:00:00",
  "endDate": "2024-02-15T00:00:00",
  "status": "active"
}
```

### POST /user-plans/subscribe
Suscribe al usuario a un plan (generalmente llamado automáticamente después del pago).

---

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos inválidos
- **401 Unauthorized**: Token inválido o ausente
- **403 Forbidden**: Sin permisos para el recurso
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor
```