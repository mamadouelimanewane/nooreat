"use client"

import { use, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Minus, ShoppingCart } from "lucide-react"
import { getCart, setItemQuantity, cartTotal, type Cart } from "@/lib/clientCart"
import { CART_EVENT } from "../../layout"

type Product = { id: string; name: string; price: number; description: string | null; image: string; category: string | null }
type Store = { id: string; name: string; location: string | null; rating: number; deliveryTime: string; minOrder: number; emoji: string }

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: storeId } = use(params)
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Cart | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/stores").then((r) => r.json()),
      fetch(`/api/stores/${storeId}/products`).then((r) => r.json()),
    ]).then(([stores, prods]) => {
      setStore(Array.isArray(stores) ? stores.find((s: Store) => s.id === storeId) ?? null : null)
      setProducts(Array.isArray(prods) ? prods : [])
    }).finally(() => setLoading(false))
    setCart(getCart())
  }, [storeId])

  const cartForThisStore = cart && cart.storeId === storeId ? cart : null
  const quantities = useMemo(() => {
    const map = new Map<string, number>()
    cartForThisStore?.items.forEach((i) => map.set(i.productId, i.quantity))
    return map
  }, [cartForThisStore])

  function updateQty(product: Product, qty: number) {
    if (!store) return
    const updated = setItemQuantity(storeId, store.name, { id: product.id, name: product.name, price: product.price }, qty)
    setCart(updated)
    window.dispatchEvent(new Event(CART_EVENT))
  }

  const categories = [...new Set(products.map((p) => p.category || "Autres"))]

  if (loading) {
    return <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px" }}>
      <div className="ne-skeleton" style={{ height: "80px", marginBottom: "20px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
        {[...Array(4)].map((_, i) => <div key={i} className="ne-skeleton" style={{ height: "100px" }} />)}
      </div>
    </div>
  }

  if (!store) {
    return <div style={{ textAlign: "center", padding: "60px" }}>Restaurant introuvable.</div>
  }

  return (
    <div className="ne-store-layout" style={{ maxWidth: "1100px", margin: "0 auto", padding: "28px 24px" }}>
      <div>
        <div className="ne-card" style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "44px" }}>{store.emoji}</div>
          <div>
            <h1 style={{ fontSize: "20px" }}>{store.name}</h1>
            <p style={{ color: "var(--ne-text-secondary)", fontSize: "13px" }}>
              {store.location} · ★ {store.rating.toFixed(1)} · {store.deliveryTime}
            </p>
          </div>
        </div>

        {categories.map((cat) => (
          <div key={cat} style={{ marginBottom: "24px" }}>
            <div className="ne-section-header">
              <span className="ne-section-dot" />
              <span className="ne-section-title">{cat}</span>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {products.filter((p) => (p.category || "Autres") === cat).map((p) => {
                const qty = quantities.get(p.id) ?? 0
                return (
                  <div key={p.id} className="ne-card" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ fontSize: "28px" }}>{p.image}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "14.5px" }}>{p.name}</div>
                      {p.description && <div style={{ color: "var(--ne-text-muted)", fontSize: "12.5px" }}>{p.description}</div>}
                      <div style={{ color: "var(--ne-accent)", fontWeight: 700, fontSize: "13.5px", marginTop: "4px" }}>
                        {p.price.toLocaleString("fr-FR")} FCFA
                      </div>
                    </div>
                    {qty === 0 ? (
                      <button onClick={() => updateQty(p, 1)} className="ne-btn-primary" style={{ padding: "8px 14px", fontSize: "13px" }}>
                        Ajouter
                      </button>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <button onClick={() => updateQty(p, qty - 1)} className="ne-header-btn"><Minus size={14} /></button>
                        <span style={{ fontWeight: 700, minWidth: "18px", textAlign: "center" }}>{qty}</span>
                        <button onClick={() => updateQty(p, qty + 1)} className="ne-header-btn"><Plus size={14} /></button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky cart summary */}
      <div style={{ position: "sticky", top: "80px", height: "fit-content" }}>
        <div className="ne-card">
          <div className="ne-section-header">
            <ShoppingCart size={16} style={{ color: "var(--ne-accent)" }} />
            <span className="ne-section-title">Votre panier</span>
          </div>
          {!cartForThisStore || cartForThisStore.items.length === 0 ? (
            <p style={{ color: "var(--ne-text-muted)", fontSize: "13px" }}>Panier vide.</p>
          ) : (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {cartForThisStore.items.map((i) => (
                  <div key={i.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span>{i.quantity}× {i.name}</span>
                    <span>{(i.price * i.quantity).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: "16px", borderTop: "1px solid var(--ne-border)", paddingTop: "12px" }}>
                <span>Total</span>
                <span style={{ color: "var(--ne-accent)" }}>{cartTotal(cartForThisStore).toLocaleString("fr-FR")} FCFA</span>
              </div>
              <button onClick={() => router.push("/client/cart")} className="ne-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Commander
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
