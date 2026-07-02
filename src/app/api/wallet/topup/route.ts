import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId, amount, method } = await req.json()

    if (!userId || !amount || !method) {
      return NextResponse.json({ message: "userId, amount and method are required" }, { status: 400 })
    }

    if (amount <= 0) {
      return NextResponse.json({ message: "Amount must be positive" }, { status: 400 })
    }

    // Wrap in a transaction to ensure integrity
    const [user, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { walletMoney: { increment: amount } }
      }),
      prisma.transaction.create({
        data: {
          userId,
          amount,
          type: "credit",
          method,
          description: `Rechargement planifié via ${method}`,
          status: "Completed"
        }
      })
    ])

    return NextResponse.json({
      message: "Recharge réussie",
      walletMoney: user.walletMoney,
      transaction
    })
  } catch (error: any) {
    console.error("Wallet Topup Error:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
