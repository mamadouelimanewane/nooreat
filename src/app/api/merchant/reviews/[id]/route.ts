import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const existing = await prisma.review.findUnique({ where: { id } })
  if (!existing || existing.storeId !== storeId) {
    return NextResponse.json({ message: "Avis introuvable" }, { status: 404 })
  }

  const { reply } = await req.json()
  if (!reply || typeof reply !== "string") {
    return NextResponse.json({ message: "Réponse requise" }, { status: 400 })
  }

  const review = await prisma.review.update({
    where: { id },
    data: { reply, repliedAt: new Date() },
  })

  return NextResponse.json({ review })
}
