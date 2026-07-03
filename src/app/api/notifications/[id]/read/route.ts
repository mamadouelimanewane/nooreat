import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const { id } = await params
    const notification = await prisma.notification.findUnique({ where: { id } })
    if (!notification) return NextResponse.json({ message: "Notification introuvable" }, { status: 404 })

    await prisma.notificationRead.upsert({
      where: { notificationId_userId: { notificationId: id, userId: user.id } },
      update: {},
      create: { notificationId: id, userId: user.id },
    })

    return NextResponse.json({ ok: true }, { headers: { "Access-Control-Allow-Origin": "*" } })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
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
