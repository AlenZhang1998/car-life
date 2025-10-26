App({
  globalData: {
    version: '0.1.0'
  },
  onLaunch() {
    // 可在此初始化本地存储结构或迁移数据版本
    try {
      const logs = wx.getStorageSync('logs') || []
      logs.unshift(Date.now())
      wx.setStorageSync('logs', logs)
    } catch (e) {}
  }
})

