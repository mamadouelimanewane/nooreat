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
        // Add other needed fields for mobile
      }
    })

    // Map to mobile expected format if necessary
    const formatted = stores.map(s => ({
      id: s.id,
      name: s.name,
      location: s.address,
      rating: s.rating,
      deliveryTime: "20-40 min", // Placeholder or calculate
      minOrder: 1000,
      emoji: s.image || "🏪"
    }))

    return NextResponse.json(formatted)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
