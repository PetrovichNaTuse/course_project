FROM debian:latest

RUN mkdir project

ADD ./* /project/

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs
RUN curl https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
RUN apt-get update && apt-get install -y mongodb-org
# RUN systemctl enable mongod && systemctl start mongod

RUN cd project

RUN npm install
RUN mongod --dbpath db/dataDB --port 1234
RUN node server/server.js

EXPOSE 3076
