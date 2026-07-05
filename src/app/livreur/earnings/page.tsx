"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingUp, Wallet, Package } from "lucide-react"
import { getDriverSession, driverFetch } from "@/lib/driverSession"

type Earnings = {
  todayEarnings: number
  todayOrders: number
  weekSeries: { label: string; earnings: number; orders: number }[]
  totalOrders: number
  rating: number
  walletBalance: number
}

export default function LivreurEarningsPage() {
  const router = useRouter()
  const [data, setData] = useState<Earnings | null>(null)

  useEffect(() => {
    if (!getDriverSession()) {
      router.push("/livreur/login")
      return
    }
    driverFetch("/api/driver/earnings").then((r) => r.json()).then(setData)
  }, [router])

  if (!data) return <div className="ne-skeleton" style={{ height: "200px", maxWidth: "800px", margin: "0 auto" }} />

  const maxEarnings = Math.max(...data.weekSeries.map((d) => d.earnings), 1)

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>Mes gains</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        <div className="ne-stat-card">
          <div className="ne-stat-icon green"><TrendingUp size={20} /></div>
          <div><div className="ne-stat-label">Gains aujourd&apos;hui</div><div className="ne-stat-value">{data.todayEarnings.toLocaleString("fr-FR")} FCFA</div></div>
        </div>
        <div className="ne-stat-card">
          <div className="ne-stat-icon blue"><Package size={20} /></div>
          <div><div className="ne-stat-label">Livraisons aujourd&apos;hui</div><div className="ne-stat-value">{data.todayOrders}</div></div>
        </div>
        <div className="ne-stat-card">
          <div className="ne-stat-icon purple"><Wallet size={20} /></div>
          <div><div className="ne-stat-label">Solde portefeuille</div><div className="ne-stat-value">{data.walletBalance.toLocaleString("fr-FR")} FCFA</div></div>
        </div>
      </div>

      <div className="ne-card">
        <div className="ne-section-header"><span className="ne-section-title">7 derniers jours</span></div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "10px", height: "160px", padding: "0 4px" }}>
          {data.weekSeries.length === 0 && <p style={{ color: "var(--ne-text-muted)", fontSize: "13px" }}>Pas encore de données.</p>}
          {data.weekSeries.map((d) => (
            <div key={d.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "var(--ne-text-secondary)" }}>{d.earnings.toLocaleString("fr-FR")}</span>
              <div style={{
                width: "100%", maxWidth: "36px",
                height: `${Math.max((d.earnings / maxEarnings) * 110, 4)}px`,
                background: "var(--ne-accent)", borderRadius: "6px 6px 0 0",
              }} />
              <span style={{ fontSize: "11px", color: "var(--ne-text-muted)", textTransform: "capitalize" }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
