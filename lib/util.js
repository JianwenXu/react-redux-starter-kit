'use strict';

/**
 * Utilities
 */
exports = module.exports = {
  isEmpty: function (str) {
    return (!str || str.trim().length === 0);
  },

  /**
   * 成功的请求返回
   */
  success: function (data) {
    return wrapResponse(0, data);
  },

  /**
   * 失败的请求返回
   */
  error: function (message, code, data) {
    return wrapResponse(nullCheck(code, 500), nullCheck(data, {}), message);
  },

  /**
   * Retrive message from a native JavaScript Error.
   */
  getErrorMessage: function (err, fallback) {
    return nullCheck(err.message, nullCheck(fallback, ''));
  }
};

/**
 * 规范化返回数据格式
 */
function wrapResponse (errCode, data, errMsg) {
  return {
    errcode: errCode,
    errmsg: nullCheck(errMsg, ''),
    data: data
  };
}

function nullCheck (value, fallback) {
  return value || fallback;
}
