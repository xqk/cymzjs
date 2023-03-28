// components/banner/banner.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banner: {
      type: Array
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    reviewImage(e) {
      // 获取点击图片的序号
      let index = e.currentTarget.dataset.index
      console.log(index);
      //提取数组的部分元素组成一个新数组
      let bannerinfo=[];
      this.data.banner.forEach(item => {
        bannerinfo.push(item.imageUrl);
      });
      // 全图浏览
      wx.previewImage({
        urls: bannerinfo,
        current: this.data.banner[index].imageUrl
      })
    }
  }
})
