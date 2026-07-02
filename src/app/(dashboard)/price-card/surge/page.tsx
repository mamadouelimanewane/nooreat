"use client"

import { Plus, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockSurge = [
  { id: 1, name: "Heure de pointe matin", timeFrom: "07:00", timeTo: "09:00", multiplier: 1.5, zone: "Dakar", status: "Active" },
  { id: 2, name: "Heure de pointe soir", timeFrom: "17:00", timeTo: "20:00", multiplier: 1.8, zone: "Dakar", status: "Active" },
  { id: 3, name: "Nuit", timeFrom: "22:00", timeTo: "05:00", multiplier: 2.0, zone: "Toutes", status: "Inactive" },
]

export default function SurgePricingPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>📈</span> Tarif dynamique (Surge)</h1>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Nom", "De", "À", "Multiplicateur", "Zone", "Statut", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockSurge.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                <td className="px-4 py-3 text-gray-600">{s.timeFrom}</td>
                <td className="px-4 py-3 text-gray-600">{s.timeTo}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">×{s.multiplier}</span></td>
                <td className="px-4 py-3 text-gray-600">{s.zone}</td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
                  <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
