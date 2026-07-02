"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockServiceTypes = [
  { id: 1, name: "Grocery Delivery", code: "GROCERY", icon: "🛒", description: "Livraison de courses alimentaires", status: "Active" },
  { id: 2, name: "Food Delivery", code: "FOOD", icon: "🍕", description: "Livraison de repas de restaurants", status: "Inactive" },
  { id: 3, name: "Parcel Delivery", code: "PARCEL", icon: "📦", description: "Livraison de colis et documents", status: "Inactive" },
]

export default function ServiceTypePage() {
  const [types] = useState(mockServiceTypes)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700">⚙️ Types de service</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg">
          <Plus size={14} /> Ajouter un type
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Service", "Code", "Description", "Statut", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {types.map((t, i) => (
              <tr key={t.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.icon}</span>
                    <span className="font-semibold text-gray-800">{t.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{t.code}</code></td>
                <td className="px-4 py-3 text-gray-600 text-xs">{t.description}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
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
