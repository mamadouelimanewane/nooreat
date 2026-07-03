import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

const COMMISSION_RATE = 0.05

function bucketKey(date: Date, period: string): string {
  if (period === "year") return `${date.getFullYear()}-${date.getMonth()}`
  if (period === "month") {
    const weekOfMonth = Math.floor((date.getDate() - 1) / 7)
    return `${date.getFullYear()}-${date.getMonth()}-w${weekOfMonth}`
  }
  return date.toISOString().slice(0, 10)
}

function bucketLabel(date: Date, period: string): string {
  if (period === "year") return date.toLocaleDateString("fr-FR", { month: "short" })
  if (period === "month") return `Sem. ${Math.floor((date.getDate() - 1) / 7) + 1}`
  return date.toLocaleDateString("fr-FR", { weekday: "short" })
}

export async function GET(req: Request) {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const period = searchParams.get("period") === "month" || searchParams.get("period") === "year"
    ? searchParams.get("period")!
    : "week"

  const days = period === "year" ? 365 : period === "month" ? 30 : 7
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  const orders = await prisma.order.findMany({
    where: { storeId, status: "Completed", createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  })

  const buckets = new Map<string, { label: string; gmv: number; net: number }>()
  for (const order of orders) {
    const key = bucketKey(order.createdAt, period)
    const label = bucketLabel(order.createdAt, period)
    const existing = buckets.get(key) ?? { label, gmv: 0, net: 0 }
    existing.gmv += order.total
    existing.net += order.total * (1 - COMMISSION_RATE)
    buckets.set(key, existing)
  }
  const series = [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v)

  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0)
  const totalNet = totalGMV * (1 - COMMISSION_RATE)
  const totalCommission = totalGMV * COMMISSION_RATE
  const avgBasketNet = orders.length ? totalNet / orders.length : 0

  const ledger = orders.slice(0, 20).map((o) => ({
    id: o.orderId,
    date: o.createdAt,
    doc: `Commande ${o.orderId}`,
    amount: o.total,
    fee: o.total * COMMISSION_RATE,
    net: o.total * (1 - COMMISSION_RATE),
    status: o.status,
  }))

  return NextResponse.json({
    period,
    series,
    totalGMV,
    totalNet,
    totalCommission,
    avgBasketNet,
    ledger,
  })
}
