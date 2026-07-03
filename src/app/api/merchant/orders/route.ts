import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

type OrderItem = { productId: string; quantity: number; price: number }

function asOrderItems(items: unknown): OrderItem[] {
  return Array.isArray(items) ? (items as OrderItem[]) : []
}

export async function GET() {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  })

  const userIds = [...new Set(orders.map((o) => o.userId).filter((id): id is string => !!id))]
  const productIds = [...new Set(orders.flatMap((o) => asOrderItems(o.items).map((i) => i.productId)))]

  const [users, products] = await Promise.all([
    userIds.length ? prisma.user.findMany({ where: { id: { in: userIds } } }) : Promise.resolve([]),
    productIds.length ? prisma.product.findMany({ where: { id: { in: productIds } } }) : Promise.resolve([]),
  ])
  const usersById = new Map(users.map((u) => [u.id, u]))
  const productsById = new Map(products.map((p) => [p.id, p]))

  const enriched = orders.map((order) => {
    const customer = order.userId ? usersById.get(order.userId) : null
    const items = asOrderItems(order.items).map((i) => ({
      ...i,
      name: productsById.get(i.productId)?.name ?? "Article",
    }))

    return {
      ...order,
      items,
      customerName: customer?.name ?? "Client",
      customerPhone: customer?.phone ?? null,
    }
  })

  return NextResponse.json({ orders: enriched })
}
