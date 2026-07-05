"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet, Plus, Loader2 } from "lucide-react"
import { getClientSession, clientFetch } from "@/lib/clientSession"

type Transaction = {
  id: string
  amount: number
  type: string
  description: string | null
  createdAt: string
}

export default function ClientWalletPage() {
  const router = useRouter()
  const [balance, setBalance] = useState<number | null>(null)
  const [history, setHistory] = useState<Transaction[]>([])
  const [amount, setAmount] = useState(2000)
  const [method, setMethod] = useState("Wave")
  const [loading, setLoading] = useState(false)

  function loadData() {
    clientFetch("/api/wallet/balance").then((r) => r.json()).then((d) => setBalance(d.balance))
    clientFetch("/api/wallet/history").then((r) => r.json()).then((d) => setHistory(Array.isArray(d) ? d : []))
  }

  useEffect(() => {
    if (!getClientSession()) {
      router.push("/client/login?from=/client/wallet")
      return
    }
    loadData()
  }, [router])

  async function handleTopup() {
    if (amount <= 0) return
    setLoading(true)
    try {
      await clientFetch("/api/wallet/topup", { method: "POST", body: JSON.stringify({ amount, method }) })
      loadData()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-extrabold mb-5">Portefeuille</h1>

      <div className="border border-neutral-200 rounded-2xl p-7 text-center mb-5">
        <Wallet size={26} className="text-[#06C167] mx-auto mb-2.5" />
        <div className="text-neutral-500 text-sm mb-1">Solde disponible</div>
        <div className="text-3xl font-black">
          {balance === null ? "…" : `${balance.toLocaleString("fr-FR")} FCFA`}
        </div>
      </div>

      <div className="border border-neutral-200 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-sm mb-3">Recharger</h2>
        <div className="flex gap-2 flex-wrap mb-4">
          {[1000, 2000, 5000, 10000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={`text-sm font-semibold px-3.5 py-2 rounded-full transition ${
                amount === v ? "bg-black text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {v.toLocaleString("fr-FR")}
            </button>
          ))}
        </div>
        <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">Mode de paiement</label>
        <div className="flex gap-2 flex-wrap mb-5">
          {["Wave", "Orange Money", "Cash"].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={`text-sm font-semibold px-3.5 py-2 rounded-full transition ${
                method === m ? "bg-black text-white" : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <button
          onClick={handleTopup}
          disabled={loading}
          className="w-full bg-black text-white rounded-full py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Recharger {amount.toLocaleString("fr-FR")} FCFA</>}
        </button>
      </div>

      <h2 className="font-bold text-sm mb-3">Historique</h2>
      <div className="space-y-2.5">
        {history.length === 0 && <p className="text-neutral-400 text-sm">Aucune transaction.</p>}
        {history.map((t) => (
          <div key={t.id} className="flex justify-between items-center border border-neutral-200 rounded-2xl p-4">
            <div>
              <div className="text-sm font-medium">{t.description || t.type}</div>
              <div className="text-neutral-400 text-xs">{new Date(t.createdAt).toLocaleString("fr-FR")}</div>
            </div>
            <div className={`font-bold ${t.type === "Credit" ? "text-[#06C167]" : "text-red-500"}`}>
              {t.type === "Credit" ? "+" : "-"}{t.amount.toLocaleString("fr-FR")} FCFA
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
