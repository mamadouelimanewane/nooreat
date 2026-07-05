import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const CUISINE_EMOJI: Record<string, string> = {
  "Sénégalaise": "🍛",
  "Fruits de mer": "🦐",
  "Grillades": "🍢",
  "Pizzeria": "🍕",
  "Japonais": "🍣",
  "Asiatique": "🍜",
  "Fast Food": "🍔",
  "Épicerie": "🏪",
}

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

    // Map to mobile expected format (fields kept for backward compat) + extra fields for the web client.
    // `image` now stores a real photo URL (not an emoji) — mobile still gets a text emoji via `emoji`,
    // derived from cuisine, while the web client renders the actual photo via `photo`.
    const formatted = stores.map(s => ({
      id: s.id,
      name: s.name,
      location: s.address,
      rating: s.rating,
      deliveryTime: s.deliveryTimeMinutes || "20-40 min",
      minOrder: s.minOrder ?? 1000,
      emoji: CUISINE_EMOJI[s.cuisine || ""] || "🏪",
      photo: s.image && s.image.startsWith("http") ? s.image : null,
      cuisine: s.cuisine || "Divers",
      description: s.description,
      deliveryFee: s.deliveryFee ?? 1000,
    }))

    return NextResponse.json(formatted)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
