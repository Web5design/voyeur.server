#!/usr/bin/env bash

# update apt and install basic packages
apt-get update
apt-get install -y curl python-software-properties python g++ make

# adding nodejs ppa
if [ ! -e "/etc/apt/sources.list.d/chris-lea-node_js-precise.list" ]
then
    add-apt-repository ppa:chris-lea/node.js
fi

#adding couchdb ppa
if [ ! -e "/etc/apt/sources.list.d/nilya-couchdb-1_3-precise.list" ]
then
    add-apt-repository ppa:nilya/couchdb-1.3
fi

# install nodejs and couchdb
apt-get update
apt-get install -y nodejs couchdb

# install phantomjs
cd /tmp && curl -SO https://phantomjs.googlecode.com/files/phantomjs-1.9.0-linux-x86_64.tar.bz2
tar -jxvf phantomjs-1.9.0-linux-x86_64.tar.bz2
cp phantomjs-1.9.0-linux-x86_64/bin/phantomjs /usr/local/bin/
apt-get install -y libfontconfig1-dev

# install nodejs modules
npm install -g forever yo grunt-cli bower

cd /vagrant
