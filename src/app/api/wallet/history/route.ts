import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 })
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    return NextResponse.json(transactions)
  } catch (error: any) {
    console.error("Wallet History Error:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
