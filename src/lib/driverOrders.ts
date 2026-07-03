import { prisma } from "./prisma"
import { DELIVERY_FEE } from "./driverAuth"

type OrderItem = { productId: string; quantity: number; price: number }

function asOrderItems(items: unknown): OrderItem[] {
  return Array.isArray(items) ? (items as OrderItem[]) : []
}

type OrderWithStore = {
  id: string
  orderId: string
  total: number
  status: string
  address: string | null
  items: unknown
  userId: string | null
  driverId: string | null
  createdAt: Date
  store: { name: string; address: string | null }
}

export async function shapeDriverOrders(orders: OrderWithStore[]) {
  const userIds = [...new Set(orders.map((o) => o.userId).filter((id): id is string => !!id))]
  const users = userIds.length ? await prisma.user.findMany({ where: { id: { in: userIds } } }) : []
  const usersById = new Map(users.map((u) => [u.id, u]))

  return orders.map((o) => {
    const user = o.userId ? usersById.get(o.userId) : null
    return {
      id: o.id,
      orderId: o.orderId,
      status: o.status,
      storeAddress: o.store.address ?? o.store.name,
      deliveryAddress: o.address ?? "Adresse non renseignée",
      customerName: user?.name ?? "Client",
      customerPhone: user?.phone ?? "",
      total: o.total,
      items: asOrderItems(o.items).reduce((sum, i) => sum + i.quantity, 0),
      earnings: DELIVERY_FEE,
      distance: "—",
      createdAt: o.createdAt,
    }
  })
}
