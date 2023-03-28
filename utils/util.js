const sendLog = async ({
  context,
  eid,
  cid,
  params = {},
  st,
  act = 'click'
}) => {
  if (!context) console.error('context 不能为空');
  let data = {
      "id": eid,
      "p": context.route || '',
      "ps": {
          id: cid,
          ...params
      },
      "test": cid,
      "act": act,
      "st": st || Date.now(),
      "et": Date.now()
  }
  wx.$api.eventLog(data)
}

const downloadPic = (url) => {
  // 判断图片协议
  if (!url.startsWith('https')) {
      return wx.showToast({
          title: '下载必须为HTTPS路径',
          icon: 'none'
      })
  }
  // 判断保存相册授权
  return new Promise((resolve, reject) => {
      const callback = async () => {
          return await saveUrlToAlbum(url)
      }
      wx.getSetting({
          success: _ => {
              if (!_.authSetting['scope.writePhotosAlbum']) {
                  // 首次预请求保存相册权限
                  return wx.authorize({
                      scope: 'scope.writePhotosAlbum',
                      success() {
                          // 用户同意了，可以下载并保存
                          resolve(callback());
                      },
                      fail: () => {
                          // 预请求权限时被拒绝，微信将不再强制提示授权，我们自己弹引导授权
                          resolve(callback())
                      }
                  })
              } else {
                  // 已授权
                  resolve(callback())
              }
          }
      });
  })


}

function downloadFile(url, ext = '.png') {
  return new Promise((resolve, reject) => {
      wx.downloadFile({
          url,
          filePath: wx.env.USER_DATA_PATH + '/imola-' + new Date().valueOf() + ext,
          success: resolve,
          fail: reject,
      })
  })
}


/**
* 将图片网址下载到相册
* 如果拒绝，依然会model方式引导授权
* @param {string} url 
*/
async function saveUrlToAlbum(url) {

  try {
      console.log('开始下载', url)
      const res = await downloadFile(url);
      return await safeSaveImageToPhotosAlbum(res.filePath)
  } catch (err) {
      console.log('saveUrlToAlbum: ', err)
      if (err.errMsg.startsWith('downloadFile:fail')) {
          return Promise.reject({
              errMsg: "下载出错"
          })
      }
      return Promise.reject(err)
  }
}


/**
* 封装无权限-引导授权逻辑，授权后自动执行
* @param {*} param0 
* @returns Promise
*/
async function safeApi({
  content,
  scope,
  apiFn
}) {
  try {
      return await apiFn()
  } catch (err) {
      console.log('safeApi err', err)
      // 此处大坑，showModal不能使用Promise方式调用，否则openSetting报错：openSetting:fail can only be invoked by user TAP gesture.
      if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          wx.showModal({
              title: "授权访问",
              content,
              confirmText: "去授权",
              success: async modalRes => {
                  if (modalRes.confirm) {
                      wx.openSetting({
                          success: async setting => {
                              if (setting && setting.authSetting[scope]) {
                                  return await apiFn()
                              }
                          },
                          fail: err => {
                              console.log('err', err)
                          }
                      })
                  } else {
                      // 取消
                      return
                  }
              }
          });
          return Promise.reject({
              errMsg: "您未授权"
          })
      } else if (err.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
          return Promise.reject({
              errMsg: "操作取消"
          })
      } else {
          return Promise.reject(err)
      }
  }
}
/**
* 保存图片到相册，未授权自动提醒
* @param {*} filePath 
* @returns Promise
*/
async function safeSaveImageToPhotosAlbum(filePath) {
  const fn = async () => {
      console.log('开始保存相册', filePath)
      return wx.saveImageToPhotosAlbum({
          filePath
      })
  }
  return await safeApi({
      content: "保存图片到相册需要您的允许",
      scope: "scope.writePhotosAlbum",
      apiFn: fn
  })
}

const isWorkWx = () => {
  const options = wx.getLaunchOptionsSync();
  console.log('launchOption', options);
  const system = wx.getSystemInfoSync()
  if (system.environment === 'wxwork' || options.query.wxwork) {
      return true
  }

  return false
}


/**
* 查询节点信息对象
*/
const queryNodeInfo = (id) => {
  const query = wx.createSelectorQuery()
  return new Promise(resolve => {
      query.select("#" + id).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
          resolve(res)
      })
  })
}

//   删除数组中某个值
const removevalue = (list, value) => {
  Array.prototype.indexOf = function (val) { //prototype 给数组添加属性
      for (var i = 0; i < this.length; i++) { //this是指向数组，this.length指的数组类元素的数量

          if (this[i] == val) return i; //数组中元素等于传入的参数，i是下标，如果存在，就将i返回

      }
      return -1;
  };
  Array.prototype.remove = function (val) {  //prototype 给数组添加属性
      var index = this.indexOf(val); //调用index()函数获取查找的返回值
      if (index > -1) {
          this.splice(index, 1); //利用splice()函数删除指定元素，splice() 方法用于插入、删除或替换数组的元素
      }
  };
  return list.remove(value);
}


module.exports = {
  downloadPic,
  queryNodeInfo,
  isWorkWx,
  sendLog,
  removevalue
}