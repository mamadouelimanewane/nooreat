import { Plus, Edit, Trash2, GripVertical } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"
import { prisma } from "@/lib/prisma"

export default async function SliderPage() {
  const sliders = await prisma.sliderBanner.findMany({
    orderBy: { sequence: 'asc' }
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🖼️</span>
          <h1 className="text-lg font-semibold text-gray-700">Bannières (Accueil)</h1>
        </div>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow-sm">
          <Plus size={14} /> Ajouter une bannière
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {sliders.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="h-40 bg-gray-50 flex items-center justify-center relative border-b border-gray-100">
              {s.image.startsWith('/') || s.image.startsWith('http') ? (
                <img src={s.image} alt={s.title || ""} className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">{s.image}</span>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{s.title || "Sans titre"}</h3>
                  <p className="text-xs text-gray-400 mt-1">Séquence : {s.sequence}</p>
                  {s.link && <p className="text-xs text-blue-500 mt-0.5 max-w-[200px] truncate">Lien : {s.link}</p>}
                </div>
                <StatusBadge status={s.status} />
              </div>
              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center gap-2">
                <button className="p-1.5 bg-blue-500/10 text-blue-600 rounded hover:bg-blue-500/20"><Edit size={14} /></button>
                <button className="p-1.5 bg-red-500/10 text-red-600 rounded hover:bg-red-500/20"><Trash2 size={14} /></button>
                <div className="ml-auto text-gray-400 cursor-grab hover:text-gray-600"><GripVertical size={16} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Séquence", "Titre", "Image / Emoji", "Lien", "Statut", "Généré le", "Action"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sliders.length > 0 ? sliders.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-600">{s.sequence}</td>
                <td className="px-4 py-3 text-gray-800">{s.title || "—"}</td>
                <td className="px-4 py-3">
                  {s.image.startsWith('/') || s.image.startsWith('http') ? (
                    <img src={s.image} alt={s.title || ""} className="w-16 h-8 object-cover rounded shadow-sm" />
                  ) : (
                    <span className="text-xl">{s.image}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-blue-500 max-w-[150px] truncate">{s.link || "—"}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3 text-xs text-gray-500">{new Date(s.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
                    <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">Aucune bannière trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
