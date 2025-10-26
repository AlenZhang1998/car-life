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

  ensureLocationAuth() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          const granted = res.authSetting && res.authSetting['scope.userLocation']
          if (granted) return resolve(true)
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => resolve(true),
            fail: () => {
              wx.showModal({
                title: '需要定位权限',
                content: '用于定位并选择城市，请到设置中开启定位权限',
                confirmText: '去设置',
                success: (r) => {
                  if (r.confirm) {
                    wx.openSetting({
                      success: (st) => {
                        if (st.authSetting && st.authSetting['scope.userLocation']) resolve(true)
                        else reject(new Error('no-permission'))
                      },
                      fail: () => reject(new Error('open-setting-fail'))
                    })
                  } else {
                    reject(new Error('user-cancel'))
                  }
                }
              })
            }
          })
        },
        fail: () => reject(new Error('get-setting-fail'))
      })
    })
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
    // 先确保权限，再调起地图选点
    this.ensureLocationAuth()
      .then(() => {
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
          fail: (e) => {
            console.error('chooseLocation fail:', e)
            wx.showToast({ title: '选择位置失败或取消', icon: 'none' })
          }
        })
      })
      .catch((err) => {
        console.warn('loc auth rejected:', err)
        wx.showToast({ title: '未授权定位，无法选择位置', icon: 'none' })
      })
  }
})
