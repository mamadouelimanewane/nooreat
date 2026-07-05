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
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>Portefeuille</h1>

      <div className="ne-card" style={{ marginBottom: "20px", textAlign: "center", padding: "28px" }}>
        <Wallet size={28} style={{ color: "var(--ne-accent)", margin: "0 auto 10px" }} />
        <div style={{ fontSize: "13px", color: "var(--ne-text-secondary)", marginBottom: "4px" }}>Solde disponible</div>
        <div style={{ fontSize: "32px", fontWeight: 900 }}>
          {balance === null ? "…" : `${balance.toLocaleString("fr-FR")} FCFA`}
        </div>
      </div>

      <div className="ne-card" style={{ marginBottom: "24px" }}>
        <div className="ne-section-header"><span className="ne-section-title">Recharger</span></div>
        <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
          {[1000, 2000, 5000, 10000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              className={amount === v ? "ne-btn-primary" : "ne-btn-ghost"}
              style={{ fontSize: "13px", padding: "8px 14px" }}
            >
              {v.toLocaleString("fr-FR")}
            </button>
          ))}
        </div>
        <label className="ne-label">Mode de paiement</label>
        <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
          {["Wave", "Orange Money", "Cash"].map((m) => (
            <button
              key={m}
              onClick={() => setMethod(m)}
              className={method === m ? "ne-btn-primary" : "ne-btn-ghost"}
              style={{ fontSize: "13px", padding: "8px 14px" }}
            >
              {m}
            </button>
          ))}
        </div>
        <button onClick={handleTopup} disabled={loading} className="ne-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Recharger {amount.toLocaleString("fr-FR")} FCFA</>}
        </button>
      </div>

      <div className="ne-section-header"><span className="ne-section-title">Historique</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {history.length === 0 && <p style={{ color: "var(--ne-text-muted)", fontSize: "13px" }}>Aucune transaction.</p>}
        {history.map((t) => (
          <div key={t.id} className="ne-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 500 }}>{t.description || t.type}</div>
              <div style={{ color: "var(--ne-text-muted)", fontSize: "12px" }}>{new Date(t.createdAt).toLocaleString("fr-FR")}</div>
            </div>
            <div style={{ fontWeight: 700, color: t.type === "Credit" ? "var(--ne-accent)" : "var(--ne-danger)" }}>
              {t.type === "Credit" ? "+" : "-"}{t.amount.toLocaleString("fr-FR")} FCFA
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
