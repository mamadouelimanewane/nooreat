import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      where: { status: "Active" },
      select: {
        id: true,
        name: true,
        address: true,
        rating: true,
        image: true,
        cuisine: true,
        description: true,
        minOrder: true,
        deliveryFee: true,
        deliveryTimeMinutes: true,
      }
    })

    // Map to mobile expected format (fields kept for backward compat) + extra fields for the web client
    const formatted = stores.map(s => ({
      id: s.id,
      name: s.name,
      location: s.address,
      rating: s.rating,
      deliveryTime: s.deliveryTimeMinutes || "20-40 min",
      minOrder: s.minOrder ?? 1000,
      emoji: s.image || "🏪",
      cuisine: s.cuisine || "Divers",
      description: s.description,
      deliveryFee: s.deliveryFee ?? 1000,
    }))

    return NextResponse.json(formatted)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
