import { NextResponse } from "next/server"
import { getAuthedStore } from "@/lib/merchantSession"

export async function GET() {
  const store = await getAuthedStore()
  if (!store) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
  }

  return NextResponse.json({
    store: {
      id: store.id,
      name: store.name,
      email: store.email,
      segment: store.segment,
    },
  })
}
