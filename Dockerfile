# Usar una imagen oficial de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración del proyecto
COPY classic/package*.json ./
COPY classic/yarn.lock ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY classic/ .

# Construir la aplicación
RUN npm run build

# Exponer el puerto 3001
EXPOSE 3001

# Comando para ejecutar la aplicación en puerto 3001
CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "3001"]