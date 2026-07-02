import { Download, Info, Search, RefreshCw, Eye } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

const statusColors: Record<string, string> = {
  All: "bg-gray-500", Pending: "bg-yellow-500", Processing: "bg-blue-500", Completed: "bg-green-500", Cancelled: "bg-red-500",
}

interface OrdersPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    store?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams
  const search = params.search || ""
  const statusFilter = params.status || ""
  const selectedStore = params.store || ""
  const currentPage = parseInt(params.page || "1")
  const perPage = 10

  // Fetch real data from Prisma
  const where: any = {}
  if (statusFilter) where.status = statusFilter
  if (selectedStore) where.storeId = selectedStore
  if (search) {
    where.OR = [
      { orderId: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [orders, totalCount, stores] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        store: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (currentPage - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
    prisma.store.findMany({ select: { id: true, name: true } })
  ])

  const totalPages = Math.ceil(totalCount / perPage)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span>🛒</span>
          <h1 className="text-lg font-semibold text-gray-700">Commandes</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center" title="Exporter CSV"><Download size={16} /></button>
          <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center" title="Aide"><Info size={16} /></button>
        </div>
      </div>

      {/* Filters (Simplified for Server Side) */}
      <form className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500 block mb-1">N° commande / Recherche</label>
          <input name="search" defaultValue={search} placeholder="Rechercher..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-52" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Magasin</label>
          <select name="store" defaultValue={selectedStore}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-48 text-gray-500 focus:outline-none">
            <option value="">-- Tous les magasins --</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="flex gap-2 items-end">
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" title="Rechercher"><Search size={16} /></button>
          <Link href="/orders" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600" title="Réinitialiser"><RefreshCw size={16} /></Link>
        </div>
      </form>

      {/* Status Badges */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Link href="/orders" className={`px-3 py-1.5 text-xs font-semibold rounded-full text-white ${!statusFilter ? "ring-2 ring-offset-1 ring-current bg-gray-600" : "bg-gray-400"}`}>Tous</Link>
        {["Pending", "Processing", "Completed", "Cancelled"].map((s) => (
          <Link 
            key={s} 
            href={`/orders?status=${s}`}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full text-white transition-opacity hover:opacity-90 ${statusColors[s]} ${statusFilter === s ? "ring-2 ring-offset-1 ring-current" : ""}`}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["N°", "ID Commande", "Magasin", "Total (FCFA)", "Paiement", "Adresse", "Statut", "Date"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length > 0 ? orders.map((order, i) => (
              <tr key={order.id} className="hover:bg-gray-50/80">
                <td className="px-5 py-3 text-gray-500">{(currentPage - 1) * perPage + i + 1}</td>
                <td className="px-5 py-3 text-blue-600 font-semibold">#{order.orderId}</td>
                <td className="px-5 py-3 text-gray-700">{order.store.name}</td>
                <td className="px-5 py-3 font-semibold text-gray-800">{order.total.toLocaleString()}</td>
                <td className="px-5 py-3 text-xs text-gray-600">Cash / Mobile</td>
                <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{order.address || "N/A"}</td>
                <td className="px-5 py-3"><StatusBadge status={order.status} /></td>
                <td className="px-5 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className="p-10 text-center text-gray-400 italic">Aucune commande trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t flex items-center justify-between text-xs text-gray-500">
            <span>Page {currentPage} sur {totalPages} ({totalCount} commandes)</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <Link 
                  key={p} 
                  href={`/orders?page=${p}${statusFilter ? `&status=${statusFilter}` : ""}`}
                  className={`px-2.5 py-1 rounded border ${currentPage === p ? "bg-blue-500 text-white border-blue-500" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
