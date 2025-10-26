const store = require('../../../utils/storage')

Page({
  data: {
    version: ''
  },

  onLoad() {
    const app = getApp()
    this.setData({ version: app?.globalData?.version || '' })
  },

  onExport() {
    const data = store.getRecords()
    const text = JSON.stringify(data, null, 2)
    wx.setClipboardData({
      data: text,
      success: () => wx.showToast({ title: '已复制', icon: 'success' })
    })
  },

  onClearAll() {
    wx.showModal({
      title: '确认清空',
      content: '该操作无法恢复，是否继续？',
      confirmColor: '#ff3b30',
      success: (res) => {
        if (res.confirm) {
          store.clearAll()
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  }
})

