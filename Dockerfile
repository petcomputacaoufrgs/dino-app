FROM ubuntu as prebuild
WORKDIR /app

# Install NodeJS
RUN apt update -y && apt install curl -y
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash -
RUN apt install nodejs -y 

# Install Yarn
RUN curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null
RUN echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt update -y && apt install yarn -y

# Install Git and clone DinoApp repository
RUN apt install git -y
RUN git clone https://github.com/petcomputacaoufrgs/DinoApp && cd DinoApp

# Build branch main
RUN git checkout server && git pull
RUN yarn install --network-timeout 10000000 && yarn build

FROM nginx:stable-alpine
COPY ./server/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
