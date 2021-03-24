FROM ubuntu as build
WORKDIR /app
# Install NodeJS
RUN apt-get upgrade -y && apt-get update -y && apt-get install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash -
RUN apt-get install nodejs -y 
# Install Yarn
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null
RUN echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-key adv --refresh-keys --keyserver keyserver.ubuntu.com
RUN apt-get update -y && apt-get install yarn -y
# Install Git and clone DinoApp repository
RUN apt-get install git -y
RUN git clone https://github.com/petcomputacaoufrgs/DinoApp
# Build branch main
WORKDIR /app/DinoApp
RUN git checkout server && git pull
RUN apt-get install nasm
RUN yarn install --production --network-timeout 10000000 && yarn build

FROM nginx:stable-alpine
COPY --from=build /app/DinoApp/build /usr/share/nginx/html
COPY --from=build /app/DinoApp/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]