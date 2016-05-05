import 'isomorphic-fetch';
require('es6-promise').polyfill();

const API_PREFIX = '/api/hello';

export function get (path, params, resultHandler, errorHandler) {
  let url = API_PREFIX + path;
  if (params) {
    url += '?';
    params.map((param, index) => {
      if (index > 0) {
        url += '&';
      }
      url += `${param.key}=${param.value}`;
    });
  }
  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      if (resultHandler) {
        resultHandler(json);
      }
    }).catch((err) => {
      if (errorHandler) {
        errorHandler(err);
      }
    });
};

export default {
  get
};
