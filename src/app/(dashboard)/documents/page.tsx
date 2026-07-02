"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockDocs = [
  { id: 1, name: "Pièce d'identité", required: true, expiry: true, status: "Active", createdAt: "2025-01-01" },
  { id: 2, name: "Permis de conduire", required: true, expiry: true, status: "Active", createdAt: "2025-01-01" },
  { id: 3, name: "Carte grise", required: true, expiry: true, status: "Active", createdAt: "2025-01-01" },
  { id: 4, name: "Assurance véhicule", required: false, expiry: true, status: "Active", createdAt: "2025-02-01" },
  { id: 5, name: "Photo de profil", required: true, expiry: false, status: "Active", createdAt: "2025-01-01" },
]

export default function DocumentsPage() {
  const [docs] = useState(mockDocs)
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>📄</span> Types de documents</h1>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Nom du document", "Obligatoire", "Expiration", "Statut", "Créé le", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {docs.map((d, i) => (
              <tr key={d.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{d.name}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${d.required ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{d.required ? "Oui" : "Non"}</span></td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${d.expiry ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"}`}>{d.expiry ? "Oui" : "Non"}</span></td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 text-xs text-gray-500">{d.createdAt}</td>
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
