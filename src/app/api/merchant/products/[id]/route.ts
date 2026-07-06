import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

async function assertOwnedProduct(storeId: string, productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product || product.storeId !== storeId) return null
  return product
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const existing = await assertOwnedProduct(storeId, id)
  if (!existing) return NextResponse.json({ message: "Produit introuvable" }, { status: 404 })

  const body = await req.json()
  const data: Record<string, unknown> = {}
  if (typeof body.name === "string") data.name = body.name
  if (typeof body.description === "string") data.description = body.description
  if (body.price !== undefined) data.price = Number(body.price)
  if (typeof body.category === "string") data.category = body.category
  if (typeof body.status === "string") data.status = body.status
  if (typeof body.photo === "string") data.photo = body.photo || null

  const product = await prisma.product.update({ where: { id }, data })
  return NextResponse.json({ product })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const existing = await assertOwnedProduct(storeId, id)
  if (!existing) return NextResponse.json({ message: "Produit introuvable" }, { status: 404 })

  await prisma.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
