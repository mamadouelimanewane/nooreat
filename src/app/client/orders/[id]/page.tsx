"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Phone, Car, Star, KeyRound } from "lucide-react"
import { getClientSession, clientFetch } from "@/lib/clientSession"

type OrderDetail = {
  id: string
  orderId: string
  total: number
  status: string
  address: string | null
  deliveryPin: string | null
  createdAt: string
  storeName: string
  items: { productId: string; name: string; quantity: number; price: number }[]
  driver: { name: string; phone: string | null; vehicle: string | null; rating: number } | null
}

const STEPS = [
  { key: "Pending", label: "Confirmée" },
  { key: "Processing", label: "En préparation / en livraison" },
  { key: "Completed", label: "Livrée" },
]

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!getClientSession()) {
      router.push(`/client/login?from=/client/orders/${id}`)
      return
    }
    clientFetch(`/api/orders/${id}`)
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          setError(data.message || "Commande introuvable")
          return
        }
        setOrder(data)
      })
  }, [id, router])

  if (error) return <div style={{ textAlign: "center", padding: "60px" }}>{error}</div>
  if (!order) return <div style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 24px" }}><div className="ne-skeleton" style={{ height: "200px" }} /></div>

  const stepIndex = order.status === "Cancelled" ? -1 : STEPS.findIndex((s) => s.key === order.status)

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ fontSize: "20px", marginBottom: "4px" }}>{order.storeName}</h1>
      <p style={{ color: "var(--ne-text-muted)", fontSize: "13px", marginBottom: "20px" }}>
        #{order.orderId} · {new Date(order.createdAt).toLocaleString("fr-FR")}
      </p>

      {order.status === "Cancelled" ? (
        <div className="ne-badge ne-badge-danger" style={{ marginBottom: "20px" }}>Commande annulée</div>
      ) : (
        <div className="ne-card" style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {STEPS.map((s, i) => (
              <div key={s.key} style={{ flex: 1, textAlign: "center", opacity: i <= stepIndex ? 1 : 0.35 }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%", margin: "0 auto 6px",
                  background: i <= stepIndex ? "var(--ne-accent)" : "var(--ne-bg-input)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700,
                  color: i <= stepIndex ? "#000" : "var(--ne-text-muted)",
                }}>{i + 1}</div>
                <div style={{ fontSize: "11px", color: "var(--ne-text-secondary)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.deliveryPin && order.status !== "Completed" && order.status !== "Cancelled" && (
        <div className="ne-card ne-card-accent" style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <KeyRound size={18} style={{ color: "var(--ne-accent)" }} />
          <span style={{ fontSize: "13.5px" }}>Code de remise au livreur : <strong>{order.deliveryPin}</strong></span>
        </div>
      )}

      {order.driver && (
        <div className="ne-card" style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="ne-avatar">{order.driver.name.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "14px" }}>{order.driver.name}</div>
            <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "var(--ne-text-secondary)" }}>
              {order.driver.vehicle && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Car size={12} />{order.driver.vehicle}</span>}
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Star size={12} />{order.driver.rating.toFixed(1)}</span>
            </div>
          </div>
          {order.driver.phone && (
            <a href={`tel:${order.driver.phone}`} className="ne-header-btn"><Phone size={16} /></a>
          )}
        </div>
      )}

      <div className="ne-card" style={{ marginBottom: "16px" }}>
        <div className="ne-section-header"><span className="ne-section-title">Articles</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {order.items.map((i) => (
            <div key={i.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
              <span>{i.quantity}× {i.name}</span>
              <span>{(i.price * i.quantity).toLocaleString("fr-FR")} FCFA</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: "12px", borderTop: "1px solid var(--ne-border)", paddingTop: "12px" }}>
          <span>Total</span>
          <span style={{ color: "var(--ne-accent)" }}>{order.total.toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>

      {order.address && (
        <p style={{ color: "var(--ne-text-muted)", fontSize: "12.5px" }}>Livraison : {order.address}</p>
      )}
    </div>
  )
}
