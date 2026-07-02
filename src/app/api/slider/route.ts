import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const banners = await prisma.sliderBanner.findMany({
      where: { status: "Active" },
      orderBy: { sequence: 'asc' }
    })

    const formatted = banners.map((b, idx) => ({
      id: b.id,
      title: b.title,
      subtitle: "Promotion exclusive",
      // Map sequence to some colors for variety if missing
      bg: idx % 2 === 0 ? "#6366F1" : "#10B981",
      emoji: b.image.startsWith("/") ? "" : b.image, // Use emoji if not a path
      imageUrl: b.image.startsWith("/") ? `https://NOOR EAT.vercel.app${b.image}` : null
    }))

    return NextResponse.json(formatted)
  } catch (error: any) {
    console.error("Slider API Error:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
