'use strict';

const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const util = require('../lib/util');
const log4js = require('../lib/log4js');

const hello = require('./routes/hello');

const app = express();

// security settings
app.disable('x-powered-by');

// middleware setup
app.use(express.static(path.join(__dirname, 'public')));
app.use(compress()); // gzip
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// Routing setup
app.use('/', hello);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');

  log4js.logError(req.originalUrl);
  log4js.logError(err);
  err.status = 404;

  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    log4js.logError(req.originalUrl);
    log4js.logError(err);
    res.status(err.status || 500);
    res.json(util.error(err.message, err.status, err));
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    log4js.logError(req.originalUrl);
    log4js.logError(err);
    res.status(err.status || 500);
    res.json(util.error(err.message, err.status));
  });
}

process.on('uncaughtException', function (err) {
  log4js.logError('System Error:');
  log4js.logError(err);
});

module.exports = app;
