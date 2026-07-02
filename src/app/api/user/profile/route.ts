import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    // Return profile without password
    const { password, ...safeUser } = user

    return NextResponse.json(safeUser, { headers: { "Access-Control-Allow-Origin": "*" } })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const { name, email, phone } = await req.json()

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { name, email, phone }
    })

    const { password, ...safeUser } = updatedUser

    return NextResponse.json(safeUser, { headers: { "Access-Control-Allow-Origin": "*" } })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  })
}
