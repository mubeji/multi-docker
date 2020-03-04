# The main reason for this file is so that, we set
# a port i.e. 3000 to serve react files to the main
# routing instance of nginx from this react nginx instance

FROM node:alpine as builder 

WORKDIR /app

COPY ./package.json ./

RUN npm install

COPY . .

RUN npm run build

# Use nginx image a production server
FROM nginx

EXPOSE 3000
# Copy the default.conf file into the file system
# of this image
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# Copy over the results of npm run build
# Means, copy  /app/build  from  builder above  to /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
