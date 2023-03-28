// components/platform/saomu.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    saomu: {
      type: String
    },
    muhua: {
      type: String
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
    hideSaomu: false,
    hide: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    moveSaomu() {
      this.setData({
        hideSaomu: false
      })
      let animation = wx.createAnimation({
          duration: 4000,
          delay: 0,
          timingFunction: "ease",
      });
      animation.top(160).step()
      this.setData({ moveSaomu: animation.export() })
    },
    hideSaomu() {
      this.setData({
        hideSaomu: true
      })
    },
    show() {
      this.setData({
        hide: false
      })
    },
    hide() {
      this.setData({
        hide: true
      })
    }
  }
})
