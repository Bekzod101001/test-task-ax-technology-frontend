FROM node:18.17.1

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3000

RUN yarn build

CMD ["node", ".output/server/index.mjs"]


