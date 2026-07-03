import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthDriver } from "@/lib/driverAuth"
import { shapeDriverOrders } from "@/lib/driverOrders"

export async function GET(req: Request) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const orders = await prisma.order.findMany({
    where: { driverId: null, status: "Pending" },
    include: { store: { select: { name: true, address: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  return NextResponse.json(await shapeDriverOrders(orders), { headers: { "Access-Control-Allow-Origin": "*" } })
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
