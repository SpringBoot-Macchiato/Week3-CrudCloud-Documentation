# Despliegue con Docker

## Prerequisitos

- Docker 24.x+
- Docker Compose 2.x+

## Estructura de Archivos

```
project-root/
├── frontend/
│   ├── Dockerfile
│   └── ...
├── backend/
│   ├── Dockerfile
│   └── ...
└── docker-compose.yml
```

## Dockerfile - Frontend

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Dockerfile - Backend

```dockerfile
# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Production stage
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

## docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: crudcloud-db
    environment:
      POSTGRES_DB: crudcloud
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - crudcloud-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: crudcloud-backend
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/crudcloud
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      MERCADOPAGO_ACCESS_TOKEN: ${MP_ACCESS_TOKEN}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - crudcloud-network
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: crudcloud-frontend
    environment:
      REACT_APP_API_URL: http://localhost:8080/api
    ports:
      - "3000:80"
    depends_on:
      - backend
    networks:
      - crudcloud-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  crudcloud-network:
    driver: bridge
```

## Variables de Entorno (.env)

Crear archivo `.env` en la raíz:

```env
DB_PASSWORD=your_db_password
JWT_SECRET=your_super_secret_jwt_key_here_at_least_256_bits
MP_ACCESS_TOKEN=your_mercadopago_token
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Comandos

### Construir Imágenes

```bash
docker-compose build
```

### Iniciar Servicios

```bash
docker-compose up -d
```

### Ver Logs

```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Detener Servicios

```bash
docker-compose down
```

### Detener y Eliminar Volúmenes

```bash
docker-compose down -v
```

### Reiniciar un Servicio

```bash
docker-compose restart backend
```

## Verificación

1. **Base de Datos**: 
   ```bash
   docker exec -it crudcloud-db psql -U postgres -d crudcloud
   ```

2. **Backend API**: 
   ```
   http://localhost:8080/actuator/health
   ```

3. **Frontend**: 
   ```
   http://localhost:3000
   ```

## Troubleshooting

### Error de Conexión a Base de Datos

Verificar que el servicio postgres esté running:
```bash
docker-compose ps
```

### Backend no Inicia

Ver logs detallados:
```bash
docker-compose logs backend
```

### Frontend no Carga

Verificar configuración de API URL y reiniciar:
```bash
docker-compose restart frontend
```

## Optimizaciones Opcionales

### Multi-stage Build con Cache

```dockerfile
# En Dockerfile del backend
RUN --mount=type=cache,target=/root/.m2 mvn clean package -DskipTests
```

### Health Checks

Agregar a docker-compose.yml:
```yaml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```