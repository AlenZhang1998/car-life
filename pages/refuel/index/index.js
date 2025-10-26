const store = require('../../../utils/storage')
const calc = require('../../../utils/calc')
const cityStore = require('../../../utils/city')

Page({
  data: {
    city: '北京',
    oilGrade: '92#',
    oilPrice: '',
    vehicleName: '默认车辆',
    vehicleModel: '点击上方设置车辆',

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
    const savedCity = cityStore.getCity()
    const displayCity = cityStore.formatCityForDisplay(savedCity || '北京', { keepSuffix: false })
    this.setData({ city: displayCity || '北京' })
    this.loadData()
  },

  loadData() {
    const list = store.getRecords()
    const view = list.map(it => ({
      ...it,
      liters: Number(it.liters || 0).toFixed(2),
      pricePerL: Number(it.pricePerL || 0).toFixed(2),
      totalCost: Number(it.totalCost != null && it.totalCost !== '' ? it.totalCost : (Number(it.liters) * Number(it.pricePerL))).toFixed(2)
    }))

    const stats = calc.computeStats(list)
    const latest = stats.avgLPer100km // 简化：使用整体平均作为“最新油耗”的展示
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
  },

  chooseCity() {
    wx.navigateTo({ url: '/pages/city/index/index' })
  }
})
