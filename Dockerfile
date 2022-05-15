FROM node:16.13.0

WORKDIR /usr/src/app
COPY package*.json .
COPY config-overrides.js .
ADD views ./views
RUN npm run deploy
COPY . .

CMD [ "npm", "run", "dev" ]