FROM node:20-alpine

WORKDIR /app

# archivos de dependencias de npm
COPY package.json package-lock.json* ./ 

# instalacion de dependencias
RUN npm install 

COPY . .

EXPOSE 3000

# ejecusion del servidor de desarrollo
CMD ["npm", "run", "dev"]