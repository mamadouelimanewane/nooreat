import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAuthUser } from "@/lib/auth"

export async function GET(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    return NextResponse.json({ balance: user.walletMoney }, { headers: { "Access-Control-Allow-Origin": "*" } })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req)
    if (!user) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

    const { amount } = await req.json()
    if (!amount || amount <= 0) return NextResponse.json({ message: "Montant invalide" }, { status: 400 })

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { walletMoney: { increment: amount } }
    })

    // Log transaction
    await prisma.transaction.create({
      data: {
        userId: user.id,
        amount: amount,
        type: "Credit",
        description: "Recharge portefeuille mobile",
        status: "Completed"
      }
    })

    return NextResponse.json({ balance: updatedUser.walletMoney }, { headers: { "Access-Control-Allow-Origin": "*" } })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }
  })
}
