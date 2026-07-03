import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthDriver } from "@/lib/driverAuth"

export async function GET(req: Request) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const notifications = await prisma.notification.findMany({
    where: { OR: [{ target: "All" }, { target: driver.id }] },
    orderBy: { createdAt: "desc" },
  })

  const reads = await prisma.notificationRead.findMany({
    where: { driverId: driver.id, notificationId: { in: notifications.map((n) => n.id) } },
  })
  const readIds = new Set(reads.map((r) => r.notificationId))

  return NextResponse.json(
    notifications.map((n) => ({ ...n, read: readIds.has(n.id) })),
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
