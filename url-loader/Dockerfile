# take default image of node carbon
FROM node:12.18.2-alpine3.12

# set /app directory as default working directory
WORKDIR /home/node

# only copy package.json initially so that `RUN yarn` layer is recreated only
# if there are changes in package.json
ADD package.json yarn.lock ./

ENV NODE_ENV production

# --pure-lockfile: Don’t generate a yarn.lock lockfile
RUN yarn --frozen-lockfile

# ADD client/package.json client/yarn.lock /app/client/

# WORKDIR /app/client
# RUN yarn --pure-lockfile

# copy all file from current dir to /app in container
COPY . .

# cmd to start service
CMD [ "yarn", "start" ]
