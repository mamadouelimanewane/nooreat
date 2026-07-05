"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Loader2, ShoppingBag } from "lucide-react"
import { getCart, clearCart, cartTotal, type Cart } from "@/lib/clientCart"
import { getClientSession, clientFetch } from "@/lib/clientSession"
import { CART_EVENT } from "../layout"

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<Cart | null>(null)
  const [address, setAddress] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCart(getCart())
  }, [])

  async function handleOrder() {
    if (!cart) return
    const session = getClientSession()
    if (!session) {
      router.push("/client/login?from=/client/cart")
      return
    }
    if (!address.trim()) {
      setError("Merci d'indiquer une adresse de livraison.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await clientFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          storeId: cart.storeId,
          total: cartTotal(cart),
          address,
          items: cart.items,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Impossible de passer la commande")
        return
      }
      clearCart()
      window.dispatchEvent(new Event(CART_EVENT))
      router.push(`/client/orders/${data.id}`)
    } finally {
      setLoading(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ maxWidth: "500px", margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <ShoppingBag size={40} style={{ color: "var(--ne-text-muted)", margin: "0 auto 16px" }} />
        <p style={{ color: "var(--ne-text-secondary)" }}>Votre panier est vide.</p>
        <button onClick={() => router.push("/client")} className="ne-btn-primary" style={{ marginTop: "16px" }}>
          Voir les restaurants
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "28px 24px" }}>
      <h1 style={{ fontSize: "22px", marginBottom: "20px" }}>Finaliser la commande</h1>

      <div className="ne-card" style={{ marginBottom: "16px" }}>
        <div className="ne-section-header">
          <span className="ne-section-title">{cart.storeName}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {cart.items.map((i) => (
            <div key={i.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
              <span>{i.quantity}× {i.name}</span>
              <span>{(i.price * i.quantity).toLocaleString("fr-FR")} FCFA</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginTop: "12px", borderTop: "1px solid var(--ne-border)", paddingTop: "12px" }}>
          <span>Total</span>
          <span style={{ color: "var(--ne-accent)" }}>{cartTotal(cart).toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>

      <div className="ne-card" style={{ marginBottom: "16px" }}>
        <label className="ne-label">Adresse de livraison</label>
        <div style={{ position: "relative" }}>
          <MapPin size={15} style={{ position: "absolute", left: "12px", top: "14px", color: "var(--ne-text-muted)" }} />
          <textarea
            className="ne-input"
            style={{ paddingLeft: "36px", minHeight: "80px", resize: "vertical" }}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Quartier, rue, repère..."
          />
        </div>
      </div>

      {error && (
        <div style={{
          marginBottom: "16px", padding: "10px 14px", background: "rgba(240,62,62,0.12)",
          border: "1px solid rgba(240,62,62,0.3)", borderRadius: "10px", color: "#f03e3e", fontSize: "13px",
        }}>{error}</div>
      )}

      <button onClick={handleOrder} disabled={loading} className="ne-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Confirmer la commande"}
      </button>
    </div>
  )
}
