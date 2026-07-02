import { Plus, Download, Info, Search, RefreshCw, Settings } from "lucide-react"
import { prisma } from "@/lib/prisma"
import UsersTable from "./UsersTable"
import Link from "next/link"

interface UsersPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const params = await searchParams
  const search = params.search || ""
  const currentPage = parseInt(params.page || "1")
  const perPage = 10

  // Fetch real users from Prisma
  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / perPage)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span>👥</span>
          <h1 className="text-lg font-semibold text-gray-700">Gestion des utilisateurs</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"><Plus size={16} /></button>
          <button className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"><Download size={16} /></button>
          <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"><Info size={16} /></button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <form className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500 font-medium">Rechercher :</span>
          <input name="search" defaultValue={search} placeholder="Nom, email ou téléphone" 
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64" />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
          <Link href="/users" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><RefreshCw size={16} /></Link>
          <button type="button" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Settings size={16} /></button>
        </form>
      </div>

      <UsersTable 
        users={users} 
        totalCount={totalCount} 
        currentPage={currentPage}
        perPage={perPage}
        totalPages={totalPages}
      />
    </div>
  )
}
