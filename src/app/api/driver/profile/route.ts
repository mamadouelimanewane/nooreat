import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthDriver } from "@/lib/driverAuth"

export async function GET(req: Request) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { password, ...profile } = driver
  return NextResponse.json(
    { ...profile, walletBalance: driver.walletMoney },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  )
}

export async function PUT(req: Request) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (typeof body.name === "string") data.name = body.name
  if (typeof body.phone === "string") data.phone = body.phone
  if (typeof body.vehicleType === "string") data.vehicleType = body.vehicleType

  const updated = await prisma.driver.update({ where: { id: driver.id }, data })
  const { password, ...profile } = updated
  return NextResponse.json(
    { ...profile, walletBalance: updated.walletMoney },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
