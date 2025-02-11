FROM oven/bun:latest

WORKDIR /usr/src/app

COPY . .

RUN bun install
RUN bun run build

FROM nginx:1.19.6-alpine

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html

COPY .docker/nginx/default /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
