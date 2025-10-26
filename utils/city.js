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

function formatCityForDisplay(name = '', options = { keepSuffix: false }) {
  if (!name) return ''
  const src = String(name).trim()
  // 1) 去掉省级等前缀（如“河北省”“内蒙古自治区”“香港特别行政区”等）
  const provincePrefix = /^(?:[\u4e00-\u9fa5]{2,9}(?:省|自治区|特别行政区|壮族自治区|回族自治区|维吾尔自治区))/
  let s = src.replace(provincePrefix, '')
  // 2) 提取地级单位（市/盟/地区/自治州/特别行政区），否则按原字符串处理
  const cityMatch = s.match(/[\u4e00-\u9fa5]{2,12}(市|盟|地区|自治州|特别行政区)/)
  if (cityMatch) {
    s = cityMatch[0]
  }
  // 3) 按需保留或移除后缀
  if (!options.keepSuffix) s = s.replace(/(市|盟|地区|自治州|特别行政区)$/,'')
  return s
}

module.exports = { CITY_KEY, getCity, setCity, extractCityFromAddress, formatCityForDisplay }
