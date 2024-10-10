FROM node:20-alpine3.17 AS builder

WORKDIR /app

COPY package*.json .

RUN npm ci 

COPY . .

FROM ghcr.io/patrickdappollonio/docker-http-server:v2.5.0

WORKDIR /html

ENV NODE_ENV production

COPY --from=builder /app/build/ .

COPY default.conf /etc/nginx/conf.d/

ENV PORT=80

ENTRYPOINT ["/http-server"]

CMD ["--pathprefix=/docs/", "--disable-directory-listing", "--custom-404=404.html"]
