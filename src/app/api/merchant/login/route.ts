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

    const store = await prisma.store.findUnique({ where: { email } })
    if (!store || store.status !== "Active") {
      return NextResponse.json({ message: "Identifiants incorrects" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, store.password)
    if (!isValid) {
      return NextResponse.json({ message: "Identifiants incorrects" }, { status: 401 })
    }

    const token = await signAuthToken(store.id)

    const response = NextResponse.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        segment: store.segment,
      },
    })

    response.cookies.set("merchant_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    return response
  } catch (error: any) {
    return NextResponse.json({ message: "Erreur serveur: " + error.message }, { status: 500 })
  }
}
