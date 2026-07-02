import { PrismaClient } from '../src/generated/prisma'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database with initial data...')

  // 1. Create a Super Admin
  const hashedAdminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@ndugumi.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@ndugumi.com',
      password: hashedAdminPassword,
      role: 'SuperAdmin',
      status: 'Active',
    },
  })
  console.log('✅ Admin created:', admin.email)

  // 2. Create some initial Settings/Countries
  const sn = await prisma.country.upsert({
    where: { code: 'SN' },
    update: {},
    create: {
      name: 'Sénégal',
      code: 'SN',
      status: 'Active',
    },
  })
  console.log('✅ Country created:', sn.name)

  const dakar = await prisma.serviceArea.create({
    data: {
      name: 'Dakar',
      country: 'Sénégal',
      status: 'Active',
    },
  })
  console.log('✅ Service Area created:', dakar.name)

  // 3. Create a User
  const user = await prisma.user.upsert({
    where: { email: 'client@ndugumi.com' },
    update: {},
    create: {
      name: 'Client Test',
      email: 'client@ndugumi.com',
      phone: '770000000',
      walletMoney: 5000,
      userType: 'Retail',
      status: 'Active',
    },
  })
  console.log('✅ User created:', user.email)

  // 4. Create a Store (Magasin)
  const store = await prisma.store.upsert({
    where: { email: 'store@ndugumi.com' },
    update: {},
    create: {
      name: 'Ndugumi Market Principal',
      email: 'store@ndugumi.com',
      phone: '771112233',
      address: 'Plateau, Dakar',
      rating: 4.8,
      status: 'Active',
      serviceArea: 'Dakar',
      segment: 'GROCERY',
    },
  })
  console.log('✅ Store created:', store.name)

  // 5. Create basic Categories & Products
  const catFruits = await prisma.category.create({
    data: {
      name: 'Fruits et Légumes',
      segment: 'Epicerie',
      status: 'Active',
    },
  })
  console.log('✅ Category created:', catFruits.name)

  await prisma.product.create({
    data: {
      name: 'Bananes Locales',
      description: 'Bananes fraîches du Sénégal',
      price: 1500,
      status: 'Active',
      category: 'Fruits et Légumes',
      storeId: store.id,
    },
  })
  console.log('✅ Product created')

  // 6. Create a Driver
  const driver = await prisma.driver.upsert({
    where: { email: 'driver@ndugumi.com' },
    update: {},
    create: {
      name: 'Livreur Pro',
      email: 'driver@ndugumi.com',
      phone: '772223344',
      serviceArea: 'Dakar',
      vehicleType: 'Moto',
      status: 'Active',
      approvalStatus: 'Approved',
    },
  })
  console.log('✅ Driver created:', driver.email)

  console.log('Database seeded successfully! 🎉')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
