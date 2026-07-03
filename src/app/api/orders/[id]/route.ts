import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

type OrderItem = { productId: string; quantity: number; price: number }

function asOrderItems(items: unknown): OrderItem[] {
  return Array.isArray(items) ? (items as OrderItem[]) : []
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const { id } = await params
    const order = await prisma.order.findUnique({ where: { id }, include: { store: true } })
    if (!order || order.userId !== user.id) {
      return NextResponse.json({ message: "Commande introuvable" }, { status: 404 })
    }

    const items = asOrderItems(order.items)
    const productIds = items.map((i) => i.productId)
    const products = productIds.length
      ? await prisma.product.findMany({ where: { id: { in: productIds } } })
      : []
    const productsById = new Map(products.map((p) => [p.id, p]))

    const driver = order.driverId ? await prisma.driver.findUnique({ where: { id: order.driverId } }) : null
    const { store, ...orderFields } = order

    return NextResponse.json(
      {
        ...orderFields,
        items: items.map((i) => ({ ...i, name: productsById.get(i.productId)?.name ?? "Article" })),
        storeName: store.name,
        driver: driver
          ? { name: driver.name, phone: driver.phone, vehicle: driver.vehicleType, rating: driver.rating }
          : null,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
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
