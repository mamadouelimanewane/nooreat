import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

export async function GET() {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const products = await prisma.product.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ products })
}

export async function POST(req: Request) {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { name, description, price, category, photo } = await req.json()
  if (!name || price === undefined) {
    return NextResponse.json({ message: "Nom et prix requis" }, { status: 400 })
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price: Number(price),
      category: category || null,
      photo: photo || null,
      storeId,
    },
  })

  return NextResponse.json({ product }, { status: 201 })
}
