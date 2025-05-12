FROM node:22.14.0-alpine

ARG ENV

ENV NODE_ENV=$ENV

RUN mkdir /app

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install 

COPY . .

EXPOSE 3000

RUN echo $ENV

ENV ENV=$ENV

CMD npm run $ENV
