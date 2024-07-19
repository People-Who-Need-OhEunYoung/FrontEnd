FROM node:22.3.0

WORKDIR /unoffical-document

COPY . .

COPY package*.json ./

RUN npm install -g npm@10.8.2

RUN npm i pnpm

RUN pnpm install https express http-proxy-middleware cors cheerio path

RUN npm install || true

RUN pnpm install || true

CMD ["node","server"]