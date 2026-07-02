import { PrismaClient } from '../src/generated/prisma'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import * as dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding banners...')

  const banners = [
    {
      title: 'Fraîcheur Tropicale',
      image: '/banners/fresh.png',
      link: '/categories',
      status: 'Active',
      sequence: 1
    },
    {
      title: 'Tech & Lifestyle',
      image: '/banners/tech.png',
      link: '/category/electronics',
      status: 'Active',
      sequence: 2
    }
  ]

  for (const b of banners) {
    await prisma.sliderBanner.create({ data: b })
  }

  console.log('✅ Banners seeded!')
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect())
