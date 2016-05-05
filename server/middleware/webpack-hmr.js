import WebpackHotMiddleware from 'webpack-hot-middleware';
import _debug from 'debug';

const debug = _debug('app:server:webpack-hmr');

export default function (compiler, opts) {
  debug('Enable Webpack Hot Module Replacement (HMR).');

  const middleware = WebpackHotMiddleware(compiler, opts);
  return middleware;
}
