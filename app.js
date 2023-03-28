import Request from './api/request'
import api from './api/index'
import utils from './utils/util'
import {
  dev,
  appName
} from './config/config'
import './utils/global'
// 供API使用方便
wx.$request = new Request().request;

// 业务直接可调用
wx.$api = api;
wx.$utils = utils;

// 日志发起
wx.$log = utils.sendLog;

wx.$startDate = Date.now();
wx.$appName = appName
App({
  onLaunch() {
    // 每次进入需要清空登录信息
    wx.removeStorageSync('loginData');
    wx.onNetworkStatusChange(function (res) {
      console.log('onNetworkStatusChange', res)
      if (!res.isConnected) {
        wx.showToast({
          title: '网络连接不可用',
          duration: 50000000,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '网络连接已正常',
          duration: 1000,
          icon: 'none'
        })
      }
    })

    /**
     * 自定义头部所需设备信息
     */
    const systeminfo = wx.getSystemInfoSync();
    this.globalData.systeminfo = systeminfo;
    console.log(systeminfo)
    if (systeminfo.platform !== "devtools" && dev) {
      // 打开调试
      wx.setEnableDebug({
        enableDebug: true
      })
    }
  },
  onHide() {
    wx.$log({
      context: {
        route: ''
      },
      eid: 8001,
      act: "exit",
      st: wx.$startDate,
    })
  },
  onShow() {
    wx.$startDate = Date.now()
  },
  onPageNotFound(res) {
    wx.redirectTo({
      url: '/pages/index/index',
    })
  },
  onError(err) {
    console.log('APP onError', err);
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
  },
  globalData: {
    swiperId: 0,
    userInfo: null,
    systeminfo: null
  }
})