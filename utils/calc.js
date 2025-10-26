function toNumber(n, def = 0) {
  const v = Number(n)
  return Number.isFinite(v) ? v : def
}

function computeStats(records) {
  if (!Array.isArray(records) || records.length === 0) {
    return emptyStats()
  }
  // 按里程升序计算区间
  const list = [...records].sort((a, b) => toNumber(a.odometer) - toNumber(b.odometer))
  const firstOdo = toNumber(list[0].odometer)
  const lastOdo = toNumber(list[list.length - 1].odometer)
  const totalDistance = Math.max(0, lastOdo - firstOdo)

  let totalLiters = 0
  let totalCost = 0
  list.forEach(r => {
    totalLiters += toNumber(r.liters)
    const cost = r.totalCost != null && r.totalCost !== ''
      ? toNumber(r.totalCost)
      : toNumber(r.liters) * toNumber(r.pricePerL)
    totalCost += cost
  })

  const avgLPer100km = totalDistance > 0 ? (totalLiters * 100) / totalDistance : 0
  const costPer100km = totalDistance > 0 ? (totalCost * 100) / totalDistance : 0
  const avgPricePerL = totalLiters > 0 ? totalCost / totalLiters : 0

  // 统计时间跨度（天）用于估算平均行程
  const timeSorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date))
  const startTime = new Date(timeSorted[0].date).getTime()
  const endTime = new Date(timeSorted[timeSorted.length - 1].date).getTime()
  const days = isFinite(startTime) && isFinite(endTime) && endTime > startTime
    ? Math.max(1, Math.ceil((endTime - startTime) / (24 * 3600 * 1000)))
    : 0
  const avgKmPerDay = days > 0 ? totalDistance / days : 0
  const costPerKm = totalDistance > 0 ? totalCost / totalDistance : 0

  // 月度分组
  const monthly = {}
  records.forEach(r => {
    const d = new Date(r.date)
    if (isNaN(d.getTime())) return
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const liters = toNumber(r.liters)
    const cost = r.totalCost != null && r.totalCost !== ''
      ? toNumber(r.totalCost)
      : liters * toNumber(r.pricePerL)
    monthly[key] = monthly[key] || { month: key, liters: 0, cost: 0, count: 0 }
    monthly[key].liters += liters
    monthly[key].cost += cost
    monthly[key].count += 1
  })

  const monthlyList = Object.values(monthly).sort((a, b) => a.month < b.month ? 1 : -1)

  return {
    totalRecords: records.length,
    totalLiters: round(totalLiters, 2),
    totalCost: round(totalCost, 2),
    totalDistance: round(totalDistance, 1),
    avgLPer100km: round(avgLPer100km, 2),
    costPer100km: round(costPer100km, 2),
    avgPricePerL: round(avgPricePerL, 2),
    costPerKm: round(costPerKm, 3),
    avgKmPerDay: round(avgKmPerDay, 2),
    monthly: monthlyList
  }
}

function round(n, d = 2) {
  const p = Math.pow(10, d)
  return Math.round(n * p) / p
}

function emptyStats() {
  return {
    totalRecords: 0,
    totalLiters: 0,
    totalCost: 0,
    totalDistance: 0,
    avgLPer100km: 0,
    costPer100km: 0,
    avgPricePerL: 0,
    costPerKm: 0,
    avgKmPerDay: 0,
    monthly: []
  }
}

module.exports = {
  computeStats,
  round
}
