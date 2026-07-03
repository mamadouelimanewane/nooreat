import { prisma } from "./prisma"
import { verifyAuthToken } from "./authToken"

export async function getAuthDriver(req: Request) {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null

  const token = authHeader.split(" ")[1]
  const driverId = await verifyAuthToken(token)
  if (!driverId) return null

  return await prisma.driver.findUnique({ where: { id: driverId } })
}

export const DELIVERY_FEE = 1000
