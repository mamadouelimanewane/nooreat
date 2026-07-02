"use client"

import { useState } from "react"
import { Eye, Check, X, Search } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockExpiring = [
  { id: 1, driver: "Mamadou Lamine Diallo", phone: "+221770000001", doc: "Permis de conduire", expiresAt: "2026-04-01", daysLeft: 17, status: "Active" },
  { id: 2, driver: "Ibrahima Sarr", phone: "+221776543210", doc: "Assurance véhicule", expiresAt: "2026-03-20", daysLeft: 5, status: "Active" },
  { id: 3, driver: "Bassirou Diao", phone: "+221764082948", doc: "Pièce d'identité", expiresAt: "2026-03-18", daysLeft: 3, status: "Expiring" },
]

export default function DriversDocumentsPage() {
  const [search, setSearch] = useState("")
  const filtered = mockExpiring.filter(d => !search || d.driver.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>⚠️</span> Documents expirant bientôt</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex gap-3 items-center">
          <input placeholder="Nom du livreur..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64" />
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Livreur", "Document", "Date d'expiration", "Jours restants", "Statut", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((d, i) => (
              <tr key={d.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{d.driver}</div>
                  <div className="text-xs text-gray-500">{d.phone}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{d.doc}</td>
                <td className="px-4 py-3 text-gray-600">{d.expiresAt}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${d.daysLeft <= 5 ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
                    {d.daysLeft} jours
                  </span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600" title="Voir"><Eye size={12} /></button>
                  <button className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600" title="Approuver"><Check size={12} /></button>
                  <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600" title="Rejeter"><X size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
