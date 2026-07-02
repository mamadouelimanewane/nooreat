"use client"

import { Plus, Edit, Trash2, Eye } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockPages = [
  { id: 1, title: "À propos", slug: "about", type: "Page", updatedAt: "2026-01-15", status: "Active" },
  { id: 2, title: "Conditions d'utilisation", slug: "terms", type: "Page", updatedAt: "2026-01-15", status: "Active" },
  { id: 3, title: "Politique de confidentialité", slug: "privacy", type: "Page", updatedAt: "2026-01-15", status: "Active" },
  { id: 4, title: "Comment ça marche", slug: "how-it-works", type: "Page", updatedAt: "2026-02-01", status: "Active" },
]

export default function ContentPagesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>📋</span> Pages de contenu</h1>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Titre", "Slug", "Type", "Modifié le", "Statut", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockPages.map((p, i) => (
              <tr key={p.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{p.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">/{p.slug}</td>
                <td className="px-4 py-3 text-gray-600">{p.type}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{p.updatedAt}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
                  <button className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600"><Eye size={12} /></button>
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
