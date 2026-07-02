"use client"

import { Plus, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockRules = [
  { id: 1, name: "Tarif standard Dakar", zone: "Dakar", basePrice: 500, pricePerKm: 200, minFare: 500, maxFare: 5000, status: "Active" },
  { id: 2, name: "Tarif standard Rufisque", zone: "Rufisque", basePrice: 600, pricePerKm: 250, minFare: 600, maxFare: 6000, status: "Active" },
  { id: 3, name: "Tarif nuit", zone: "Toutes", basePrice: 800, pricePerKm: 300, minFare: 800, maxFare: 8000, status: "Inactive" },
]

export default function FareRulesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>💳</span> Règles tarifaires</h1>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Nom", "Zone", "Prix de base (FCFA)", "Prix/km (FCFA)", "Min (FCFA)", "Max (FCFA)", "Statut", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockRules.map((r, i) => (
              <tr key={r.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{r.name}</td>
                <td className="px-4 py-3 text-gray-600">{r.zone}</td>
                <td className="px-4 py-3 text-gray-700">{r.basePrice.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-700">{r.pricePerKm.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-700">{r.minFare.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-700">{r.maxFare.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
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
