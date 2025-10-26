const store = require('../../../utils/storage')

Page({
  data: {
    form: {
      date: '',
      odometer: '',
      liters: '',
      pricePerL: '',
      totalCost: '',
      fullTank: true,
      station: '',
      note: ''
    }
  },

  onLoad() {
    const today = this.formatDate(new Date())
    this.setData({ 'form.date': today })
  },

  formatDate(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  },

  onDateChange(e) {
    this.setData({ 'form.date': e.detail.value })
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({ [`form.${field}`]: value })
  },

  onFullTankChange(e) {
    this.setData({ 'form.fullTank': e.detail.value })
  },

  validate(form) {
    if (!form.date) return '请选择日期'
    if (!form.odometer) return '请输入里程'
    if (!form.liters) return '请输入加油量'
    if (!form.pricePerL && !form.totalCost) return '请输入单价或总价'
    return ''
  },

  onSubmit() {
    const form = { ...this.data.form }
    const msg = this.validate(form)
    if (msg) {
      wx.showToast({ title: msg, icon: 'none' })
      return
    }

    const liters = Number(form.liters)
    const price = Number(form.pricePerL)
    const hasTotal = form.totalCost !== '' && form.totalCost != null
    const total = hasTotal ? Number(form.totalCost) : (Number.isFinite(liters) && Number.isFinite(price) ? liters * price : 0)

    const record = {
      date: form.date,
      odometer: Number(form.odometer),
      liters,
      pricePerL: price,
      totalCost: Number(total.toFixed(2)),
      fullTank: !!form.fullTank,
      station: form.station || '',
      note: form.note || ''
    }

    store.addRecord(record)
    wx.showToast({ title: '已保存', icon: 'success' })
    setTimeout(() => {
      wx.navigateBack()
    }, 300)
  },

  onCancel() {
    wx.navigateBack()
  }
})

