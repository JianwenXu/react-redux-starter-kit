const fs = require('fs-extra');
const debug = require('debug')('app:bin:compile');
const webpackCompiler = require('./compiler');
const webpackConfig = require('../config/webpack.config');
const projectConfig = require('../config/project.config');

const paths = projectConfig.utils_paths;

const compile = () => {
  debug('Starting compiler.');
  return Promise.resolve()
    .then(() => webpackCompiler(webpackConfig))
    .then(stats => {
      if (stats.warnings.length && projectConfig.compiler_fail_on_warning) {
        throw new Error('Config set to fail on warning, exiting with status code "1".');
      }
      debug('Copying static assets to dist folder.');
      fs.copySync(paths.public(), paths.dist());
    })
    .then(() => {
      debug('Compilation completed successfully.');
    })
    .catch((err) => {
      debug('Compiler encountered an error.', err);
      process.exit(1);
    });
};

compile();
