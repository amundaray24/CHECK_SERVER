FROM node:18.13.0 as builder

RUN apt-get update

RUN apt-get install -y libnss3-dev libgtk-3-dev gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils

RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

RUN dpkg -i google-chrome-stable_current_amd64.deb; apt-get -fy install

FROM builder

WORKDIR /usr/app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm install --production

COPY . .

ENTRYPOINT ["npm", "start"]