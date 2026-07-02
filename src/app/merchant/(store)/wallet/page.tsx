"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Wallet, TrendingUp, ArrowDownLeft, ArrowUpRight, Loader2, Download } from "lucide-react"

const transactions = [
  { id: "TXN001", type: "credit", label: "Commande #1040 — Moussa Ba", amount: 12000, date: "16/03/2026 13:55", balance: 93544 },
  { id: "TXN002", type: "credit", label: "Commande #1039 — Aïssatou Fall", amount: 6500, date: "16/03/2026 13:20", balance: 81544 },
  { id: "TXN003", type: "debit", label: "Retrait — Orange Money", amount: 50000, date: "15/03/2026 18:00", balance: 75044 },
  { id: "TXN004", type: "credit", label: "Commande #1035 — Seydou Diop", amount: 8500, date: "15/03/2026 12:30", balance: 125044 },
  { id: "TXN005", type: "credit", label: "Commande #1034 — Marième Ndiaye", amount: 4500, date: "15/03/2026 11:00", balance: 116544 },
  { id: "TXN006", type: "debit", label: "Commission plateforme (5%)", amount: 2500, date: "14/03/2026 23:59", balance: 112044 },
  { id: "TXN007", type: "credit", label: "Commande #1030 — Aliou Cissé", amount: 15000, date: "14/03/2026 19:45", balance: 114544 },
]

function WalletContent() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get("store") ?? "1"

  const balance = 93544
  const monthRevenue = 1245000
  const monthWithdraw = 800000

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Portefeuille</h1>
        <p className="text-sm text-gray-500">Gestion de vos finances et retraits</p>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-cyan-100 text-sm font-medium">Solde disponible</p>
            <p className="text-4xl font-bold mt-1">{balance.toLocaleString("fr-FR")} <span className="text-2xl font-normal text-cyan-200">FCFA</span></p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Wallet size={24} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button className="flex-1 py-2.5 bg-white text-cyan-600 rounded-xl text-sm font-bold hover:bg-cyan-50 transition-colors">
            Retirer les fonds
          </button>
          <button className="flex-1 py-2.5 bg-white/20 text-white border border-white/30 rounded-xl text-sm font-bold hover:bg-white/30 transition-colors">
            Historique
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={16} className="text-green-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">Ce mois-ci</span>
          </div>
          <div className="text-xl font-bold text-gray-800">{monthRevenue.toLocaleString("fr-FR")} FCFA</div>
          <div className="text-xs text-green-600 mt-0.5">+18% vs mois dernier</div>
          <div className="text-xs text-gray-400 mt-0.5">Recettes totales</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight size={16} className="text-purple-600" />
            </div>
            <span className="text-xs text-gray-500 font-medium">Retraits</span>
          </div>
          <div className="text-xl font-bold text-gray-800">{monthWithdraw.toLocaleString("fr-FR")} FCFA</div>
          <div className="text-xs text-gray-400 mt-0.5">3 retraits effectués</div>
          <div className="text-xs text-gray-400 mt-0.5">Ce mois-ci</div>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Transactions récentes</h2>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors">
            <Download size={13} /> Exporter
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/40 transition-colors">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                tx.type === "credit" ? "bg-green-100" : "bg-red-100"
              }`}>
                {tx.type === "credit"
                  ? <ArrowDownLeft size={18} className="text-green-600" />
                  : <ArrowUpRight size={18} className="text-red-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{tx.label}</div>
                <div className="text-xs text-gray-400">{tx.date}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`font-bold text-sm ${tx.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                  {tx.type === "credit" ? "+" : "-"}{tx.amount.toLocaleString("fr-FR")} FCFA
                </div>
                <div className="text-xs text-gray-400">Solde: {tx.balance.toLocaleString("fr-FR")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function MerchantWalletPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 size={28} className="text-cyan-500 animate-spin" /></div>}>
      <WalletContent />
    </Suspense>
  )
}
