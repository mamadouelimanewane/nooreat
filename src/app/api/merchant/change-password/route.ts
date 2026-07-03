import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { getAuthedStoreId } from "@/lib/merchantSession"

export async function POST(req: Request) {
  const storeId = await getAuthedStoreId()
  if (!storeId) return NextResponse.json({ message: "Non autorisé" }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: "Mot de passe actuel et nouveau mot de passe requis" }, { status: 400 })
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ message: "Le nouveau mot de passe doit faire au moins 6 caractères" }, { status: 400 })
  }

  const store = await prisma.store.findUnique({ where: { id: storeId } })
  if (!store) return NextResponse.json({ message: "Magasin introuvable" }, { status: 404 })

  const isValid = await bcrypt.compare(currentPassword, store.password)
  if (!isValid) return NextResponse.json({ message: "Mot de passe actuel incorrect" }, { status: 401 })

  const hashed = await bcrypt.hash(newPassword, 10)
  await prisma.store.update({ where: { id: storeId }, data: { password: hashed } })

  return NextResponse.json({ ok: true })
}
