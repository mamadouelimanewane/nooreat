import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signAuthToken } from "@/lib/authToken"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Identifiant et mot de passe requis" }, { status: 400 })
    }

    const driver = await prisma.driver.findFirst({
      where: { OR: [{ email }, { phone: email }] },
    })

    if (!driver) {
      return NextResponse.json({ message: "Livreur non trouvé" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, driver.password)
    if (!isValid) {
      return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 401 })
    }

    const token = await signAuthToken(driver.id)

    return NextResponse.json(
      {
        driver: {
          id: driver.id,
          name: driver.name,
          phone: driver.phone,
          email: driver.email,
          vehicleType: driver.vehicleType,
          rating: driver.rating,
          totalOrders: driver.totalOrders,
          walletBalance: driver.walletMoney,
        },
        token,
      },
      { headers: { "Access-Control-Allow-Origin": "*" } }
    )
  } catch (error: any) {
    return NextResponse.json({ message: "Erreur serveur: " + error.message }, { status: 500 })
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
