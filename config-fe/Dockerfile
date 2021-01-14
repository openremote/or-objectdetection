# pull official base image
FROM node:alpine
# set working directory
WORKDIR /usr/src/app
# install app dependencies

ENV API_URL = "http://backend:5000"
COPY package*.json ./
RUN npm install --production
# add app
COPY . .
EXPOSE 3000
# start app

CMD ["npm", "start"]