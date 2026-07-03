import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

export async function GET() {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const store = await prisma.store.findUnique({ where: { id: storeId } })
  if (!store) return NextResponse.json({ message: "Magasin introuvable" }, { status: 404 })

  const transactions = await prisma.transaction.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return NextResponse.json({ balance: store.walletMoney, transactions })
}
