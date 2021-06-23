# create .env file in root folder
[[ -e .env ]] || cp .env.example .env

# create .env file in frontend folder
cd frontend

[[ -e .env ]] || cp .env.example .env

# install node modules in root, api and frontend folders
yarn
cd ../api
yarn
cd ../initial-data-load
yarn

# text about succesfull instalation
green=`tput setaf 2`
echo "
${green}First install and configuration completed
"
