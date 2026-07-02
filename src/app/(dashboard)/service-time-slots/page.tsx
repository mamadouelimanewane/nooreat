"use client"

import { Plus, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockSlots = [
  { id: 1, name: "Matin", from: "08:00", to: "12:00", zone: "Dakar", status: "Active" },
  { id: 2, name: "Midi", from: "12:00", to: "14:00", zone: "Dakar", status: "Active" },
  { id: 3, name: "Après-midi", from: "14:00", to: "18:00", zone: "Dakar", status: "Active" },
  { id: 4, name: "Soir", from: "18:00", to: "22:00", zone: "Toutes", status: "Active" },
]

export default function ServiceTimeSlotsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>🕐</span> Créneaux horaires</h1>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Nom", "Début", "Fin", "Zone", "Statut", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockSlots.map((s, i) => (
              <tr key={s.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                <td className="px-4 py-3 text-gray-600">{s.from}</td>
                <td className="px-4 py-3 text-gray-600">{s.to}</td>
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
