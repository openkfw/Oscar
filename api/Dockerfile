FROM node:14-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

# --frozen-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn --frozen-lockfile && yarn cache clean

COPY . .

COPY /data ./dist/data

RUN yarn build

## this is stage two , where the app actually runs

FROM node:14-alpine

WORKDIR /app

ARG NODE_ENV=production

ENV NODE_ENV=production

COPY --chown=node:node package.json yarn.lock ./

RUN yarn --frozen-lockfile && yarn cache clean

COPY --from=builder /app/dist ./dist

COPY --chown=node:node /app/dist/data ./dist/data

USER node

CMD yarn serve
