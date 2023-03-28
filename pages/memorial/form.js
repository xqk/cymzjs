// pages/memorial/form.js
import {
  qiniuUploadStart,
} from './../../utils/upload'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    count: 1,
    headImg: "",
    name: "",
    birthdate: "",
    deathdate: ""
  },
  async formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const [err, res] = await wx.$api.postMemorialForm(e.detail.value)
    if (!err) {
      if (res.code == 0) {
        wx.redirectTo({
          url: '/pages/memorial/detail?id=' + res.data.id,
        })
      }
    }
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  },

  bindUpload: function(e) {
    switch (this.data.imgs.length) {
      case 0:
        this.data.count = 1
        break
    }
    var that = this
    wx.chooseImage({
      count: that.data.count, // 默认3
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
      success: async function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const files = await qiniuUploadStart({
          tempFilePaths: res.tempFilePaths || res.tempFiles.map(it => it.tempFilePath),
        });
        files.forEach((item, index) => {
          console.log(item)
          that.setData({
            headImg: item.url
          })
        })
      }
    })
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMemorialForm()
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage() {

  // },
  async getMemorialForm() {
    const [err, res] = await wx.$api.getMemorialForm()
    if (!err) {
      this.setData({
        headImg: res.data.headImg || "",
        name: res.data.name || "",
        birthdate: res.data.birthdate || "",
        deathdate: res.data.deathdate || ""
      })
    }
  }
})