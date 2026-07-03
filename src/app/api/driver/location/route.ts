import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthDriver } from "@/lib/driverAuth"

export async function PUT(req: Request) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { lat, lng } = await req.json()
  if (typeof lat !== "number" || typeof lng !== "number") {
    return NextResponse.json({ message: "lat et lng requis" }, { status: 400 })
  }

  await prisma.driver.update({
    where: { id: driver.id },
    data: { lastLocation: `${lat},${lng}` },
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
