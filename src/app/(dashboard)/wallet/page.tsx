"use client"

import { useState } from "react"
import { Search, RefreshCw } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockWallet = [
  { id: 1, user: "Fatou Diallo", phone: "+221776543210", type: "Utilisateur", amount: 500, method: "Cash", desc: "Recharge manuelle", date: "2026-03-14 10:00", status: "Completed" },
  { id: 2, user: "Mamadou Lamine Diallo", phone: "+221770000001", type: "Livreur", amount: 5000, method: "Orange Money", desc: "Bonus performance", date: "2026-03-13 15:30", status: "Completed" },
  { id: 3, user: "Moussa Sarr", phone: "+221743210987", type: "Utilisateur", amount: 1000, method: "Wave", desc: "Remboursement", date: "2026-03-12 09:00", status: "Pending" },
]

export default function WalletPage() {
  const [search, setSearch] = useState("")
  const filtered = mockWallet.filter(w => !search || w.user.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>💰</span> Recharge portefeuille</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex gap-3 items-center">
          <input placeholder="Nom d'utilisateur..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64" />
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
          <button onClick={() => setSearch("")} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><RefreshCw size={16} /></button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Utilisateur", "Type", "Montant (FCFA)", "Méthode", "Description", "Date", "Statut"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((w, i) => (
              <tr key={w.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{w.user}</div>
                  <div className="text-xs text-gray-500">{w.phone}</div>
                </td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${w.type === "Livreur" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>{w.type}</span></td>
                <td className="px-4 py-3 font-semibold text-green-600">+{w.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-600">{w.method}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{w.desc}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{w.date}</td>
                <td className="px-4 py-3"><StatusBadge status={w.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
