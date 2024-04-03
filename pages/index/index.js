// pages/index/index.js
import {
  getFileUrl
} from './../../utils/file'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "873020F7C92543E1BFB9BDECC7E9D5E5",
    name: "轻触文字区域进入祭扫页面",
    description: "&emsp;&emsp;清明节是一个寄托哀思、祭祖和扫墓的传统节日。但烧纸钱、燃放烟花爆竹这一传统习俗却会引发山火、人员伤亡和环境污染等问题，加之今年新冠肺炎爆发，人口大量流动、聚集容易引发交叉感染的风险。我们倡议乡亲们少出门少聚集，也是对家庭，对社会最大的负责，亲友和子孙的安康也是逝者对后辈亲人最大的期盼，为进一步体现人文清明，绿色清明的主旨，移风易俗与时俱进的新文明新风尚，县民政局率先研发推出了“互联网＋祭祀”的绿色便捷祭扫方式，进行网上祭奠，祈福寄语，寄托哀思。也好让外地的亲友不再受时间和地域的限制，随时随地在微信上实现对逝者的祭扫和缅怀，分享给亲友一起在线祭扫，凝聚亲情，孝爱传承。",
    platformName: "崇阳县民政局网络祭扫平台",
    mobileDesc: "联系电话",
    mobile: "15872055036",
    yindaoheader: getFileUrl("resource/9C62085AE3CD47DABC8E2FE524BD34D8.png"),
    yindaofooter: getFileUrl("image/2022/03/23/239A8CE07DFA498A9640285B2E5C355B.png"),
    windowInfo: {
      width: 750,
      height: 750,
      deviceTop: 0,
      rpxUnit: 1
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initWindowInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  initWindowInfo() {
    const systeminfo = app.globalData.systeminfo
    let deviceTop = 35
    if (systeminfo.brand == "devtools") {
      deviceTop = 0
    }
    let rpxUnit = 750 / systeminfo.safeArea.width
    this.setData({
      windowInfo: {
        deviceTop: deviceTop,
        width: systeminfo.safeArea.width,
        height: systeminfo.safeArea.height,
        rpxUnit: rpxUnit
      }
    })
  },
  runMemorialForm() {
    wx.redirectTo({
      url: '/pages/platform/form'
    })
  }
})