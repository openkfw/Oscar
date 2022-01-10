FROM node:14-alpine3.15 as builder

RUN mkdir /app
WORKDIR /app

COPY --chown=node:node package.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY --chown=node:node . .

ARG REACT_APP_WEBSITE_TITLE=Oscar
RUN yarn build

######

FROM nginx:stable-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY proxy/nginx.conf /etc/nginx/conf.d/default.conf.template
COPY start.sh /etc/nginx/conf.d/start.sh

CMD sh /etc/nginx/conf.d/start.sh
