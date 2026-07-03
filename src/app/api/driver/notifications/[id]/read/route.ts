import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthDriver } from "@/lib/driverAuth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const notification = await prisma.notification.findUnique({ where: { id } })
  if (!notification) return NextResponse.json({ message: "Notification introuvable" }, { status: 404 })

  await prisma.notificationRead.upsert({
    where: { notificationId_driverId: { notificationId: id, driverId: driver.id } },
    update: {},
    create: { notificationId: id, driverId: driver.id },
  })

  return NextResponse.json({ ok: true }, { headers: { "Access-Control-Allow-Origin": "*" } })
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
