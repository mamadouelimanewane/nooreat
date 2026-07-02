import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Bonus distribution:
const REWARD_SPONSOR = 1000
const REWARD_REFERRED = 500

export async function POST(req: Request) {
  try {
    const { userId, referralCode } = await req.json()

    if (!userId || !referralCode) {
      return NextResponse.json({ message: "userId and referralCode are required" }, { status: 400 })
    }

    const newClient = await prisma.user.findUnique({ where: { id: userId } })
    if (!newClient) return NextResponse.json({ message: "User not found" }, { status: 404 })

    if (newClient.referredBy) {
      return NextResponse.json({ message: "Vous avez déjà utilisé un code de parrainage." }, { status: 400 })
    }

    const sponsor = await prisma.user.findUnique({ where: { referralCode } })
    if (!sponsor) {
      return NextResponse.json({ message: "Code de parrainage invalide." }, { status: 404 })
    }

    if (sponsor.id === userId) {
      return NextResponse.json({ message: "Vous ne pouvez pas vous parrainer vous-même." }, { status: 400 })
    }

    // Give cashback in transaction!
    await prisma.$transaction([
      // Update newClient
      prisma.user.update({
        where: { id: userId },
        data: {
          referredBy: sponsor.id,
          walletMoney: { increment: REWARD_REFERRED }
        }
      }),
      prisma.transaction.create({
        data: { userId, amount: REWARD_REFERRED, type: "credit", method: "System", description: "Bonus de parrainage (filleul)", status: "Completed" }
      }),
      // Update sponsor
      prisma.user.update({
        where: { id: sponsor.id },
        data: { walletMoney: { increment: REWARD_SPONSOR } }
      }),
      prisma.transaction.create({
        data: { userId: sponsor.id, amount: REWARD_SPONSOR, type: "credit", method: "System", description: `Bonus de parrainage client (${newClient.name})`, status: "Completed" }
      })
    ])

    return NextResponse.json({
      message: "Parrainage appliqué avec succès. Bonus crédités !",
    })
  } catch (error: any) {
    console.error("Referral Error:", error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
