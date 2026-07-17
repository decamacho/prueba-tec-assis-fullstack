FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./ 

RUN npm install 

COPY . .

EXPOSE 5173

# ejecusion del servidor de desarrollo
CMD ["npm", "run", "dev", "--", "--host"]