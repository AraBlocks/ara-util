FROM ubuntu:18.04
MAINTAINER "Madeline Cameron <madeline@littlstar.com>"

## Image dependencies
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get -y install git curl build-essential python

ARG dir

## Mount working directory
COPY $dir /usr/local/app

## Use mount as working directory
WORKDIR /usr/local/app

## ssh key
RUN mkdir -p /root/.ssh/
COPY ./config/id_rsa /home/root/.ssh/
COPY ./config/id_rsa /root/.ssh/
RUN chmod 0600 /root/.ssh/id_rsa
RUN eval $(ssh-agent -s) && ssh-add /root/.ssh/id_rsa
RUN ssh-keyscan github.com >> /root/.ssh/known_hosts
RUN echo "IdentityFile /root/.ssh/id_rsa" >> /etc/ssh/ssh_config

ENV NVM_DIR /usr/local/nvm

## Install Node
RUN ./scripts/nave usemain stable

RUN curl -o- https://raw.githubusercontent.com/AraBlocks/tools/master/setup.sh?token=ADil2DM0xaSMe1AtxA-JI0u3i_dgXT57ks5boUAiwA%3D%3D | bash

RUN npm install && true