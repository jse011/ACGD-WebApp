# Step 1: Build the app in image 'builder'
#FROM node:16.0.0-alpine AS builder

#WORKDIR /usr/src/app
#COPY . .
#RUN yarn && yarn build

#RUN npm install --save --legacy-peer-deps
#RUN npm install
#RUN npm run build

# Step 2: Use build output from 'builder'
#FROM nginx:stable-alpine
#LABEL version="1.0"

#COPY nginx.conf /etc/nginx/nginx.conf

#WORKDIR /usr/share/nginx/html
#COPY --from=builder /usr/src/app/dist/my-angular-app/ .

# Fijarse, que se le agregó (AS build-env) a esta línea
#FROM node:16.0.0-alpine AS build-env

#WORKDIR /app

#COPY . ./

#RUN npm install
#RUN npm run build

#FROM nginx:stable-alpine
#LABEL version="1.0"

#COPY --from=build-env /app/dist/ACGD-WEBAPP/ /usr/share/nginx/html

#COPY ./nginx.conf /etc/nginx/conf.d/default.conf

#CMD ["nginx", "-g", "daemon off;"]

### STAGE 1:BUILD ###
# Defining a node image to be used as giving it an alias of "build"
# Which version of Node image to use depends on project dependencies 
# This is needed to build and compile our code 
# while generating the docker image
FROM node:16.0.0-alpine AS build
# Create a Virtual directory inside the docker image
WORKDIR /dist/src/app
# Copy files to virtual directory
# COPY package.json package-lock.json ./
# Run command in Virtual directory
RUN npm cache clean --force
# Copy files from local machine to virtual directory in docker image
COPY . .
RUN npm install
#RUN npm run build --prod
RUN npm run dev

### STAGE 2:RUN ###
# Defining nginx image to be used
FROM nginx:latest AS ngi
# Copying compiled code and nginx config to different folder
# NOTE: This path may change according to your project's output folder 
COPY --from=build /dist/src/app/dist/ACGD-WebApp /usr/share/nginx/html
COPY /nginx.conf  /etc/nginx/conf.d/default.conf
# Exposing a port, here it means that inside the container 
# the app will be using Port 80 while running
EXPOSE 80
#export PATH="$PATH:/Applications/Docker.app/Contents/Resources/bin/"
#docker build -t ng-docker-app:v1.0.0 -f ./Dockerfile .
#docker run -p 8000:80 -d ng-docker-app:v1.0.0