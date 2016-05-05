'use strict';

import config from '../config';
const log4js = require('log4js');
const Config = config.log4js;

exports = module.exports = {
  logInfo: function (data) {
    log4js.configure({
      appenders: [
        {
          type: Config.info.type,
          filename: Config.info.filename,
          maxLogSize: 1024 * 1024 * 20,
          backups: 4,
          category: 'normal'
        }
      ]
    });
    const logger = log4js.getLogger('normal');
    logger.setLevel('INFO');
    logger.info(data);
  },

  logError: function (data) {
    log4js.configure({
      appenders: [
        {
          type: Config.error.type,
          filename: Config.error.filename,
          maxLogSize: 1024 * 1024 * 20,
          backups: 4,
          category: 'ERROR'
        }
      ]
    });
    const logger = log4js.getLogger('ERROR');
    logger.setLevel('ERROR');
    logger.error(data);
  },

  connectLogger: function () {
    log4js.configure({
      appenders: [
        {
          type: Config.access.type,
          filename: Config.access.filename,
          maxLogSize: 1024 * 1024 * 20,
          backups: 4,
          category: 'normal'
        }
      ]
    });

    const logger = log4js.getLogger('normal');
    logger.setLevel('INFO');
    return log4js.connectLogger(logger, { level: log4js.levels.INFO });
  }
};
