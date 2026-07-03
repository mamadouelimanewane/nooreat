import { NextResponse } from "next/server"
import { getAuthDriver } from "@/lib/driverAuth"

export async function POST(req: Request) {
  const driver = await getAuthDriver(req)
  if (!driver) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  // Pas de suivi persistant du refus : la commande reste disponible pour les autres livreurs.
  return NextResponse.json({ ok: true }, { headers: { "Access-Control-Allow-Origin": "*" } })
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
