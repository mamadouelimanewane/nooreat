import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { status: "Active" },
    })

    const formatted = categories.map(c => ({
      id: c.id,
      name: c.name,
      emoji: c.image || "📦",
      color: "#F0F0F0" // Default light color
    }))

    return NextResponse.json(formatted)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
