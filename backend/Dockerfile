# Dockerfile para Backend - CapyGaming
FROM node:20-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto
EXPOSE 3001

# Variables de entorno por defecto (se sobrescriben con docker-compose)
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD ["node", "server.js"]