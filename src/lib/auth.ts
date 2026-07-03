import { prisma } from "./prisma"
import { verifyAuthToken } from "./authToken"

export async function getAuthUser(req: Request) {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null

  const token = authHeader.split(" ")[1]
  const userId = await verifyAuthToken(token)
  if (!userId) return null

  return await prisma.user.findUnique({
    where: { id: userId }
  })
}
