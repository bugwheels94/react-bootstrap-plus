FROM node:12.14-alpine3.11

WORKDIR /home/react-bootstrap-plus
COPY . .
RUN npm i
RUN apk add git chromium