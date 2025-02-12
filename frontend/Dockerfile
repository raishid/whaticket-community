FROM oven/bun:latest

WORKDIR /usr/src/app

ARG VITE_BACKEND_URL
ARG VITE_HOURS_CLOSE_TICKETS_AUTO
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_HOURS_CLOSE_TICKETS_AUTO=$HOURS_CLOSE_TICKETS_AUTO

COPY . .

RUN bun install
RUN bun run build

FROM nginx:1.19.6-alpine

COPY --from=0 /usr/src/app/dist /usr/share/nginx/html

COPY .docker/nginx/default /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
