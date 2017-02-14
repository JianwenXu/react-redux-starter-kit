import superagent from 'superagent';

export const API_PREFIX = '/api' + (__BASENAME__ === '/' ? '' : __BASENAME__);

const methods = ['get', 'post', 'put', 'patch', 'del'];

export function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  // Prepend `/api` to relative URL, to proxy to API server.
  return API_PREFIX + adjustedPath;
};

// 上传超时时间（毫秒）
const TIMEOUT_MS = 30 * 60 * 1000;

function responseHandler(err, res, resolve, reject) {
  if (err) {
    let msg;
    if (err.response) {
      msg = err.response.text;
    } else if (err.error) {
      msg = err.error.message;
    }
    reject({
      errcode: err.status || -1,
      errmsg: msg || '网络错误',
      data: (err.response && err.response.body) || err.error
    });
  } else if (res.body) {
    resolve(res.body);
  } else {
    reject({
      errcode: res.status || -1,
      errmsg: '网络错误'
    });
  }
}

export default class ApiClient {
  constructor() {
    methods.forEach((method) => {
      this[method] = (path, { params, data, type = 'form' } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (method === 'post' && type) {
          request.type(type);
        }

        if (params) {
          request.query(params);
        }

        if (data) {
          request.send(data);
        }

        request.end((err, res) => {
          responseHandler(err, res, resolve, reject);
        });
      });
    });
  }

  static uploadFile(nativeObject, path, { params }, progressCallback, agentCallback, multipart = false) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      try {
        formData.append('data', nativeObject);
        const agent = superagent.post(path).timeout(TIMEOUT_MS);
        if (multipart) {
          agent.set('Content-Type', 'multipart/form-data');
        }
        if (params) {
          agent.query(params);
        }
        agent.send(formData).on('progress', (event) => {
          if (progressCallback) {
            progressCallback(event.percent || 0);
          }
        }).end((err, resp) => {
          let result = null;
          if (!err) {
            if (resp) {
              try {
                const body = JSON.parse(resp.text);
                result = {
                  hasError: false,
                  body: body
                };
              } catch (ex) {
                result = {
                  hasError: true,
                  error: { errmsg: '无法解析文件地址，上传失败！' }
                };
              }
            } else {
              result = {
                hasError: true,
                error: { errmsg: '服务器无响应，上传失败！' }
              };
            }
          } else {
            console.error('Request error: ', err);
            const errmsg = err.timeout ? '上传超时，建议减少单次上传的数据量。' : (err.response || '网络错误，上传失败！');
            result = {
              hasError: true,
              error: { errmsg }
            };
          }
          if (result.hasError) {
            reject(result);
          } else {
            resolve(result);
          }
        });
        if (agentCallback) {
          agentCallback(agent);
        }
      } catch (ex) {
        console.error('Exception while uploading: ', ex);
        reject({
          hasError: true,
          error: { errmsg: '网络错误，上传失败!' }
        });
      }
    });
  }
};
