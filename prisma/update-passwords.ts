import { PrismaClient } from '../src/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10)
  const clientPassword = await bcrypt.hash("client123", 10)
  const driverPassword = await bcrypt.hash("driver123", 10)

  console.log("Updating passwords for seeded users...")
  console.log("Using URL:", process.env.DATABASE_URL?.split('@')[1])

  try {
    const resA = await prisma.admin.updateMany({
      where: { email: "admin@ndugumi.com" },
      data: { password: hashedPassword }
    })
    console.log("Admin updated:", resA.count)

    const resC = await prisma.user.updateMany({
      where: { email: "client@ndugumi.com" },
      data: { password: clientPassword }
    })
    console.log("Client updated:", resC.count)

    const resD = await prisma.driver.updateMany({
      where: { email: "driver@ndugumi.com" },
      data: { password: driverPassword }
    })
    console.log("Driver updated:", resD.count)

    console.log("Passwords updated successfully!")
  } catch (err) {
    console.error("Update failed:", err)
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => pool.end())
