// pages/platform/form.js
import {
  getFileUrl
} from './../../utils/file'
import {
  qiniuUploadStart,
} from './../../utils/upload'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    count: 1,
    jianguanfooter: getFileUrl("image/2022/03/24/1535E8E388D34C299E380D7808B30135.png"),
    rahmen: getFileUrl("image/2022/03/23/86BEEB1081B147C7916C106DEA027E47.gif"),
    defaultUploadUrl: getFileUrl("resource/upload1.jpg"),
    headImg: "",
    nameOne: "",
    relationOne: "",
    nameTwo: "",
    relationTwo: "",
    relations: ["已故父亲", "已故母亲", "已故祖父", "已故祖母", "已故外祖父", "已故外祖母"],
    tabIndex: 0,
    tab1CurrentClass: "tab-current",
    tab2CurrentClass: "",
    platformMemorialConfig: [],
    fastMemorialId: "",
    visitCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.findPlatformMemorialConfig()
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  checkRelation(e) {
    let {
      toid
    } = e.currentTarget.dataset;
    if (toid == "relation1") {
      this.setData({
        relationOne: this.data.relations[parseInt(e.detail.value, 10)]
      })
    } else if (toid == "relation2") {
      this.setData({
        relationTwo: this.data.relations[parseInt(e.detail.value, 10)]
      })
    }
  },
  async formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let canPost = true
    if (e.detail.value.headImg == "") {
      canPost = false
      wx.showToast({
          title: '请上传图片',
          duration: 5000,
          icon: 'none'
      })
    }
    if (canPost) {
      const [err, res] = await wx.$api.postMemorialForm(e.detail.value)
      if (!err) {
        if (res.code == 0) {
          wx.redirectTo({
            url: '/pages/platform/fastmemorial'
          })
        }
      }
    }
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
  changTab(e) {
    let {
      index
    } = e.currentTarget.dataset;
    let tab1CurrentClass = "tab-current"
    let tab2CurrentClass = ""
    if (index == 0) {
      tab1CurrentClass = "tab-current"
      tab2CurrentClass = ""
    } else if (index == 1) {
      tab1CurrentClass = ""
      tab2CurrentClass = "tab-current"
    }
    this.setData({
      tabIndex: parseInt(index, 10),
      tab1CurrentClass: tab1CurrentClass,
      tab2CurrentClass: tab2CurrentClass
    })
  },
  async findPlatformMemorialConfig() {
    const [err, res] = await wx.$api.findPlatformMemorialConfig()
    if (!err) {
      this.setData({
        platformMemorialConfig: res.data
      })
    }
  },
  fastRadioChange(e) {
    this.setData({
      fastMemorialId: e.detail.value
    })
  },
  fastMemorial(e) {
    // console.log(this.data.fastMemorialId)
    if (this.data.fastMemorialId == "") {
      wx.showToast({
          title: '请选择一个扫墓',
          duration: 5000,
          icon: 'none'
      })
    } else {
      wx.redirectTo({
        url: '/pages/platform/fastmemorial?id=' + this.data.fastMemorialId,
      })
    }
  },
  async getMemorialForm() {
    const [err, res] = await wx.$api.getMemorialForm()
    if (!err) {
      this.setData({
        headImg: res.data.headImg || "",
        nameOne: res.data.nameOne || "",
        nameTwo: res.data.nameTwo || "",
        relationOne: res.data.relationOne || "",
        relationTwo: res.data.relationTwo || "",
        visitCount: res.data.visitCount || 1,
      })
    }
  }
})