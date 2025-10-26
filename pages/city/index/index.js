const { getCity, setCity, extractCityFromAddress } = require('../../../utils/city')
const { GROUPS } = require('../../../config/cities')

Page({
  data: {
    keyword: '',
    groups: GROUPS,
    currentCity: getCity() || ''
  },

  onShow() {
    this.setData({ currentCity: getCity() || '' })
  },

  onSearch(e) {
    const kw = (e.detail.value || '').trim()
    this.setData({ keyword: kw })
    if (!kw) {
      this.setData({ groups: GROUPS })
      return
    }
    const lower = kw.toLowerCase()
    const filtered = GROUPS.map(g => ({
      letter: g.letter,
      items: g.items.filter(name => name.includes(kw) || name.toLowerCase && name.toLowerCase().includes(lower))
    })).filter(g => g.items.length)
    this.setData({ groups: filtered })
  },

  tapCity(e) {
    const name = e.currentTarget.dataset.name
    if (name) {
      setCity(name.replace(/(市|地区|盟)$/,''))
      wx.navigateBack()
    }
  },

  reLocate() {
    // 使用地图选择位置，兼容性较好；从地址中提取城市
    wx.chooseLocation({
      success: (res) => {
        const addr = res.address || res.name || ''
        const city = extractCityFromAddress(addr) || (addr.match(/[\u4e00-\u9fa5]{2,9}市/) || [])[0] || ''
        const clean = (city || '').replace(/(市|地区|盟)$/,'')
        if (clean) {
          setCity(clean)
          this.setData({ currentCity: clean })
          wx.showToast({ title: '已定位到：' + clean, icon: 'none' })
        } else {
          wx.showToast({ title: '未能识别城市', icon: 'none' })
        }
      },
      fail: () => {
        wx.showToast({ title: '定位取消或失败', icon: 'none' })
      }
    })
  }
})
