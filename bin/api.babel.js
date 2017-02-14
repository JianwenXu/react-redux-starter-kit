'use strict';

/**
 * Module dependencies.
 */
const config = require('../config/project.config');

const port = config.api_port;

function start () {
  const app = require('../api/main');
  const http = require('http');
  const debug = require('debug')('app:bin:api');

  /**
   * Get port from environment and store in Express.
   */
  app.set('port', port);

  /**
   * Create HTTP server.
   */
  const server = http.createServer(app);

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port);
  server.on('error', onError);
  debug(`API server is now running at http://${config.api_host}:${port}.`);
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

module.exports = {
  start
};
