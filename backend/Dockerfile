from node:18.16.0-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 4000


CMD ["npm", "run", "start:dev"]

