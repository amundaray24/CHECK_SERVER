FROM node:18.13.0

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

RUN apt-get update

RUN apt-get install -y libnss3-dev libgtk-3-dev libasound2

COPY . .

ENTRYPOINT ["npm", "start"]