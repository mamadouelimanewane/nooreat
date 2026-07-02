import { Plus, Info, Search, RefreshCw } from "lucide-react"
import { prisma } from "@/lib/prisma"
import StoresTable from "./StoresTable"
import Link from "next/link"

interface StoresPageProps {
  searchParams: Promise<{
    name?: string;
  }>;
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const params = await searchParams
  const nameQuery = params.name || ""

  // Fetch real stores from Prisma
  const stores = await prisma.store.findMany({
    where: {
      name: { contains: nameQuery, mode: 'insensitive' }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span>📋</span>
          <h1 className="text-lg font-semibold text-gray-700">Liste des magasins</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/stores/new">
            <button className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"><Plus size={16} /></button>
          </Link>
          <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"><Info size={16} /></button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <form className="flex flex-wrap gap-3 items-end">
          <input name="name" defaultValue={nameQuery} placeholder="Nom du magasin"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64" />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
          <Link href="/stores" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><RefreshCw size={16} /></Link>
        </form>
      </div>

      <StoresTable stores={stores} />
    </div>
  )
}
