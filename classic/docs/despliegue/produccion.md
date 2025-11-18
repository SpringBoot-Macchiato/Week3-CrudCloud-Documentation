# Despliegue en Producción (VPS)

## Requisitos

- VPS con Ubuntu 22.04 o superior
- Dominio configurado (ejemplo: `crudzaso.com`)
- Subdominios: 
  - `api.crudzaso.com` → Backend
  - `docs.macchiato.crudzaso.com` → Documentación

## Instalación de Dependencias

```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose -y

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
```

## Configuración del VPS

### 1. Clonar Repositorios

```bash
cd /opt
sudo git clone https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Frontend.git frontend
sudo git clone https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Backend.git backend
```

### 2. Configurar Variables de Entorno

```bash
cd /opt
sudo nano .env
```

Contenido:
```env
DB_PASSWORD=production_db_password
JWT_SECRET=production_jwt_secret_key_256_bits
MP_ACCESS_TOKEN=production_mercadopago_token
GOOGLE_CLIENT_ID=production_google_client_id
GOOGLE_CLIENT_SECRET=production_google_client_secret
```

### 3. docker-compose.yml para Producción

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
      - /opt/data/postgres:/var/lib/postgresql/data
    networks:
      - crudcloud-network
    restart: always

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: crudcloud-backend
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/crudcloud
      SPRING_DATASOURCE_USERNAME: postgres
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      MERCADOPAGO_ACCESS_TOKEN: ${MP_ACCESS_TOKEN}
      GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID}
      GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET}
    expose:
      - "8080"
    depends_on:
      - postgres
    networks:
      - crudcloud-network
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: crudcloud-frontend
    environment:
      REACT_APP_API_URL: https://api.crudzaso.com/api
    expose:
      - "80"
    depends_on:
      - backend
    networks:
      - crudcloud-network
    restart: always

  nginx:
    image: nginx:alpine
    container_name: crudcloud-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - backend
      - frontend
    networks:
      - crudcloud-network
    restart: always

networks:
  crudcloud-network:
    driver: bridge
```

## Configuración de Nginx

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    # Backend API
    server {
        listen 80;
        server_name api.crudzaso.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$host$request_uri;
        }
    }
    
    server {
        listen 443 ssl;
        server_name api.crudzaso.com;
        
        ssl_certificate /etc/letsencrypt/live/api.crudzaso.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/api.crudzaso.com/privkey.pem;
        
        location / {
            proxy_pass http://backend:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    
    # Frontend
    server {
        listen 80;
        server_name crudzaso.com www.crudzaso.com;
        
        location / {
            return 301 https://$host$request_uri;
        }
    }
    
    server {
        listen 443 ssl;
        server_name crudzaso.com www.crudzaso.com;
        
        ssl_certificate /etc/letsencrypt/live/crudzaso.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/crudzaso.com/privkey.pem;
        
        location / {
            proxy_pass http://frontend:80;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

## Certificados SSL con Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificados
sudo certbot --nginx -d api.crudzaso.com
sudo certbot --nginx -d crudzaso.com -d www.crudzaso.com
sudo certbot --nginx -d docs.macchiato.crudzaso.com

# Renovación automática (ya incluido en certbot)
sudo systemctl enable certbot.timer
```

## Despliegue de Documentación (Docusaurus)

```bash
cd /opt
sudo git clone https://github.com/SpringBoot-Macchiato/Week3-CrudCloud-Documentation.git docs
cd docs
sudo docker build -t crudcloud-docs .
sudo docker run -d --name crudcloud-docs -p 3001:3000 --restart always crudcloud-docs
```

### Dockerfile para Docusaurus

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
```

## Actualizar Aplicación

```bash
# Ir al directorio
cd /opt

# Pull cambios
sudo git -C frontend pull origin main
sudo git -C backend pull origin main
sudo git -C docs pull origin develop

# Rebuild y restart
sudo docker-compose down
sudo docker-compose build
sudo docker-compose up -d

# Ver logs
sudo docker-compose logs -f
```

## Script de Actualización Automática

```bash
#!/bin/bash
# update.sh

cd /opt

echo "Pulling latest changes..."
git -C frontend pull origin main
git -C backend pull origin main

echo "Rebuilding containers..."
docker-compose down
docker-compose build --no-cache
docker-compose up -d

echo "Deployment complete!"
docker-compose ps
```

Dar permisos:
```bash
sudo chmod +x /opt/update.sh
```

## Monitoreo

### Ver Logs en Tiempo Real

```bash
sudo docker-compose logs -f
```

### Ver Estado de Contenedores

```bash
sudo docker-compose ps
```

### Verificar Uso de Recursos

```bash
sudo docker stats
```

## Backup de Base de Datos

```bash
# Crear backup
sudo docker exec crudcloud-db pg_dump -U postgres crudcloud > backup_$(date +%Y%m%d).sql

# Restaurar backup
cat backup_20240115.sql | sudo docker exec -i crudcloud-db psql -U postgres crudcloud
```

## Firewall (UFW)

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Consideraciones de Seguridad

1. Cambiar contraseñas por defecto
2. Usar variables de entorno para secretos
3. Habilitar firewall
4. Actualizar regularmente el sistema
5. Configurar backups automáticos
6. Monitorear logs de acceso