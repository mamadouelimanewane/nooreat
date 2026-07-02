import { Plus, Download, Info, Search, RefreshCw } from "lucide-react"
import { prisma } from "@/lib/prisma"
import DriversTable from "./DriversTable"
import Link from "next/link"

interface DriversPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    status?: string;
  }>;
}

export default async function DriversPage({ searchParams }: DriversPageProps) {
  const params = await searchParams
  const search = params.search || ""
  const statusFilter = params.status || ""
  const currentPage = parseInt(params.page || "1")
  const perPage = 10

  // Fetch real drivers from Prisma
  const where: any = {}
  if (statusFilter) where.status = statusFilter
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [drivers, totalCount] = await Promise.all([
    prisma.driver.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.driver.count({ where })
  ])

  const totalPages = Math.ceil(totalCount / perPage)

  const tabs = [
    { label: "Tous", count: totalCount, filter: "" },
    { label: "En ligne", count: drivers.filter(d => d.status === 'Online').length, filter: "Online" },
    { label: "Hors ligne", count: drivers.filter(d => d.status === 'Offline').length, filter: "Offline" },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span>🚗</span>
          <h1 className="text-lg font-semibold text-gray-700">Gestion des livreurs</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"><Download size={16} /></button>
          <button className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"><Plus size={16} /></button>
          <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"><Info size={16} /></button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <Link 
            key={tab.label} 
            href={`/drivers?status=${tab.filter}`}
            className={`bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity flex items-center gap-1.5 ${statusFilter === tab.filter ? "ring-2 ring-offset-1 ring-blue-500" : "opacity-70"}`}
          >
            {tab.label}
            <span className="bg-white/25 rounded-full px-1.5">{tab.count}</span>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <form className="flex items-center gap-2 flex-wrap">
          <input name="search" defaultValue={search} placeholder="Nom, email ou téléphone" 
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64" />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
          <Link href="/drivers" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><RefreshCw size={16} /></Link>
        </form>
      </div>

      <DriversTable 
        drivers={drivers} 
        totalCount={totalCount} 
        currentPage={currentPage}
        perPage={perPage}
        totalPages={totalPages}
      />
    </div>
  )
}
