FROM node:18.13.0 as builder

RUN apt-get update

RUN apt-get install -y libnss3-dev libgtk-3-dev libasound2 chromium

FROM builder

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

ENTRYPOINT ["npm", "start"]