const store = require('../../../utils/storage')
const calc = require('../../../utils/calc')

Page({
  data: {
    city: '北京市',
    oilGrade: '92#',
    oilPrice: '',
    vehicleName: '默认车辆',
    vehicleModel: '点击上面 → 去设置车型',

    records: [],
    display: {
      latestLPer100: '0.00',
      avgLPer100km: '0.00',
      avgKmPerDay: '0.00',
      costPerKm: '0.00',
      totalDistance: '0',
      totalCost: '0.00'
    }
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    const list = store.getRecords()
    // 展示友好字段（若后续需要展示列表，可保留）
    const view = list.map(it => ({
      ...it,
      liters: Number(it.liters || 0).toFixed(2),
      pricePerL: Number(it.pricePerL || 0).toFixed(2),
      totalCost: Number(it.totalCost != null && it.totalCost !== '' ? it.totalCost : (Number(it.liters)*Number(it.pricePerL))).toFixed(2)
    }))

    const stats = calc.computeStats(list)
    const latest = stats.avgLPer100km // 简化：使用整体平均作为“最新油耗”占位
    const display = {
      latestLPer100: Number(latest).toFixed(2),
      avgLPer100km: Number(stats.avgLPer100km).toFixed(2),
      avgKmPerDay: Number(stats.avgKmPerDay).toFixed(2),
      costPerKm: Number(stats.costPerKm).toFixed(2),
      totalDistance: Number(stats.totalDistance).toFixed(0),
      totalCost: Number(stats.totalCost).toFixed(2)
    }

    this.setData({ records: view, display })
  },

  goAdd() {
    wx.navigateTo({ url: '/pages/refuel/add/index' })
  },

  goStats() {
    wx.switchTab({ url: '/pages/stats/index/index' })
  }
})
