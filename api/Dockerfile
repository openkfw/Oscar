# take default image of node carbon
FROM node:14-alpine

# set /app directory as default working directory
RUN mkdir /app
WORKDIR /app

# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
COPY --chown=node:node package.json yarn.lock ./

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn --frozen-lockfile

ENV NODE_ENV production

# copy all file from current dir to /app in container
COPY --chown=node:node . .

USER node

# cmd to start service
CMD [ "yarn", "start" ]
