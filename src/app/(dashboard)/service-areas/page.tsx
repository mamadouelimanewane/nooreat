import { Plus, Edit, Trash2, MapPin } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"
import { prisma } from "@/lib/prisma"

export default async function ServiceAreasPage() {
  const areas = await prisma.serviceArea.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <MapPin size={18} className="text-blue-600" /> Zones de service
        </h1>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg">
          <Plus size={14} /> Ajouter une zone
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["N°", "Zone", "Pays", "Statut", "Créé le", "Action"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {areas.length > 0 ? areas.map((a, i) => (
              <tr key={a.id} className="hover:bg-gray-50/80">
                <td className="px-5 py-3 text-gray-500">{i + 1}</td>
                <td className="px-5 py-3 font-medium text-gray-800">{a.name}</td>
                <td className="px-5 py-3 text-gray-600">{a.country}</td>
                <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-5 py-3 text-xs text-gray-500">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3">
                    <div className="flex gap-1">
                      <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
                      <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 size={12} /></button>
                    </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400 italic">Aucune zone de service trouvée.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
