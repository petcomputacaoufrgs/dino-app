FROM ubuntu as build
WORKDIR /app
# Install Tools
RUN apt-get upgrade -y \
    && apt-get update -y \
    && apt-get install git -y
# Download Project
RUN git clone https://github.com/petcomputacaoufrgs/DinoApp
# Build
WORKDIR /app/DinoApp
RUN git checkout server \
    && git pull \
    && yarn install --production --network-timeout 10000000 && yarn build

FROM nginx:stable-alpine
COPY --from=build /app/DinoApp/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]