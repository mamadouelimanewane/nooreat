"use client"

import { useEffect, useState } from "react"
import { Wallet, ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react"

type Transaction = {
  id: string
  type: string
  description: string | null
  amount: number
  status: string
  createdAt: string
}

export default function MerchantWalletPage() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/merchant/wallet")
      .then((r) => r.json())
      .then((data) => {
        setBalance(data.balance ?? 0)
        setTransactions(data.transactions ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 size={28} className="text-cyan-500 animate-spin" />
      </div>
    )
  }

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
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800">Transactions récentes</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {transactions.length === 0 && (
            <div className="p-8 text-center text-gray-400 text-sm italic">Aucune transaction pour le moment.</div>
          )}
          {transactions.map((tx) => {
            const isCredit = tx.type.toLowerCase() === "credit"
            return (
              <div key={tx.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/40 transition-colors">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isCredit ? "bg-green-100" : "bg-red-100"}`}>
                  {isCredit ? <ArrowDownLeft size={18} className="text-green-600" /> : <ArrowUpRight size={18} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{tx.description ?? tx.type}</div>
                  <div className="text-xs text-gray-400">{new Date(tx.createdAt).toLocaleString("fr-FR")}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`font-bold text-sm ${isCredit ? "text-green-600" : "text-red-500"}`}>
                    {isCredit ? "+" : "-"}{tx.amount.toLocaleString("fr-FR")} FCFA
                  </div>
                  <div className="text-xs text-gray-400">{tx.status}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
