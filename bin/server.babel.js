'use strict';

/**
 * Module dependencies.
 */
import config from '../config';

const port = config.server_port;

function start () {
  const app = require('../server/main');
  const http = require('http');
  const debug = require('debug')('app:bin:server');

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
  debug(`Server is now running at http://${config.server_host}:${port}.`);
  debug(`Server accessible via localhost:${port} if you are using the project defaults.`);
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
