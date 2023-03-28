import {
  getAppid,
  getVersion,
  host
} from './../config/config'

const getHeader = () => {
  const loginData = wx.getStorageSync('loginData') || {}
  // console.log('getHeader loginData: ', loginData)
  return {
      'Content-Type': 'application/json',
      'Appid': getAppid(),
      'Version': getVersion(),
      'Authorization': loginData.token || "",
  }
}

const reLogin = () => {
  return new Promise((resolve) => {
      wx.login({
          success: async res1 => {
              const [err, res] = await wx.$api.login({
                  code: res1.code,
              })
              if (!err) {
                  wx.setStorageSync('loginData', res.data)
                  wx.showToast({
                      title: '自动登录成功，请重试',
                      icon: 'none'
                  })
                  resolve()
              } else {
                  wx.removeStorageSync('loginData')
                  wx.showModal({
                      title: "登录出错",
                      content: (err && err.message) || '登录失败',
                      cancelText: "取消",
                      confirmText: "重试",
                      success: async _res => {
                          if (_res.confirm) {
                              reLogin.call(this);
                          } else {
                              // wx.exitMiniProgram()
                          }
                      }
                  })
              }
          }
      })
  })
}

export function handleHttpCodeError(err) {
  // 400 Bad Request
  // 401 Unauthorized
  // 402 Payment Required
  // 403 Forbidden
  // 404 Not Found
  // 405 Method Not Allowed
  // 406 Not Acceptable
  // 407 Proxy Authentication Required
  // 408 Request Timeout
  let message = "请求出错";
  switch (err.statusCode) {
      case 400:
          message = "错误的请求";
          break;
      case 401:
          message = "没有权限";
          break;
      case 403:
          message = "服务拒绝";
          break;
      case 404:
          message = "请求地址有误";
          break;
      case 405:
          message = "请求类型错误";
          break;
      case 406:
          message = "请求头有误";
          break;
      case 408:
          message = "请求超时";
          break;
      case 500:
          message = "服务出错";
          break;
      case 502:
          message = "服务未启动";
          break;
      case 503:
          message = "服务器维护";
          break;
      case 504:
          message = "网关超时";
          break;
      case 504:
          message = "网关超时";
          break;
      default:
          message = `错误码：${err.statusCode}`;
          break
  }
  return message;
}

export function awaitWraper(promise) {
  return promise.then(({
      res,
      requestOption
  }) => {
      // 处理后端code
      if (res.data.code !== undefined && res.data.code !== 0) {
          // 200情况下业务错误收集
          wx.reportEvent("service_error_log", {
              "http_url": requestOption.url,
              "headers": JSON.stringify(requestOption.header || {}),
              "payload": JSON.stringify(requestOption.data || {}),
              "response": JSON.stringify(res.data || {})
          })
          var err = {
              message: res.data.msg || res.data.message
          };
          // 200: 与服务端通信成功，进入业务处理
          requestOption.showError && err.message && wx.showToast({
              icon: 'none',
              title: err.message
          });
          return [err, null];
      } else {
          return [null, res.data]
      }
  }).catch(({
      err,
      requestOption
  }) => {
      wx.reportEvent("request_error_log", {
          "http_url": requestOption.url,
          "status_code": err.statusCode,
          "headers": JSON.stringify(requestOption.header || {}),
          "payload": JSON.stringify(requestOption.data || {})
      })
      // 处理异常httpCode
      err.message = handleHttpCodeError(err);
      if (err.statusCode === 401) {
          reLogin();
      } else {
          requestOption.showError && err.message && wx.showToast({
              icon: 'none',
              title: err.message
          })
      }
      return [err, null];
  });
}
export default class Request {
  /**
   * 网络请求
   */
  request({
      url = '',
      data = {},
      header = {},
      method = 'get',
      showError = true
  }) {
      return awaitWraper(new Promise((resolve, reject) => {
          const requestOption = {
              url: url.startsWith('http') ? url : host + url,
              data: data,
              header: Object.assign({}, getHeader(), header),
              method: method,
              showError
          };
          wx.request({
              ...requestOption,
              // 服务端通信成功，根据状态码处理逻辑
              success: (res => {
                  console.log('[success]:', requestOption.url, requestOption, res.data)
                  if (res.statusCode === 200) {
                      resolve({
                          res,
                          requestOption
                      })
                  }
                  // 状态码非200，无权限401|服务重启中502|网络错误，提示用户错误信息
                  else {
                      // console.log('request err', res)
                      reject({
                          err: res,
                          requestOption
                      })
                  }
              }),
              // wx.request 错误，这时候，后端大多数是收不到请求的。
              fail: (err => {
                  /**
                   * err
                   * {errMsg: "request:fail invalid url "xxxhttps://www.imolacn.com/api/imola/mp/v202208/common/login""
                      errno: 600009}
                   */
                  // 模拟情况只能通过断网App-onError捕获错误回调。
                  // TODO：待补充小程序SDK错误
                  // console.log('request fail err', err, requestOption);
                  wx.getNetworkType({
                      success: (res) => {
                          console.log('getNetworkType: ', res)
                          if (res.networkType === 'none') {
                              wx.showToast({
                                  title: '网络连接不可用',
                                  duration: 5000,
                                  icon: 'none'
                              })
                          }
                      }
                  })
                  wx.reportEvent("request_fail_log", {
                      "http_url": requestOption.url,
                      "headers": JSON.stringify(requestOption.header || {}),
                      "payload": JSON.stringify(requestOption.data || {}),
                      "error": JSON.stringify(err || {}),
                  })
              })
          })
      }))
  }
}