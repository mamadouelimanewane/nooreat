import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthDriver } from "@/lib/driverAuth"

export async function GET(req: Request) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [todayTx, weekTx, weekOrders] = await Promise.all([
    prisma.transaction.findMany({ where: { driverId: driver.id, type: "Credit", createdAt: { gte: startOfToday } } }),
    prisma.transaction.findMany({ where: { driverId: driver.id, type: "Credit", createdAt: { gte: sevenDaysAgo } } }),
    prisma.order.count({ where: { driverId: driver.id, status: "Completed", updatedAt: { gte: startOfToday } } }),
  ])

  const series = new Map<string, { label: string; earnings: number; orders: number }>()
  for (const tx of weekTx) {
    const key = tx.createdAt.toISOString().slice(0, 10)
    const label = tx.createdAt.toLocaleDateString("fr-FR", { weekday: "short" })
    const existing = series.get(key) ?? { label, earnings: 0, orders: 0 }
    existing.earnings += tx.amount
    existing.orders += 1
    series.set(key, existing)
  }

  return NextResponse.json(
    {
      todayEarnings: todayTx.reduce((sum, t) => sum + t.amount, 0),
      todayOrders: weekOrders,
      weekSeries: [...series.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v),
      totalOrders: driver.totalOrders,
      rating: driver.rating,
      walletBalance: driver.walletMoney,
    },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
