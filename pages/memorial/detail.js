// pages/memorial/detail.js
const app = getApp();
const filePrev = "https://static.imolacn.com/grj/"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceTop: 35,
    memorialDetail: {},
    wltBackgroundImage: "",
    headImg: "",
    width: 0,
    height: 0,
    rpxUnit: 1,
    guangyun: "",
    hudieLeft: "",
    hudieRight: "",
    lazhuLeft: "",
    lazhuRight: "",
    isPlay: false,
    srcMic: "",
    xianglu: "",
    chajiu: "",
    xianheshenguiLeft: "",
    xianheshenguiRight: "",
    pinyao1:"",
    pinyao2:"",
    pinyao3:"",
    pinyao4:"",
    peiji1: "",
    peiji2: ""
  },

  async getMemorialDetail() {
    const [err, res] = await wx.$api.memorialDetail()
    if (!err) {
      const systeminfo = app.globalData.systeminfo

      let deviceTop = 35
      if (systeminfo.brand == "devtools") {
        deviceTop = 0
      }

      let guangyun = "";
      if (res.data.guangyun.length > 0) {
        guangyun = filePrev + res.data.guangyun[0]
      }

      let hudieLeft, hudieRight = ""
      if (res.data.hudie.length > 0) {
        hudieLeft = filePrev + res.data.hudie[0]
      }
      if (res.data.hudie.length > 1) {
        hudieRight = filePrev + res.data.hudie[1]
      }

      let lazhuLeft, lazhuRight = ""
      if (res.data.lazhu.length > 0) {
        lazhuLeft = filePrev + res.data.lazhu[0]
      }
      if (res.data.lazhu.length > 1) {
        lazhuRight = filePrev + res.data.lazhu[1]
      }
      let xianglu = ""
      if (res.data.xianglu.length > 0) {
        xianglu = filePrev + res.data.xianglu[0]
      }
      let chajiu = ""
      if (res.data.chajiu.length > 0) {
        chajiu = filePrev + res.data.chajiu[0]
      }

      let xianheshenguiLeft, xianheshenguiRight = ""
      if (res.data.xianheshengui.length > 0) {
        xianheshenguiLeft = filePrev + res.data.xianheshengui[0]
      }
      if (res.data.xianheshengui.length > 1) {
        xianheshenguiRight = filePrev + res.data.xianheshengui[1]
      }

      let pinyao1, pinyao2, pinyao3, pinyao4 = ""
      if (res.data.pinyao.length > 0) {
        pinyao1 = filePrev + res.data.pinyao[0]
      }
      if (res.data.pinyao.length > 1) {
        pinyao2 = filePrev + res.data.pinyao[1]
      }
      if (res.data.pinyao.length > 2) {
        pinyao3 = filePrev + res.data.pinyao[2]
      }
      if (res.data.pinyao.length > 3) {
        pinyao4 = filePrev + res.data.pinyao[3]
      }

      let peiji1, peiji2 = ""
      if (res.data.peiji.length > 0) {
        peiji1 = filePrev + res.data.peiji[0]
      }
      if (res.data.peiji.length > 1) {
        peiji2 = filePrev + res.data.peiji[1]
      }

      let srcMic = ""
      let isPlay = false
      if (res.data.backgroundMusicUrl != "") {
        srcMic = filePrev + res.data.backgroundMusicUrl
      }
      this.setData({
        deviceTop: deviceTop,
        memorialDetail: res.data,
        wltBackgroundImage: filePrev + res.data.memorialInfo.wltBackgroundImage,
        headImg: res.data.memorialInfo.headImg,
        width: systeminfo.safeArea.width,
        height: systeminfo.safeArea.height,
        rpxUnit: 750 / systeminfo.safeArea.width,
        guangyun: guangyun,
        hudieLeft: hudieLeft,
        hudieRight: hudieRight,
        lazhuLeft: lazhuLeft,
        lazhuRight: lazhuRight,
        srcMic: srcMic,
        xianglu: xianglu,
        chajiu: chajiu,
        xianheshenguiLeft: xianheshenguiLeft,
        xianheshenguiRight: xianheshenguiRight,
        pinyao1: pinyao1,
        pinyao2: pinyao2,
        pinyao3: pinyao3,
        pinyao4: pinyao4,
        peiji1: peiji1,
        peiji2: peiji2
      })
      this.audioPlay();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getMemorialDetail()
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
    this.end(); //暂停音频
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.end(); //暂停音频
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
  yuyinPlay: function (e) {
    let that = this
    //创建内部 audio 上下文 InnerAudioContext 对象。
    that.innerAudioContext = wx.createInnerAudioContext();
    that.innerAudioContext.onError(function (res) {})
    if ((that.data.srcMic == '') || (that.data.srcMic == undefined)) return;

    that.innerAudioContext.src = that.data.srcMic //设置音频地址
    this.innerAudioContext.play(); //播放音频
  },
  //播放
  audioPlay() {
    this.yuyinPlay();
    this.setData({
      isPlay: true
    })
  },
  // 停止播放
  audioPause() {
    this.setData({
      isPlay: false
    })
    this.innerAudioContext.pause(); //暂停音频 

  },
  // 结束语音
  end: function (e) {
    let that = this
    if ((that.data.src) || (that.data.src != undefined)) return
    that.innerAudioContext.pause(); //暂停音频 
  }
})