import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

const ALLOWED_STATUSES = ["Pending", "Processing", "Completed", "Cancelled"]

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const order = await prisma.order.findUnique({ where: { id } })
  if (!order || order.storeId !== storeId) {
    return NextResponse.json({ message: "Commande introuvable" }, { status: 404 })
  }

  const { status } = await req.json()
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ message: "Statut invalide" }, { status: 400 })
  }

  const updated = await prisma.order.update({ where: { id }, data: { status } })
  return NextResponse.json({ order: updated })
}
