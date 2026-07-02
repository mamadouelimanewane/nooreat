import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { target: "All" },
          { target: user.id }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(notifications, { headers: { "Access-Control-Allow-Origin": "*" } })
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
    }
  })
}
