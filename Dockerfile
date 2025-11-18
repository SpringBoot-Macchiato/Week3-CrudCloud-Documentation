FROM node:20-alpine
WORKDIR /app
COPY classic/package.json ./
COPY classic/package-lock.json* ./
RUN npm install
COPY classic/ .
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "serve", "--", "--port", "3001", "--host", "0.0.0.0"]