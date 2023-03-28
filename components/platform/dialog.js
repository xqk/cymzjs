// components/platform/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    feteScene: {
      type: Object
    },
    windowInfo: {
      type: Object
    },
    top: {
      type: Number
    },
    left: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    hide: true,
    showMuhua: true,
    muhuaIndex: 0,
    xianhuaIndex: 0,
    jingxiangIndex: 0,
    items: [],
    name: "",
    kind: "",
    xianhua: [],
    xianglu: {},
    guibaiHide: true,
    xianheLeft: -100,
    xianheTop: 440,
    xianheHide: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dialogClose() {
      this.setData({
        hide: true
      })
    },
    dialogOk() {
      this.setData({
        hide: true
      })

      if (this.data.kind == "saomu") {
        const saomu = this.selectComponent('#saomu')
        saomu.show()
        saomu.moveSaomu()
      } else if (this.data.kind == "xianhua") {
        wx.showToast({
          title: '献花成功',
          duration: 1500,
          icon: 'none'
      })
        let xianhua = this.data.xianhua
        xianhua.push(this.data.items[this.data.xianhuaIndex])
        this.setData({
          xianhua: xianhua,
          guibaiHide: false
        })
        let that = this
        setTimeout(function () {
          that.guibaiHide()
        }, 6000)
      } else if (this.data.kind == "jingxiang") {
        wx.showToast({
          title: '敬香成功',
          duration: 1500,
          icon: 'none'
      })
        this.setData({
          xianglu: this.data.items[this.data.jingxiangIndex],
          guibaiHide: false
        })
        let that = this
        setTimeout(function () {
          that.guibaiHide()
        }, 6000)
      } else if (this.data.kind == "message") {
        wx.showToast({
          title: '仙鹤火速送达 愿你万事如意',
          duration: 5000,
          icon: 'none'
      })
        let animation = wx.createAnimation({
            duration: 6000,
            delay: 0,
            timingFunction: "ease",
        });
        animation.translate(450, -450).step()
        this.setData({ moveXianhe: animation.export() })
        let that = this
        setTimeout(function () {
          that.setData({ moveXianhe: null })
          let animationB = wx.createAnimation({
              duration: 10,
              delay: 0,
              timingFunction: "ease"
          })
          animationB.top(that.setData.xianheTop).step().left(that.setData.xianheLeft).step()
          that.setData({ 
            moveXianhe: animationB.export()
          })

        }, 6000)
      }
    },
    dialogRadioChange(e) {
      let index = e.detail.value
      if (this.data.kind == "saomu") {
        this.setData({
          muhuaIndex: parseInt(index, 10)
        })
      } else if (this.data.kind == "xianhua") {
        this.setData({
          xianhuaIndex: parseInt(index, 10)
        })
      } else if (this.data.kind == "jingxiang") {
        this.setData({
          jingxiangIndex: parseInt(index, 10)
        })
      }
      
    },
    showMuhua() {
      this.setData({
        items: this.data.feteScene.muhua,
        name: "扫墓",
        hide: false,
        kind: "saomu"
      })
    },
    showXianhua() {
      this.setData({
        items: this.data.feteScene.xianhua,
        name: "献花",
        hide: false,
        kind: "xianhua"
      })
    },
    showJingxiang() {
      this.setData({
        items: this.data.feteScene.xianglu,
        name: "敬香",
        hide: false,
        kind: "jingxiang"
      })
    },
    showMessage() {
      this.setData({
        items: this.data.feteScene.message,
        name: "请选择留言",
        hide: false,
        kind: "message"
      })
    },
    guibaiHide() {
      this.setData({
        guibaiHide: true
      })
    }
  }
})
