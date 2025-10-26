const STORAGE_KEY = 'refuel_records_v1'

function getRecords() {
  try {
    const list = wx.getStorageSync(STORAGE_KEY)
    return Array.isArray(list) ? list : []
  } catch (e) {
    return []
  }
}

function saveRecords(list) {
  wx.setStorageSync(STORAGE_KEY, list)
}

function addRecord(record) {
  const list = getRecords()
  const now = Date.now()
  const item = {
    id: now,
    createdAt: now,
    ...record
  }
  list.push(item)
  sortRecords(list)
  saveRecords(list)
  return item
}

function updateRecord(updated) {
  const list = getRecords()
  const idx = list.findIndex(i => i.id === updated.id)
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...updated }
    sortRecords(list)
    saveRecords(list)
    return true
  }
  return false
}

function deleteRecord(id) {
  const list = getRecords()
  const next = list.filter(i => i.id !== id)
  saveRecords(next)
  return next.length !== list.length
}

function clearAll() {
  saveRecords([])
}

function sortRecords(list) {
  // 优先按日期，其次按里程
  list.sort((a, b) => {
    const da = new Date(a.date).getTime() || 0
    const db = new Date(b.date).getTime() || 0
    if (db !== da) return db - da
    const oa = Number(a.odometer || 0)
    const ob = Number(b.odometer || 0)
    return ob - oa
  })
}

module.exports = {
  STORAGE_KEY,
  getRecords,
  saveRecords,
  addRecord,
  updateRecord,
  deleteRecord,
  clearAll,
  sortRecords
}

