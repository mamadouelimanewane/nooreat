import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthDriver } from "@/lib/driverAuth"
import { shapeDriverOrders } from "@/lib/driverOrders"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order || order.driverId !== null || order.status !== "Pending") {
    return NextResponse.json({ message: "Commande indisponible" }, { status: 409 })
  }

  const updated = await prisma.order.update({
    where: { id },
    data: { driverId: driver.id, status: "Processing" },
    include: { store: { select: { name: true, address: true } } },
  })

  const [shaped] = await shapeDriverOrders([updated])
  return NextResponse.json(shaped, { headers: { "Access-Control-Allow-Origin": "*" } })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
