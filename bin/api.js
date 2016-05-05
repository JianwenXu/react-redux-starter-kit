#!/usr/bin/env node

require('./babel-reg');

var server = require('./api.babel');
server.start();
