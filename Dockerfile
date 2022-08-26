FROM node:14.15.3-alpine

RUN apk update && apk add bash

RUN mkdir -p /home/node/app/node_modules

ARG PORT
ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /app
COPY tsconfig.json /app
COPY tsconfig.build.json /app
COPY src /app/src
COPY contracts /app/contracts
COPY ormconfig.ts /app
COPY package.json /app
COPY yarn.lock /app
COPY .env /app

RUN yarn install --network-timeout 100000
RUN yarn build:prod
RUN yarn postbuild:prod
CMD [ "yarn", "start:prod" ]
