"use client"

import { useState } from "react"
import { Download, Eye, Search, RefreshCw } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockInvoices = [
  { id: "INV-3253", order: "#3253", store: "Marché Keur Massar", user: "Fatou Diallo", amount: 12500, date: "2026-03-15 10:30:00", status: "Paid" },
  { id: "INV-3252", order: "#3252", store: "Marché Rufisque", user: "Oumar Ba", amount: 8750, date: "2026-03-15 09:45:00", status: "Pending" },
  { id: "INV-3251", order: "#3251", store: "France Mangasin test", user: "Aissatou Ndiaye", amount: 5200, date: "2026-03-15 09:00:00", status: "Paid" },
  { id: "INV-3250", order: "#3250", store: "Marché Keur Massar", user: "Moussa Sarr", amount: 22000, date: "2026-03-14 18:15:00", status: "Paid" },
  { id: "INV-3249", order: "#3249", store: "Marché Rufisque", user: "Cheikh Diop", amount: 3100, date: "2026-03-14 15:00:00", status: "Refunded" },
]

export default function InvoicesPage() {
  const [search, setSearch] = useState("")
  const filtered = mockInvoices.filter(inv =>
    !search || inv.id.toLowerCase().includes(search.toLowerCase()) || inv.user.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>🧾</span> Factures commandes</h1>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Download size={14} /> Exporter</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
        <div className="flex gap-3 items-center">
          <input placeholder="N° facture / Client..." value={search} onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-64" />
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
          <button onClick={() => setSearch("")} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"><RefreshCw size={16} /></button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "N° Facture", "Commande", "Magasin", "Client", "Montant (FCFA)", "Date", "Statut", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((inv, i) => (
              <tr key={inv.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 text-blue-600 font-semibold">{inv.id}</td>
                <td className="px-4 py-3 text-gray-700">{inv.order}</td>
                <td className="px-4 py-3 text-gray-700">{inv.store}</td>
                <td className="px-4 py-3 text-gray-700">{inv.user}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{inv.date}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600" title="Voir"><Eye size={12} /></button>
                  <button className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600" title="Télécharger PDF"><Download size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 text-xs text-gray-400 border-t">Affichage de {filtered.length} sur {mockInvoices.length} entrées</div>
      </div>
    </div>
  )
}
