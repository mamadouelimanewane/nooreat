import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthDriver, DELIVERY_FEE } from "@/lib/driverAuth"

const STATUS_MAP: Record<string, string> = {
  PICKED_UP: "Processing",
  DELIVERED: "Completed",
  Processing: "Processing",
  Completed: "Completed",
  Cancelled: "Cancelled",
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order || order.driverId !== driver.id) {
    return NextResponse.json({ message: "Commande introuvable" }, { status: 404 })
  }

  const { status: rawStatus } = await req.json()
  const status = STATUS_MAP[rawStatus]
  if (!status) return NextResponse.json({ message: "Statut invalide" }, { status: 400 })

  const updated = await prisma.order.update({ where: { id }, data: { status } })

  if (status === "Completed" && order.status !== "Completed") {
    await prisma.$transaction([
      prisma.driver.update({
        where: { id: driver.id },
        data: {
          earning: { increment: DELIVERY_FEE },
          walletMoney: { increment: DELIVERY_FEE },
          totalOrders: { increment: 1 },
        },
      }),
      prisma.transaction.create({
        data: {
          driverId: driver.id,
          amount: DELIVERY_FEE,
          type: "Credit",
          description: `Livraison ${order.orderId}`,
          status: "Completed",
        },
      }),
    ])
  }

  return NextResponse.json({ status: updated.status }, { headers: { "Access-Control-Allow-Origin": "*" } })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
