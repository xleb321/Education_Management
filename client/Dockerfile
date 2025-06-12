FROM node:24

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
RUN npm install axios

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]