"use client"

import { Download } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockTx = [
  { id: "TX-001", user: "Fatou Diallo", type: "Crédit", amount: 500, method: "Cash", desc: "Recharge manuelle", balance: 500, date: "2026-03-14 10:00", status: "Completed" },
  { id: "TX-002", user: "Fatou Diallo", type: "Débit", amount: 200, method: "App", desc: "Paiement commande #3240", balance: 300, date: "2026-03-14 11:30", status: "Completed" },
  { id: "TX-003", user: "Moussa Sarr", type: "Crédit", amount: 1000, method: "Wave", desc: "Remboursement", balance: 1000, date: "2026-03-12 09:00", status: "Pending" },
  { id: "TX-004", user: "Mamadou Lamine Diallo", type: "Crédit", amount: 5000, method: "Orange Money", desc: "Bonus livreur", balance: 8200, date: "2026-03-10 14:00", status: "Completed" },
]

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">💳 Toutes les transactions</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Download size={14} /> Exporter</button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "ID Transaction", "Utilisateur", "Type", "Montant (FCFA)", "Méthode", "Description", "Solde après", "Date", "Statut"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockTx.map((t, i) => (
              <tr key={t.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 text-blue-600 font-mono text-xs">{t.id}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{t.user}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${t.type === "Crédit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.type}</span></td>
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
