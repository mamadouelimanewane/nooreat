import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    const products = await prisma.product.findMany({
      where: { storeId: id, status: "Active" },
    })

    const formatted = products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      description: p.description,
      image: p.image || "📦",
      category: p.category
    }))

    return NextResponse.json(formatted, { headers: { "Access-Control-Allow-Origin": "*" } })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  })
}
