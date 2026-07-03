import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const { amount, method } = await req.json()

    if (!amount || !method) {
      return NextResponse.json({ message: "amount et method sont requis" }, { status: 400 })
    }
    if (amount <= 0) {
      return NextResponse.json({ message: "Le montant doit être positif" }, { status: 400 })
    }

    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { walletMoney: { increment: amount } },
      }),
      prisma.transaction.create({
        data: {
          userId: user.id,
          amount,
          type: "Credit",
          method,
          description: `Rechargement via ${method}`,
          status: "Completed",
        },
      }),
    ])

    return NextResponse.json(
      { message: "Recharge réussie", walletMoney: updatedUser.walletMoney, transaction },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
