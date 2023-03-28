// pages/index/index.js
import {
  getFileUrl
} from '../../utils/file'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],
    cards: ["x"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getBannerList()
    this.getFindTopMemorialList()
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

  addZero(num) {
    if (parseInt(num, 10) < 10) {
      num = "0" + num
    }
    return num
  },

  async getBannerList() {
    const [err, res] = await wx.$api.bannerList()
    if (!err) {
      let banner = []
      res.data.forEach(item => {
        item.imageUrl = getFileUrl(item.imageUrl)
        banner.push(item)
      })
      this.setData({
        banner: banner
      })
    }
  },
  async getFindTopMemorialList() {
    const [err, res] = await wx.$api.findTopMemorialList()
    if (!err) {
      let cards = []
      res.data.forEach(item => {
        item.headImageUrl = getFileUrl(item.headImageUrl)
        item.defaultHeadImageUrl = getFileUrl(item.defaultHeadImageUrl)
        let oDate = new Date(item.createTime),
          oYear = oDate.getFullYear(),
          oMonth = oDate.getMonth() + 1,
          oDay = oDate.getDate(),
          oTime = oYear + '-' + this.addZero(oMonth) + '-' + this.addZero(oDay);
        item.createDate = oTime
        cards.push(item)
      })
      this.setData({
        cards: cards
      })
    }
  }
})