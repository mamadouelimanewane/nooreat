import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const { storeId, total, address, items } = await req.json()

    const deliveryPin = Math.floor(1000 + Math.random() * 9000).toString()

    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        storeId: storeId,
        total: total,
        address: address,
        status: "Pending",
        items: items || [], // Missing in previous version
        deliveryPin: deliveryPin,
        orderId: `NDG-${Math.floor(100000 + Math.random() * 900000)}`,
      }
    })

    return NextResponse.json(newOrder, { headers: { "Access-Control-Allow-Origin": "*" } })

  } catch (error: any) {
    console.error("Order creation error:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { store: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders, { headers: { "Access-Control-Allow-Origin": "*" } })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
