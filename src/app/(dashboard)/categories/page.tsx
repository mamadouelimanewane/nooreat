import { Plus, Download, Info, Search, RefreshCw, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

interface CategoriesPageProps {
  searchParams: Promise<{
    name?: string;
  }>;
}

export default async function CategoriesPage({ searchParams }: CategoriesPageProps) {
  const params = await searchParams
  const nameQuery = params.name || ""

  const categories = await prisma.category.findMany({
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
          <h1 className="text-lg font-semibold text-gray-700">Catégories</h1>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"><Download size={16} /></button>
          <button className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"><Plus size={16} /></button>
          <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"><Info size={16} /></button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <form className="flex gap-3">
          <input
            name="name"
            defaultValue={nameQuery}
            placeholder="Nom de catégorie"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
          <Link href="/categories" className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><RefreshCw size={16} /></Link>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["N°", "Nom", "Statut", "Image", "Créé le", "Action"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {categories.length > 0 ? categories.map((cat, i) => (
              <tr key={cat.id} className="hover:bg-gray-50/80">
                <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                <td className="px-5 py-3 font-medium text-gray-800">{cat.name}</td>
                <td className="px-5 py-3"><StatusBadge status={cat.status} /></td>
                <td className="px-5 py-3 text-2xl">{cat.image || "📦"}</td>
                <td className="px-5 py-3 text-xs text-gray-500">{new Date(cat.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
                    <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400 italic">Aucune catégorie trouvée.</td></tr>
            )}
          </tbody>
        </table>
        <div className="p-3 text-xs text-gray-400 border-t">Affichage de {categories.length} entrées</div>
      </div>
    </div>
  )
}
