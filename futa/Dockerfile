# syntax=docker/dockerfile:1

FROM golang:alpine

WORKDIR /app

COPY env-dev.env ./
COPY moechat ./
RUN chmod +x ./moechat

EXPOSE 3005

CMD [ "././moechat" ]
