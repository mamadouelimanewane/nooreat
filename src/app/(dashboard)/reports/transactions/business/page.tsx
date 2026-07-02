"use client"

import { useState } from "react"
import { Download, Search, RefreshCw } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockData = [
  { id: "TX-B001", store: "Supermarché Auchan Dakar", owner: "Jean-Pierre Morel", type: "Crédit", amount: 45000, method: "Virement", desc: "Paiement ventes semaine 10", balance: 120000, date: "2026-03-14 08:00", status: "Completed" },
  { id: "TX-B002", store: "Pharmacie Centrale", owner: "Aminata Dieng", type: "Débit", amount: 3200, method: "Frais plateforme", desc: "Commission plateforme 8%", balance: 85000, date: "2026-03-13 10:30", status: "Completed" },
  { id: "TX-B003", store: "Restaurant Le Teranga", owner: "Moussa Ba", type: "Crédit", amount: 28000, method: "Virement", desc: "Paiement ventes semaine 10", balance: 62000, date: "2026-03-12 09:00", status: "Pending" },
  { id: "TX-B004", store: "Boulangerie Saveur", owner: "Rokhaya Sarr", type: "Débit", amount: 1800, method: "Frais plateforme", desc: "Commission plateforme 8%", balance: 31000, date: "2026-03-10 14:00", status: "Completed" },
]

export default function BusinessWalletTransactionsPage() {
  const [search, setSearch] = useState("")
  const filtered = mockData.filter(t => !search || t.store.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          🏪 Transactions portefeuille — Commerces
        </h1>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg">
          <Download size={14} /> Exporter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un commerce..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64"
          />
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
          <button onClick={() => setSearch("")} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"><RefreshCw size={16} /></button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["N°", "ID Transaction", "Commerce", "Propriétaire", "Type", "Montant (FCFA)", "Méthode", "Description", "Solde après", "Date", "Statut"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((t, i) => (
              <tr key={t.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 text-blue-600 font-mono text-xs">{t.id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{t.store}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{t.owner}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${t.type === "Crédit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.type}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-gray-800">{t.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{t.method}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{t.desc}</td>
                <td className="px-4 py-3 text-cyan-600 font-medium">{t.balance.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
