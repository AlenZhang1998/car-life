const store = require('../../../utils/storage')
const calc = require('../../../utils/calc')

Page({
  data: {
    stats: {
      totalRecords: 0,
      totalLiters: 0,
      totalCost: 0,
      totalDistance: 0,
      avgLPer100km: 0,
      costPer100km: 0,
      avgPricePerL: 0,
      monthly: []
    }
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const list = store.getRecords()
    const stats = calc.computeStats(list)
    this.setData({ stats })
  }
})

