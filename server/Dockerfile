FROM node:18

WORKDIR /usr/src/app
# Изменено место указания package
COPY ./server/package*.json ./ 
COPY ./prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY ./server .

CMD ["npm", "start"]