import WebpackDevMiddleware from 'webpack-dev-middleware';
import _debug from 'debug';
import config from '../../config';

const paths = config.utils_paths;
const debug = _debug('app:server:webpack-dev');

export default function (compiler, publicPath) {
  debug('Enable webpack dev middleware.');

  const middleware = WebpackDevMiddleware(compiler, {
    publicPath,
    contentBase: paths.client(),
    hot: true,
    quiet: config.compiler_quiet,
    noInfo: config.compiler_quiet,
    lazy: false,
    stats: config.compiler_stats
  });
  return middleware;
}
