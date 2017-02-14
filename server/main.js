'use strict';

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const compress = require('compression'); // gzip
const httpProxy = require('http-proxy');
const debug = require('debug')('app:server');
const historyApiFallback = require('./middleware/historyApiFallback');
const log4js = require('../lib/log4js');
const config = require('../config/project.config');

const app = express();
const paths = config.utils_paths;

if (config.env === 'production') {
  app.disable('x-powered-by');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// middleware setup
app.use(compress()); // gzip
app.use(morgan(config.env === 'production' ? 'combined' : 'dev')); // logger

// Proxy config
if (config.proxy.enabled) {
  const proxy = httpProxy.createProxyServer({
    target: config.proxy.options.host,
    proxyTimeout: 30 * 60 * 1000
  });
  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('Content-Type', req.get('Content-Type') || 'application/json; charset=UTF-8');
  });
  // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', function (error, req, res) {
    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
    }
    let json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));
  });
  app.use(config.proxy.options.match, function (req, res) {
    res.set('Content-Type', 'application/json; charset=UTF-8');
    proxy.web(req, res);
  });
}

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
let staticPath;
if (config.env === 'development') {
  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement universal
  // rendering, you'll want to remove this middleware.
  app.use(historyApiFallback({
    verbose: true
  }));

  const webpack = require('webpack');
  const webpackConfig = require('../config/webpack.config');
  const compiler = webpack(webpackConfig);

  debug('Enabling webpack dev and HMR middleware');
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: paths.client(),
    hot: true,
    quiet: config.compiler_quiet,
    noInfo: config.compiler_quiet,
    lazy: false,
    stats: config.compiler_stats
  }));
  app.use(require('webpack-hot-middleware')(compiler));

  // Serve static assets from ~/public since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  staticPath = paths.public();
} else {
  app.use(historyApiFallback({
    verbose: false,
    rewrites: [{
      from: `\/${config.app_base_name}`, // eslint-disable-line
      to: `/${config.app_base_name}/`
    }]
  }));

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  staticPath = paths.dist();
}
app.use(express.static(staticPath));

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
if (config.env === 'development') {
  app.use(function (err, req, res, next) {
    log4js.logError(req.originalUrl);
    log4js.logError(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    log4js.logError(req.originalUrl);
    log4js.logError(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

process.on('uncaughtException', function (err) {
  log4js.logError('System Error:');
  log4js.logError(err);
});

module.exports = app;
