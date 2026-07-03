import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

export async function GET() {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const reviews = await prisma.review.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  })

  const userIds = [...new Set(reviews.map((r) => r.userId).filter((id): id is string => !!id))]
  const users = userIds.length ? await prisma.user.findMany({ where: { id: { in: userIds } } }) : []
  const usersById = new Map(users.map((u) => [u.id, u]))

  const enriched = reviews.map((r) => ({
    ...r,
    customerName: (r.userId && usersById.get(r.userId)?.name) ?? "Client",
  }))

  return NextResponse.json({ reviews: enriched })
}
