import {
  getVersion
} from './../config/config'
(function () {
  var _Page = Page;
  Page = function (pageConfig) {
      mixinSync(pageConfig, "onLoad", onPageLoadExtra);

      // 默认分享全局配置
      var _onShareAppMessage = pageConfig.onShareAppMessage;
      _onShareAppMessage && (pageConfig.onShareAppMessage = function (options) {
          if (_onShareAppMessage) {
              var conf = _onShareAppMessage.call(this, options)
              wx.$log({
                  context: this,
                  eid: 9001,
                  act: "share",
                  params: {
                      path: conf.path
                  },
              })
              return onShareAppMessageExtra(conf);
          }
      });
      _Page(pageConfig)
  }

})();

function checkToken() {
  // 暂时不检验是否过期
  const loginData = wx.getStorageSync('loginData') || {};
  return !!loginData.token;
}

/**
 * 将扫码传递的scene【约定格式：a:1,b:2 或 a=1,b=2】挂载到options
 * 分享自带当前页面的参数
 */
function handleScene(options) {
  if (options && options.scene) {
      const {
          scene
      } = options;
      delete options.scene;
      Object.assign(options, sceneToMap(scene));
      Object.assign(this.options, options);
  }
}

// 拓展onLoad能力
async function onPageLoadExtra(conf, options, life) {
  if (wx.qy && wx.qy.enableShareToWxMenuGlobal) {
      wx.qy.enableShareToWxMenuGlobal({
          "enable": false, // 必填，boolean类型
      })
  }
  // 处理【scene】参数
  handleScene.call(this, options);
  // 注入全局状态：挂接参数到AppData，提供wxml里使用
  // await 不能去掉
  await initAppData.call(this, options);

}

// 进入页面前-必要准备
async function initAppData(options) {
  const callback = async () => {
      let isLogin = checkToken();
      console.log('已登录');
      
      const data = {
          $options: {
              ...options,
          },
          $isLogin: isLogin,
          $route: this.route,
          $version: getVersion() || "",
          CustomBar: getApp().globalData.CustomBar
      };

      console.log('options: ', options)
      wx.$log({
          context: this,
          eid: 11001,
          act: "click",
          params: {
              query: JSON.stringify(options),
              route: this.route
          },
      })
      this.setData({
          ...data,
          ...this.data
      });
  }
  
  return new Promise(async (resolve) => {
      let isLogin = checkToken();
      if (isLogin) {
          callback()
          resolve(true)
      } else {
          console.log('未登录,即将自动登录');
          wx.login({
              success: async res1 => {
                  const [err, res] = await wx.$api.login({
                      code: res1.code,
                      customerId: options.customerId || options.cid
                  })
                  if (!err) {
                      wx.setStorageSync('loginData', res.data)
                      callback()
                      resolve()
                  } else {
                      wx.removeStorageSync('loginData')
                      wx.showModal({
                          title: "登录出错",
                          content: err.message || '登录失败',
                          cancelText: "退出",
                          confirmText: "重试",
                          success: async _res => {
                              if (_res.confirm) {
                                  initAppData.call(this, options);
                              } else {
                                  wx.exitMiniProgram()
                              }
                          }
                      })
                  }
              }
          })
      }
  })
}

/**
 * 格式化扫码进入的参数，不支持参数里带有[:=]，否则解析会异常，参数不可以存在未编码的网址https://xx.com?a=1
 * @param {String} scene 
 * a:1,b:2
 * a=1,b=2
 */
function decodeURI(str) {
  if (str.indexOf('%') === -1) return str;
  return decodeURI(decodeURIComponent(str));
}

function sceneToMap(scene) {
  let decodeScene = decodeURI(scene)
  let scenes = decodeScene.split(',') || []
  let map = {
      scene
  };
  const handlerScene = (map, separator, scene) => {
      const [key, value] = scene.split(separator) || [];
      if (key)(map[key] = encodeURIComponent(value))
      return map
  }
  scenes.forEach(scene => {
      const separator = scene.indexOf('=') > -1 ? '=' : ':'
      handlerScene(map, separator, scene)
  })
  return map;
}


// 异步注入
function mixins(config, life, extendExtra) {
  const lifeHook = config[life];
  if (lifeHook) {
      config[life] = function (options) {
          extendExtra.call(this, options, life);
          lifeHook.call(this, options)
      }
  } else config[life] = function (options) {
      extendExtra.call(this, options, life)
  }
}

// 同步注入
function mixinSync(conf, life, fn) {
  const lifeHook = conf[life];
  if (lifeHook) {
      conf[life] = async function (options) {
          await fn.call(this, conf, options, life);
          console.log(life, ' 调用');
          lifeHook.call(this, options)
      }
  } else {
      conf[life] = async function (options) {
          await fn.call(this, conf, options)
      }
  }
}
