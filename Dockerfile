FROM node:lts-alpine as build
WORKDIR /app
COPY . /app
RUN yarn install --network-timeout 10000000 && yarn build

FROM nginx:stable-alpine
COPY ./server/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
