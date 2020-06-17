FROM mongo:3.2

COPY . ./db

WORKDIR /db

# RUN npm install

# RUN mongod --dbpath dataDB --port 1234

EXPOSE 1234

CMD mongod --dbpath=dataDB --port=1234
