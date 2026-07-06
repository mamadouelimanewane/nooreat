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
  const adminEmail = process.env.ADMIN_SEED_EMAIL
  const adminPassword = process.env.ADMIN_SEED_PASSWORD
  if (!adminEmail || !adminPassword) {
    throw new Error('ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD must be set to seed the super admin account')
  }
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10)
  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedAdminPassword },
    create: {
      name: 'Super Admin',
      email: adminEmail,
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
    where: { email: 'client@nooreat.com' },
    update: {},
    create: {
      name: 'Client Test',
      email: 'client@nooreat.com',
      phone: '770000000',
      walletMoney: 5000,
      userType: 'Retail',
      status: 'Active',
    },
  })
  console.log('✅ User created:', user.email)

  // 4. Create a Store (Magasin)
  const storeSeedPassword = process.env.STORE_SEED_PASSWORD
  if (!storeSeedPassword) {
    throw new Error('STORE_SEED_PASSWORD must be set to seed the demo store account')
  }
  const hashedStorePassword = await bcrypt.hash(storeSeedPassword, 10)
  const store = await prisma.store.upsert({
    where: { email: 'store@nooreat.com' },
    update: { password: hashedStorePassword, name: 'NOOR Market Plateau', cuisine: 'Épicerie', image: 'https://loremflickr.com/480/360/grocerystore/all?lock=216' },
    create: {
      name: 'NOOR Market Plateau',
      email: 'store@nooreat.com',
      password: hashedStorePassword,
      phone: '771112233',
      address: 'Plateau, Dakar',
      rating: 4.8,
      status: 'Active',
      serviceArea: 'Dakar',
      segment: 'GROCERY',
      cuisine: 'Épicerie',
      image: 'https://loremflickr.com/480/360/grocerystore/all?lock=216',
    },
  })
  console.log('✅ Store created:', store.name)

  // 5. Create basic Categories & Products
  const existingCatFruits = await prisma.category.findFirst({ where: { name: 'Fruits et Légumes' } })
  const catFruits =
    existingCatFruits ??
    (await prisma.category.create({
      data: {
        name: 'Fruits et Légumes',
        segment: 'Epicerie',
        status: 'Active',
      },
    }))
  console.log('✅ Category created:', catFruits.name)

  const existingProduct = await prisma.product.findFirst({ where: { name: 'Bananes Locales', storeId: store.id } })
  if (!existingProduct) {
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
  }
  console.log('✅ Product created')

  // 6. Create a Driver
  const driverSeedPassword = process.env.DRIVER_SEED_PASSWORD
  if (!driverSeedPassword) {
    throw new Error('DRIVER_SEED_PASSWORD must be set to seed the demo driver account')
  }
  const hashedDriverPassword = await bcrypt.hash(driverSeedPassword, 10)
  const driver = await prisma.driver.upsert({
    where: { email: 'driver@nooreat.com' },
    update: { password: hashedDriverPassword },
    create: {
      name: 'Livreur Pro',
      email: 'driver@nooreat.com',
      password: hashedDriverPassword,
      phone: '772223344',
      serviceArea: 'Dakar',
      vehicleType: 'Moto',
      status: 'Active',
      approvalStatus: 'Approved',
    },
  })
  console.log('✅ Driver created:', driver.email)

  // 7. Restaurants sénégalais + 5 fast-foods célèbres et connus de Dakar
  type SeedProduct = { name: string; description: string; price: number; image: string; category: string }
  type SeedStore = {
    name: string
    email: string
    phone: string
    address: string
    image: string
    photo: string
    rating: number
    category: string
    description: string
    minOrder: number
    deliveryFee: number
    deliveryTimeMinutes: string
    products: SeedProduct[]
  }

  function photoUrl(tag: string, lock: number): string {
    return `https://loremflickr.com/480/360/${tag}/all?lock=${lock}`
  }

  const restaurants: SeedStore[] = [
    {
      name: 'Chez Loutcha',
      email: 'contact@chezloutcha.nooreat.com',
      phone: '338211234',
      address: 'Rue Parchappe x Carnot, Plateau, Dakar',
      image: '🍛',
      photo: photoUrl('senegalfood', 201),
      rating: 4.7,
      category: 'Sénégalaise',
      description: 'Institution dakaroise, cuisine sénégalaise et capverdienne généreuse.',
      minOrder: 2000,
      deliveryFee: 1000,
      deliveryTimeMinutes: '25-40 min',
      products: [
        { name: 'Thiéboudienne rouge', description: 'Riz au poisson, sauce tomate et légumes', price: 3000, image: '🍚', category: 'Plats' },
        { name: 'Thiéboudienne blanc', description: 'Riz au poisson, sauce blanche', price: 3000, image: '🍚', category: 'Plats' },
        { name: 'Yassa poulet', description: 'Poulet mariné aux oignons et citron', price: 2500, image: '🍗', category: 'Plats' },
        { name: 'Mafé viande', description: 'Sauce à l\'arachide, riz blanc', price: 2800, image: '🥘', category: 'Plats' },
        { name: 'Bissap', description: 'Jus d\'hibiscus glacé', price: 500, image: '🥤', category: 'Boissons' },
      ],
    },
    {
      name: "Keur N'Deye",
      email: 'contact@keurndeye.nooreat.com',
      phone: '338219876',
      address: 'Rue Vincens, Plateau, Dakar',
      image: '🐟',
      photo: photoUrl("jollofrice", 202),
      rating: 4.6,
      category: 'Sénégalaise',
      description: 'Cuisine traditionnelle sénégalaise au cœur du Plateau.',
      minOrder: 2000,
      deliveryFee: 1000,
      deliveryTimeMinutes: '25-40 min',
      products: [
        { name: 'Thiéboudienne au poisson', description: 'Plat national sénégalais', price: 3200, image: '🍚', category: 'Plats' },
        { name: 'Yassa poisson', description: 'Poisson mariné aux oignons', price: 2700, image: '🐟', category: 'Plats' },
        { name: 'Soupou kandia', description: 'Sauce gombo, riz blanc', price: 2900, image: '🥘', category: 'Plats' },
        { name: 'Pastels', description: 'Beignets farcis au poisson', price: 1000, image: '🥟', category: 'Entrées' },
      ],
    },
    {
      name: 'Le Djoloff',
      email: 'contact@ledjoloff.nooreat.com',
      phone: '338501122',
      address: 'Route de la Corniche, Yoff, Dakar',
      image: '🍚',
      photo: photoUrl('fishgrill', 203),
      rating: 4.5,
      category: 'Sénégalaise',
      description: 'Vue sur l\'océan et grands classiques sénégalais.',
      minOrder: 2500,
      deliveryFee: 1200,
      deliveryTimeMinutes: '30-45 min',
      products: [
        { name: 'Thiof braisé', description: 'Poisson thiof grillé, riz', price: 4500, image: '🐟', category: 'Plats' },
        { name: 'Yassa poulet', description: 'Poulet mariné, oignons confits', price: 2600, image: '🍗', category: 'Plats' },
        { name: 'Riz au poisson', description: 'Riz cassé, poisson braisé', price: 2900, image: '🍚', category: 'Plats' },
        { name: 'Salade Djoloff', description: 'Salade fraîche de saison', price: 1500, image: '🥗', category: 'Entrées' },
      ],
    },
    {
      name: 'La Calebasse',
      email: 'contact@lacalebasse.nooreat.com',
      phone: '338601133',
      address: 'Route des Almadies, Ouakam, Dakar',
      image: '🥘',
      photo: photoUrl('africancuisine', 204),
      rating: 4.4,
      category: 'Sénégalaise',
      description: 'Cadre chaleureux, décor africain, cuisine locale authentique.',
      minOrder: 2000,
      deliveryFee: 1000,
      deliveryTimeMinutes: '25-40 min',
      products: [
        { name: 'Mafé poulet', description: 'Sauce arachide, poulet fermier', price: 2700, image: '🥘', category: 'Plats' },
        { name: 'Domoda', description: 'Ragoût de bœuf à l\'arachide', price: 2500, image: '🍲', category: 'Plats' },
        { name: 'Thiakry', description: 'Dessert au mil et lait caillé', price: 800, image: '🍮', category: 'Desserts' },
        { name: 'Jus de bissap', description: 'Boisson glacée à l\'hibiscus', price: 500, image: '🥤', category: 'Boissons' },
      ],
    },
    {
      name: 'Le Lagon',
      email: 'contact@lelagon.nooreat.com',
      phone: '338221144',
      address: 'Route de la Corniche Est, Dakar',
      image: '🦐',
      photo: photoUrl('seafoodplatter', 205),
      rating: 4.6,
      category: 'Fruits de mer',
      description: 'Fruits de mer face à l\'océan, une adresse emblématique de Dakar.',
      minOrder: 3000,
      deliveryFee: 1500,
      deliveryTimeMinutes: '35-50 min',
      products: [
        { name: 'Plateau de fruits de mer', description: 'Assortiment de crustacés et coquillages', price: 8500, image: '🦐', category: 'Fruits de mer' },
        { name: 'Langouste grillée', description: 'Langouste fraîche grillée au beurre', price: 9000, image: '🦞', category: 'Fruits de mer' },
        { name: 'Crevettes à l\'ail', description: 'Crevettes sautées à l\'ail et persil', price: 4500, image: '🍤', category: 'Fruits de mer' },
        { name: 'Poisson braisé', description: 'Poisson du jour, sauce citronnée', price: 4000, image: '🐟', category: 'Plats' },
      ],
    },
    {
      name: "Le N'Gor",
      email: 'contact@lengor.nooreat.com',
      phone: '338601155',
      address: 'Plage de Ngor, Dakar',
      image: '🦞',
      photo: photoUrl('prawns', 206),
      rating: 4.3,
      category: 'Fruits de mer',
      description: 'Les pieds dans le sable face à l\'île de Ngor.',
      minOrder: 3000,
      deliveryFee: 1500,
      deliveryTimeMinutes: '35-50 min',
      products: [
        { name: 'Homard grillé', description: 'Homard entier grillé au beurre citronné', price: 9500, image: '🦞', category: 'Fruits de mer' },
        { name: 'Calamars frits', description: 'Calamars frits, sauce tartare', price: 3500, image: '🦑', category: 'Fruits de mer' },
        { name: 'Soupe de poisson', description: 'Soupe de poisson traditionnelle', price: 2000, image: '🍲', category: 'Entrées' },
        { name: 'Salade de la mer', description: 'Fruits de mer, vinaigrette légère', price: 3000, image: '🥗', category: 'Entrées' },
      ],
    },
    {
      name: 'Dibiterie Sahel',
      email: 'contact@dibiteriesahel.nooreat.com',
      phone: '338701166',
      address: 'Sacré-Cœur 3, Dakar',
      image: '🍢',
      photo: photoUrl('grilledmeat', 207),
      rating: 4.5,
      category: 'Grillades',
      description: 'Viande grillée à la sénégalaise, ambiance conviviale.',
      minOrder: 1500,
      deliveryFee: 1000,
      deliveryTimeMinutes: '20-35 min',
      products: [
        { name: 'Dibi mouton', description: 'Mouton grillé, oignons et moutarde', price: 3500, image: '🍖', category: 'Grillades' },
        { name: 'Brochettes de bœuf', description: '4 brochettes marinées grillées', price: 2500, image: '🍢', category: 'Grillades' },
        { name: 'Poulet braisé', description: 'Demi-poulet mariné braisé', price: 2800, image: '🍗', category: 'Grillades' },
        { name: 'Frites maison', description: 'Frites fraîches croustillantes', price: 1000, image: '🍟', category: 'Accompagnements' },
      ],
    },
    {
      name: 'Pizza Deli',
      email: 'contact@pizzadeli.nooreat.com',
      phone: '338801177',
      address: 'Mermoz, Dakar',
      image: '🍕',
      photo: photoUrl('pizza', 208),
      rating: 4.2,
      category: 'Pizzeria',
      description: 'Pizzas artisanales cuites au four à bois.',
      minOrder: 2000,
      deliveryFee: 1000,
      deliveryTimeMinutes: '25-40 min',
      products: [
        { name: 'Pizza Margherita', description: 'Tomate, mozzarella, basilic', price: 4000, image: '🍕', category: 'Pizzas' },
        { name: 'Pizza 4 fromages', description: 'Mozzarella, chèvre, bleu, parmesan', price: 5000, image: '🍕', category: 'Pizzas' },
        { name: 'Pizza Pepperoni', description: 'Pepperoni épicé, mozzarella', price: 4500, image: '🍕', category: 'Pizzas' },
        { name: 'Tiramisu', description: 'Dessert italien classique', price: 1500, image: '🍰', category: 'Desserts' },
      ],
    },
    {
      name: 'Sushi Yoff',
      email: 'contact@sushiyoff.nooreat.com',
      phone: '338901188',
      address: 'Route de Ngor, Yoff, Dakar',
      image: '🍣',
      photo: photoUrl('sushi', 209),
      rating: 4.4,
      category: 'Japonais',
      description: 'Sushis frais et cuisine japonaise à Dakar.',
      minOrder: 3000,
      deliveryFee: 1500,
      deliveryTimeMinutes: '30-45 min',
      products: [
        { name: 'Plateau California (12 pcs)', description: 'Avocat, surimi, concombre', price: 6000, image: '🍣', category: 'Sushis' },
        { name: 'Plateau Saumon (12 pcs)', description: 'Saumon frais, riz vinaigré', price: 6500, image: '🍣', category: 'Sushis' },
        { name: 'Nouilles Yakisoba', description: 'Nouilles sautées, légumes, poulet', price: 3000, image: '🍜', category: 'Plats' },
        { name: 'Soupe miso', description: 'Soupe miso traditionnelle', price: 1500, image: '🍲', category: 'Entrées' },
      ],
    },
    {
      name: 'Le Jardin Thaïlandais',
      email: 'contact@jardinthai.nooreat.com',
      phone: '338111199',
      address: 'Almadies, Dakar',
      image: '🍜',
      photo: photoUrl('thaicurry', 210),
      rating: 4.5,
      category: 'Asiatique',
      description: 'Saveurs thaïlandaises authentiques dans un cadre verdoyant.',
      minOrder: 2500,
      deliveryFee: 1200,
      deliveryTimeMinutes: '30-45 min',
      products: [
        { name: 'Pad Thaï poulet', description: 'Nouilles sautées, poulet, cacahuètes', price: 3500, image: '🍜', category: 'Plats' },
        { name: 'Curry vert', description: 'Curry vert thaï, lait de coco', price: 3800, image: '🍛', category: 'Plats' },
        { name: 'Nems (6 pcs)', description: 'Nems croustillants, sauce nuoc-mâm', price: 2000, image: '🥟', category: 'Entrées' },
        { name: 'Riz sauté', description: 'Riz sauté aux légumes', price: 2200, image: '🍚', category: 'Accompagnements' },
      ],
    },
  ]

  const fastFoods: SeedStore[] = [
    {
      name: 'KFC Mermoz',
      email: 'contact@kfc-mermoz.nooreat.com',
      phone: '338221100',
      address: 'Route de Ouakam, Mermoz, Dakar',
      image: '🍗',
      photo: photoUrl('chickenfry', 211),
      rating: 4.3,
      category: 'Fast Food',
      description: 'Poulet frit croustillant, la référence mondiale à Dakar.',
      minOrder: 1500,
      deliveryFee: 1000,
      deliveryTimeMinutes: '20-35 min',
      products: [
        { name: 'Bucket 8 pièces', description: 'Poulet frit croustillant x8', price: 6500, image: '🍗', category: 'Poulet' },
        { name: 'Zinger Burger', description: 'Burger poulet épicé croustillant', price: 2500, image: '🍔', category: 'Burgers' },
        { name: 'Menu Tenders (3 pcs)', description: 'Tenders de poulet, frites, boisson', price: 3000, image: '🍗', category: 'Menus' },
        { name: 'Frites', description: 'Frites croustillantes', price: 1000, image: '🍟', category: 'Accompagnements' },
      ],
    },
    {
      name: 'Brasil Burger',
      email: 'contact@brasilburger.nooreat.com',
      phone: '338331101',
      address: 'Route de Ouakam, Dakar',
      image: '🍔',
      photo: photoUrl('burger', 212),
      rating: 4.6,
      category: 'Fast Food',
      description: 'Burgers gourmands façon brésilienne, une valeur sûre à Dakar.',
      minOrder: 1500,
      deliveryFee: 1000,
      deliveryTimeMinutes: '20-35 min',
      products: [
        { name: 'Brasil Cheese Burger', description: 'Steak haché, cheddar, sauce maison', price: 3200, image: '🍔', category: 'Burgers' },
        { name: 'Double Bacon Burger', description: 'Double steak, bacon, cheddar', price: 3800, image: '🍔', category: 'Burgers' },
        { name: 'Chicken Burger', description: 'Poulet pané croustillant', price: 2800, image: '🍔', category: 'Burgers' },
        { name: 'Milkshake', description: 'Vanille, chocolat ou fraise', price: 1500, image: '🥤', category: 'Boissons' },
      ],
    },
    {
      name: 'Yum-Yum Ouakam',
      email: 'contact@yumyum-ouakam.nooreat.com',
      phone: '338441102',
      address: 'Ouakam, Dakar',
      image: '🍕',
      photo: photoUrl('fastfoodpizza', 213),
      rating: 4.4,
      category: 'Fast Food',
      description: 'Pizzas, tacos et snacks livrés rapidement.',
      minOrder: 1500,
      deliveryFee: 1000,
      deliveryTimeMinutes: '20-35 min',
      products: [
        { name: 'Pizza 4 saisons', description: 'Jambon, champignons, olives, poivrons', price: 4000, image: '🍕', category: 'Pizzas' },
        { name: 'Tacos poulet', description: 'Tacos généreux au poulet, sauce fromagère', price: 2500, image: '🌮', category: 'Tacos' },
        { name: 'Panini', description: 'Panini jambon fromage grillé', price: 2000, image: '🥪', category: 'Sandwichs' },
        { name: 'Coupe glacée', description: 'Glace, chantilly, coulis', price: 1500, image: '🍨', category: 'Desserts' },
      ],
    },
    {
      name: 'Planet Kebab',
      email: 'contact@planetkebab.nooreat.com',
      phone: '338551103',
      address: 'Sacré-Cœur, Dakar',
      image: '🌯',
      photo: photoUrl('kebabgrill', 214),
      rating: 4.5,
      category: 'Fast Food',
      description: 'Kebabs savoureux et snacks variés, réputés à Dakar.',
      minOrder: 1000,
      deliveryFee: 1000,
      deliveryTimeMinutes: '15-30 min',
      products: [
        { name: 'Kebab classique', description: 'Viande grillée, crudités, sauce blanche', price: 2000, image: '🌯', category: 'Kebabs' },
        { name: 'Kebab galette', description: 'Galette garnie, viande, frites', price: 2200, image: '🌯', category: 'Kebabs' },
        { name: 'Assiette kebab', description: 'Viande, riz, salade', price: 3000, image: '🍽️', category: 'Assiettes' },
        { name: 'Tacos viande hachée', description: 'Tacos généreux, sauce fromagère', price: 2200, image: '🌮', category: 'Tacos' },
      ],
    },
    {
      name: 'La Brioche Dorée',
      email: 'contact@labriochedoree.nooreat.com',
      phone: '338661104',
      address: 'Plateau, Dakar',
      image: '🥐',
      photo: photoUrl('frenchbakery', 215),
      rating: 4.4,
      category: 'Fast Food',
      description: 'Chaîne locale fondée en 2002 : viennoiseries, sandwichs et snacks.',
      minOrder: 1000,
      deliveryFee: 800,
      deliveryTimeMinutes: '15-30 min',
      products: [
        { name: 'Croissant', description: 'Croissant pur beurre', price: 500, image: '🥐', category: 'Viennoiseries' },
        { name: 'Sandwich Shawarma', description: 'Shawarma poulet, crudités', price: 2000, image: '🌯', category: 'Sandwichs' },
        { name: 'Pain au chocolat', description: 'Viennoiserie pur beurre', price: 500, image: '🥐', category: 'Viennoiseries' },
        { name: 'Café + viennoiserie', description: 'Formule petit-déjeuner', price: 1200, image: '☕', category: 'Formules' },
      ],
    },
  ]

  for (const seedStore of [...restaurants, ...fastFoods]) {
    const createdStore = await prisma.store.upsert({
      where: { email: seedStore.email },
      update: { cuisine: seedStore.category, image: seedStore.photo },
      create: {
        name: seedStore.name,
        email: seedStore.email,
        password: hashedStorePassword,
        phone: seedStore.phone,
        address: seedStore.address,
        image: seedStore.photo,
        rating: seedStore.rating,
        status: 'Active',
        serviceArea: 'Dakar',
        segment: 'RESTAURANT',
        cuisine: seedStore.category,
        description: seedStore.description,
        minOrder: seedStore.minOrder,
        deliveryFee: seedStore.deliveryFee,
        deliveryTimeMinutes: seedStore.deliveryTimeMinutes,
      },
    })

    const existingCat = await prisma.category.findFirst({ where: { name: seedStore.category } })
    if (!existingCat) {
      await prisma.category.create({
        data: { name: seedStore.category, segment: 'Restaurant', status: 'Active' },
      })
    }

    for (const p of seedStore.products) {
      const existingProd = await prisma.product.findFirst({ where: { name: p.name, storeId: createdStore.id } })
      if (!existingProd) {
        await prisma.product.create({
          data: {
            name: p.name,
            description: p.description,
            price: p.price,
            image: p.image,
            status: 'Active',
            category: p.category,
            storeId: createdStore.id,
          },
        })
      }
    }
    console.log('✅ Restaurant seeded:', createdStore.name)
  }

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
