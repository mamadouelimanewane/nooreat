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
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <ShoppingBag size={40} className="text-neutral-300 mx-auto mb-4" />
        <p className="text-neutral-500">Votre panier est vide.</p>
        <button onClick={() => router.push("/client")} className="mt-4 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-neutral-800 transition">
          Voir les restaurants
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h1 className="text-xl font-extrabold mb-5">Finaliser la commande</h1>

      <div className="border border-neutral-200 rounded-2xl p-5 mb-4">
        <h2 className="font-bold text-sm mb-3">{cart.storeName}</h2>
        <div className="space-y-2">
          {cart.items.map((i) => (
            <div key={i.productId} className="flex justify-between text-sm">
              <span>{i.quantity}× {i.name}</span>
              <span className="font-medium">{(i.price * i.quantity).toLocaleString("fr-FR")} FCFA</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-bold mt-3 pt-3 border-t border-neutral-100">
          <span>Total</span>
          <span>{cartTotal(cart).toLocaleString("fr-FR")} FCFA</span>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-2xl p-5 mb-4">
        <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-2">Adresse de livraison</label>
        <div className="relative">
          <MapPin size={16} className="absolute left-3 top-3.5 text-neutral-400" />
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Quartier, rue, repère..."
            className="w-full bg-neutral-50 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10 min-h-20 resize-y"
          />
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleOrder}
        disabled={loading}
        className="w-full bg-black text-white rounded-full py-4 font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition disabled:opacity-50"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : "Confirmer la commande"}
      </button>
    </div>
  )
}
