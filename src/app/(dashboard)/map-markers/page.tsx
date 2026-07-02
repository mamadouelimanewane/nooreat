"use client"

import { Plus, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockMarkers = [
  { id: 1, name: "Marqueur utilisateur", type: "User", color: "#4CAF50", status: "Active" },
  { id: 2, name: "Marqueur livreur", type: "Driver", color: "#2196F3", status: "Active" },
  { id: 3, name: "Marqueur magasin", type: "Store", color: "#FF9800", status: "Active" },
  { id: 4, name: "Marqueur destination", type: "Destination", color: "#F44336", status: "Active" },
]

export default function MapMarkersPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>📍</span> Marqueurs carte</h1>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Nom", "Type", "Couleur", "Statut", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockMarkers.map((m, i) => (
              <tr key={m.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{m.name}</td>
                <td className="px-4 py-3 text-gray-600">{m.type}</td>
                <td className="px-4 py-3"><div className="w-6 h-6 rounded-full border border-gray-200" style={{ backgroundColor: m.color }} /></td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
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
