# pull official base image
FROM node:alpine
# set working directory
WORKDIR /usr/src/app
# install app dependencies
COPY package*.json ./
RUN npm install --production
# add app
COPY . .
EXPOSE 3000
# start app
CMD ["npm", "start"]