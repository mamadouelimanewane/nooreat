import { cookies } from "next/headers"
import { verifyAuthToken } from "./authToken"
import { prisma } from "./prisma"

export async function getAuthedStoreId(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("merchant_token")?.value
  if (!token) return null
  return verifyAuthToken(token)
}

export async function getAuthedStore() {
  const storeId = await getAuthedStoreId()
  if (!storeId) return null
  return prisma.store.findUnique({ where: { id: storeId } })
}
