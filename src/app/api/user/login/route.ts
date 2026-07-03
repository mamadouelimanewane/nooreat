import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signAuthToken } from "@/lib/authToken"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email et mot de passe requis" }, { status: 400 })
    }

    // Direct match for phone OR email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: email }
        ]
      }
    })

    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 401 })
    }

    const token = await signAuthToken(user.id)

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        walletMoney: user.walletMoney,
      },
      token: token
    }, {
      headers: { "Access-Control-Allow-Origin": "*" }
    })

  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Erreur serveur: " + error.message }, { status: 500 })
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
