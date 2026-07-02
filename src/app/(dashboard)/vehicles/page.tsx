"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockVehicles = [
  { id: 1, name: "Moto", icon: "🏍️", capacity: 1, status: "Active", createdAt: "2025-01-01" },
  { id: 2, name: "Voiture", icon: "🚗", capacity: 4, status: "Active", createdAt: "2025-01-01" },
  { id: 3, name: "Vélo", icon: "🚲", capacity: 1, status: "Active", createdAt: "2025-01-01" },
  { id: 4, name: "Camionnette", icon: "🚐", capacity: 8, status: "Inactive", createdAt: "2025-03-01" },
]

export default function VehiclesPage() {
  const [vehicles] = useState(mockVehicles)
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>🚗</span> Types de véhicules</h1>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Icône", "Nom", "Capacité", "Statut", "Créé le", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vehicles.map((v, i) => (
              <tr key={v.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 text-2xl">{v.icon}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{v.name}</td>
                <td className="px-4 py-3 text-gray-600">{v.capacity}</td>
                <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                <td className="px-4 py-3 text-xs text-gray-500">{v.createdAt}</td>
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
