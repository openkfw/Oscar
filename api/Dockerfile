FROM node:14-alpine as builder

# set /app directory as default working directory
RUN mkdir /app
RUN chown -R node.node /app
WORKDIR /app

# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
COPY --chown=node:node package.json yarn.lock ./

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn --frozen-lockfile && yarn cache clean

ENV NODE_ENV production

# copy all file from current dir to /app in container
COPY --chown=node:node . .

USER node

RUN yarn build

## this is stage two , where the app actually runs

FROM node:14-alpine

WORKDIR /app

ARG NODE_ENV=production

ENV NODE_ENV=production

COPY --chown=node:node package.json yarn.lock ./

RUN yarn --frozen-lockfile && yarn cache clean

COPY --from=builder /app/dist ./dist

COPY --chown=node:node /data/* ./dist/data

USER node

CMD yarn serve
