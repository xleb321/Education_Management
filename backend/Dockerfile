FROM node:22

WORKDIR /usr/src/app

RUN npm install -g npm@latest

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]