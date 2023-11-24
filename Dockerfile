FROM node:18

WORKDIR /app
# install the required packages for Oracle Instant Client
RUN apt-get update \
  && apt-get install -y libaio1 libaio-dev unzip

RUN wget https://download.oracle.com/otn_software/linux/instantclient/191000/instantclient-basic-linux.arm64-19.10.0.0.0dbru.zip \
    && unzip instantclient-basic-linux.arm64-19.10.0.0.0dbru.zip \
    && rm instantclient-basic-linux.arm64-19.10.0.0.0dbru.zip

ENV LD_LIBRARY_PATH="/app/instantclient_19_10"
ENV ORACLE_HOME="/app/instantclient_19_10"

# connection details
ENV DB_USERNAME="devshop2"
ENV DB_PASSWORD="dev1!"
ENV DB_CONNECTION_STRING="134.106.56.113:1521/dbprak2"

WORKDIR /usr/app

COPY ./package.json .
RUN npm install

EXPOSE 3000
