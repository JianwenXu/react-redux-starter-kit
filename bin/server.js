#!/usr/bin/env node

require('./babel-reg');

var server = require('./server.babel');
server.start();
