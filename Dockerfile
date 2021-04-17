FROM node:14.15.4-alpine3.12

USER node

WORKDIR /home/node/big-zap

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
ENTRYPOINT [ "npm", "start" ]