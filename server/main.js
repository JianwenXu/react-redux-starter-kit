import httpProxy from 'http-proxy';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
import historyApiFallback from './middleware/historyApiFallback';
import webpackDevMiddleware from './middleware/webpack-dev';
import webpackHMRMiddleware from './middleware/webpack-hmr';
import config from '../config';
import express from 'express';
import path from 'path';
import logger from 'morgan';
import compress from 'compression'; // gzip
import log4js from '../lib/log4js';

const paths = config.utils_paths;
const app = express();

app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// middleware setup
app.use(compress()); // gzip
app.use(logger('dev'));

// Proxy config
if (config.proxy.enabled) {
  const proxy = httpProxy.createProxyServer({
    target: config.proxy.options.host
  });
  // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', function (error, req, res) {
    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'application/json' });
    }
    let json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));
  });
  app.use(config.proxy.options.match, function (req, res) {
    proxy.web(req, res);
  });
}

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
let staticPath;
if (config.env === 'development') {
  // This rewrites all routes requests to the root /index.html file
  // (ignoring file requests). If you want to implement isomorphic
  // rendering, you'll want to remove this middleware.
  app.use(historyApiFallback({
    verbose: true
  }));

  const compiler = webpack(webpackConfig);

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output;

  app.use(webpackDevMiddleware(compiler, publicPath));
  app.use(webpackHMRMiddleware(compiler));

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  staticPath = paths.client('static');
} else {
  app.use(historyApiFallback({
    verbose: false,
    rewrites: [{
      from: `\/${config.app_base_name}`,
      to: `/${config.app_base_name}/`
    }]
  }));

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  staticPath = paths.base(config.dir_dist);
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
