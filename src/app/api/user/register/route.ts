import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signAuthToken } from "@/lib/authToken"

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Champs requis manquants" }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json({ message: "Cet utilisateur existe déjà" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        walletMoney: 0,
        status: "Active",
      }
    })

    const token = await signAuthToken(newUser.id)

    return NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        walletMoney: newUser.walletMoney,
      },
      token: token
    }, {
      headers: { "Access-Control-Allow-Origin": "*" }
    })

  } catch (error: any) {
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
