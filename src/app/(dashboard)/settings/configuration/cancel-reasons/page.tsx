"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockReasons = [
  { id: 1, reason: "Livreur introuvable", type: "User", status: "Active" },
  { id: 2, reason: "Délai d'attente trop long", type: "User", status: "Active" },
  { id: 3, reason: "Commande passée par erreur", type: "User", status: "Active" },
  { id: 4, reason: "Produit non disponible", type: "Driver", status: "Active" },
  { id: 5, reason: "Zone de livraison inaccessible", type: "Driver", status: "Active" },
  { id: 6, reason: "Client injoignable", type: "Driver", status: "Active" },
  { id: 7, reason: "Autre raison", type: "Both", status: "Active" },
]

export default function CancelReasonsPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ reason: "", type: "User" })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700">⚙️ Motifs d'annulation</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg">
          <Plus size={14} /> Ajouter un motif
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 max-w-lg">
          <h2 className="font-semibold text-gray-700 mb-4">Nouveau motif d'annulation</h2>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Motif *</label>
              <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Applicable à</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                <option>User</option>
                <option>Driver</option>
                <option>Both</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Annuler</button>
            <button className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">Enregistrer</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Motif", "Type", "Statut", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockReasons.map((r, i) => (
              <tr key={r.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{r.reason}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${r.type === "User" ? "bg-blue-100 text-blue-700" : r.type === "Driver" ? "bg-orange-100 text-orange-700" : "bg-purple-100 text-purple-700"}`}>
                    {r.type}
                  </span>
                </td>
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
