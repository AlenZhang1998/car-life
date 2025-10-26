const CITY_KEY = 'city_name_v1'

function getCity() {
  try {
    const name = wx.getStorageSync(CITY_KEY)
    return name || ''
  } catch (e) {
    return ''
  }
}

function setCity(name) {
  wx.setStorageSync(CITY_KEY, name || '')
}

function extractCityFromAddress(addr = '') {
  // 优先匹配“xx市/州/地区/盟”等级别
  const candidates = addr.match(/[\u4e00-\u9fa5]{2,9}(市|州|地区|盟)/g)
  if (candidates && candidates.length) {
    // 以“市”为优先，其次其他
    const preferCity = candidates.find(t => /市$/.test(t))
    return (preferCity || candidates[0]).replace(/(地区)$/,'')
  }
  // 退化：尝试匹配“自治州/自治区/特别行政区”等
  const more = addr.match(/[\u4e00-\u9fa5]{2,9}(自治州|自治区|特别行政区)/)
  if (more) return more[0]
  return ''
}

module.exports = { CITY_KEY, getCity, setCity, extractCityFromAddress }

