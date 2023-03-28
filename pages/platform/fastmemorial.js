// pages/platform/fastmemorial.js
import {
  getFileUrl
} from './../../utils/file'
const app = getApp();
// const AUDIOMANAGER = app.globalData.global_bac_audio_manager.manage
// const AUDIO = app.globalData.global_bac_audio_manager
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    item: {},
    feteScene: [],
    windowInfo: {
      width: 750,
      height: 750,
      deviceTop: 0,
      rpxUnit: 1
    },
    backgroundmusic: "",
    isPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let {
      id
    } = options
    this.setData({
      id: id
    })
    this.initWindowInfo()
    this.findPlatformMemorialConfigDetail()
    this.findSystemFeteScenePlatform()

    // // 背景音频播放完毕
    // AUDIOMANAGER.onEnded(() => {
    //   audio_background_play(this.data.audio_article)
    // })
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
    if (this.innerAudioContext != null) {
      this.innerAudioContext.pause()
      this.setData({
        isPlay: false
      })
      this.innerAudioContext = null
    }
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

  async findPlatformMemorialConfigDetail() {
    const [err, res] = await wx.$api.findPlatformMemorialConfigDetail({
      id: this.data.id
    });
    if (!err) {
      res.data.backgroundImage = getFileUrl(res.data.backgroundImage)
      res.data.headImage = getFileUrl(res.data.headImage)
      this.setData({
        item: res.data
      })
    }
  },
  async findSystemFeteScenePlatform() {
    const [err, res] = await wx.$api.findSystemFeteScenePlatform({});
    if (!err) {
      for (var k in res.data) {
        res.data[k].forEach(e => {
          e.imageUrl = getFileUrl(e.imageUrl)
          e.previewUrl = getFileUrl(e.previewUrl)
          e.musicUrl = getFileUrl(e.musicUrl)
        })
      }
      this.setData({
        feteScene: res.data,
        backgroundmusic: res.data.backgroundmusic[0].musicUrl
      })
      this.audioPlay();
    }
  },
  initWindowInfo() {
    const systeminfo = app.globalData.systeminfo
    let deviceTop = 0
    // let deviceTop = 35
    // if (systeminfo.brand == "devtools") {
    //   deviceTop = 0
    // }
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
  showDialog(e) {
    console.log(e)
    let {
      kind
    } = e.currentTarget.dataset

    if (kind == "saomu") {
      const dialog = this.selectComponent('#dialog')
      dialog.showMuhua()
    } else if (kind == "xianhua") {
      const dialog = this.selectComponent('#dialog')
      dialog.showXianhua()
    } else if (kind == "jingxiang") {
      const dialog = this.selectComponent('#dialog')
      dialog.showJingxiang()
    } else if (kind == "message") {
      const dialog = this.selectComponent('#dialog')
      dialog.showMessage()
    }
  },
  // 点击播放暂停
  audio_play: function () {
    // console.log(this.data.is_play)
    // let that = this
    // if (this.data.is_play) {
    //   that.setData({
    //     is_play: false
    //   })
    //   wx.pauseBackgroundAudio()
    // } else if (!this.data.is_play && this.data.is_ended) { // 这里是判断如果循环播放结束，没有下一首，重新播放 is_ended  是否是最后一首
    //   audio_background_play(that.data.audio_article)
    //   that.setData({
    //     is_play: true,
    //     is_ended: false
    //   })
    // } else if (!this.data.is_play) {
    //   that.setData({
    //     is_play: true
    //   })
    //   wx.playBackgroundAudio()
    // }
    // AUDIO.is_play = !AUDIO.is_play
  },
  bianpaoChange() {
    // let that = this
    // AUDIOMANAGER.onPlay(() => {
    //   setTimeout(() => {
    //     that.setData({
    //       is_loading: true
    //     })
    //   }, 300)
    // })
    // this.setData({
    //   audio_article: {
    //     audioLink: this.data.feteScene.bianpaomusic[0].musicUrl,
    //     articleName: "",
    //     lessonName: "",
    //     singer: "",
    //     poster: ""
    //   }
    // })
    // console.log(this.data.audio_article)
    // audio_background_play(this.data.audio_article)
    // this.audio_play()
  },
  yuyinPlay: function (e) {
    let that = this
    //创建内部 audio 上下文 InnerAudioContext 对象。
    that.innerAudioContext = wx.createInnerAudioContext();
    that.innerAudioContext.onError(function (res) {})
    if ((that.data.backgroundmusic == '') || (that.data.backgroundmusic == undefined)) return;

    that.innerAudioContext.src = that.data.backgroundmusic //设置音频地址
    this.innerAudioContext.play(); //播放音频
    this.innerAudioContext.onEnded(() => {
      that.innerAudioContext.play()
    })
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
    if ((that.data.backgroundmusic) || (that.data.backgroundmusic != undefined)) return
    that.innerAudioContext.pause(); //暂停音频 
  }
})

// 音频播放
function audio_background_play(response) {
  // AUDIOMANAGER.src = response.urlCompressed ? response.urlCompressed : response.audioLink // 音频的数据源，默认为空字符串，当设置了新的 src 时，会自动开始播放 ，目前支持的格式有 m4a, aac, mp3, wav
  // AUDIOMANAGER.title = response.articleName // 音频标题
  // AUDIOMANAGER.epname = response.lessonName // 专辑名
  // AUDIOMANAGER.singer = '****' // 歌手名
  // AUDIOMANAGER.coverImgUrl = response.poster // 封面图url
}