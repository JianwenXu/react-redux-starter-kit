/* eslint key-spacing:0 */
export default (config) => ({
  compiler_fail_on_warning : false,
  compiler_hash_type       : 'chunkhash',
  compiler_devtool         : null,
  compiler_stats           : {
    chunks : true,
    chunkModules : true,
    colors : true
  },
  compiler_public_path: `/${config.app_base_name}/`,
  log4js: {
    info: {
      type: 'file',
      filename: `${config.path_base}/logs/info.log`
    },
    error: {
      type: 'file',
      filename: `${config.path_base}/logs/error.log`
    },
    access: {
      type: 'file',
      filename: `${config.path_base}/logs/access.log`
    }
  }
});
