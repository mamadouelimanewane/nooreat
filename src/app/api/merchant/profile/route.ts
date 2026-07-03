import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

export async function GET() {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const store = await prisma.store.findUnique({ where: { id: storeId } })
  if (!store) return NextResponse.json({ message: "Magasin introuvable" }, { status: 404 })

  const { password, ...profile } = store
  return NextResponse.json({ store: profile })
}

export async function PUT(req: Request) {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (typeof body.name === "string") data.name = body.name
  if (typeof body.description === "string") data.description = body.description
  if (typeof body.phone === "string") data.phone = body.phone
  if (typeof body.address === "string") data.address = body.address
  if (body.minOrder !== undefined) data.minOrder = body.minOrder === null ? null : Number(body.minOrder)
  if (body.deliveryFee !== undefined) data.deliveryFee = body.deliveryFee === null ? null : Number(body.deliveryFee)
  if (typeof body.deliveryTimeMinutes === "string") data.deliveryTimeMinutes = body.deliveryTimeMinutes
  if (body.openingHours !== undefined) data.openingHours = body.openingHours

  const store = await prisma.store.update({ where: { id: storeId }, data })
  const { password, ...profile } = store
  return NextResponse.json({ store: profile })
}
