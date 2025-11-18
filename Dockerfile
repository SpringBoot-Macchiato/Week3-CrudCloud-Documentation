# Usar una imagen oficial de Node.js
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY classic/package.json ./
COPY classic/package-lock.json* ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY classic/ .

# Construir la aplicación
RUN npm run build

# Exponer el puerto 3001
EXPOSE 3001

# Comando para ejecutar la aplicación
CMD ["npm", "run", "serve", "--", "--port", "3001", "--host", "0.0.0.0"]