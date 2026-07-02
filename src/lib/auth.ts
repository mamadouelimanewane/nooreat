import { prisma } from "./prisma"

export async function getAuthUser(req: Request) {
  const authHeader = req.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null

  const token = authHeader.split(" ")[1]
  // Token format: NOOR EAT_UUID_TIMESTAMP
  const parts = token.split("_")
  if (parts.length < 2) return null

  const userId = parts[1]
  
  return await prisma.user.findUnique({
    where: { id: userId }
  })
}
