# To enable ssh & remote debugging on app service change the base image to the one below
# FROM mcr.microsoft.com/azure-functions/node:3.0-appservice
FROM mcr.microsoft.com/azure-functions/node:3.0

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY package.json package-lock.json /home/site/wwwroot/

WORKDIR /home/site/wwwroot

RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build 
