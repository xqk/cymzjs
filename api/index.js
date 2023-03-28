const home = {
  async login({
    code,
  }) {
    console.log('登录请求')
    const [err, res] = await wx.$request({
      url: '/api/login',
      method: "post",
      data: {
        code,
      }
    })
    return [err, res]
  },

  async eventLog(data) {
    const [err, res] = await wx.$request({
      url: '/api/log',
      method: "get",
      data
    })
    return [err, res]
  },
  async bannerList(data) {
    const [err, res] = await wx.$request({
      url: '/api/banner/findBannerList',
      method: "get",
      data
    })
    return [err, res]
  },
  async findTopMemorialList(data) {
    const [err, res] = await wx.$request({
      url: '/api/memorial/findTopMemorialList',
      method: "get",
      data
    })
    return [err, res]
  }
}

const memorial = {
  async memorialDetail(data) {
    const [err, res] = await wx.$request({
      url: '/api/memorial/findMemorialFeteHomePage',
      method: "get",
      data
    })
    return [err, res]
  },
  async getMemorialForm(data) {
    const [err, res] = await wx.$request({
      url: '/api/memorial/get/form',
      method: "get",
      data
    })
    return [err, res]
  },
  async postMemorialForm(data) {
    const [err, res] = await wx.$request({
      url: '/api/memorial/post/form',
      method: "post",
      data
    })
    return [err, res]
  }
}

const platform = {
  async findPlatformMemorialConfig(data) {
    const [err, res] = await wx.$request({
      url: '/api/platform/platform/findPlatformMemorialConfig',
      method: "get",
      data
    })
    return [err, res]
  },
  async findPlatformMemorialConfigDetail(data) {
    const [err, res] = await wx.$request({
      url: '/api/platform/platform/findPlatformMemorialConfigDetail',
      method: "get",
      data
    })
    return [err, res]
  },
  async findSystemFeteScenePlatform(data) {
    const [err, res] = await wx.$request({
      url: '/api/system/feteScene/findSystemFeteScenePlatform',
      method: "get",
      data
    })
    return [err, res]
  }
}

export default {
  ...platform,
  ...home,
  ...memorial,
}