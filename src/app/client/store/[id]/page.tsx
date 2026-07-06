"use client"

import { use, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Plus, Minus, Star, Clock, Bike, ShoppingBag } from "lucide-react"
import { getCart, setItemQuantity, cartTotal, cartCount, type Cart } from "@/lib/clientCart"
import { CART_EVENT } from "../../layout"

type Product = { id: string; name: string; price: number; description: string | null; image: string; photo: string | null; category: string | null }
type Store = {
  id: string; name: string; location: string | null; rating: number; deliveryTime: string
  minOrder: number; emoji: string; photo: string | null; cuisine: string; description: string | null; deliveryFee: number
}

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: storeId } = use(params)
  const router = useRouter()
  const [store, setStore] = useState<Store | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<Cart | null>(null)
  const [photoBroken, setPhotoBroken] = useState(false)
  const [brokenProductPhotos, setBrokenProductPhotos] = useState<Set<string>>(new Set())

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
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="h-44 rounded-2xl bg-neutral-100 animate-pulse mb-6" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-neutral-100 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!store) {
    return <div className="text-center py-16 text-neutral-500">Restaurant introuvable.</div>
  }

  const count = cartCount(cartForThisStore)

  return (
    <div className="pb-28">
      {/* Hero banner */}
      <div className="relative bg-gradient-to-br from-neutral-100 to-neutral-50 h-40 sm:h-52 flex items-center justify-center overflow-hidden">
        {store.photo && !photoBroken ? (
          <Image
            src={store.photo}
            alt={store.name}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            quality={60}
            priority
            onError={() => setPhotoBroken(true)}
            className="object-cover"
          />
        ) : (
          <span className="text-7xl sm:text-8xl">{store.emoji}</span>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Info card */}
        <div className="bg-[#fff] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.08)] -mt-8 relative p-5 mb-6">
          <h1 className="text-xl font-extrabold mb-1">{store.emoji} {store.name}</h1>
          {store.description && <p className="text-neutral-500 text-sm mb-3">{store.description}</p>}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-700">
            <span className="flex items-center gap-1 font-semibold"><Star size={14} className="fill-black" /> {store.rating.toFixed(1)}</span>
            <span className="flex items-center gap-1"><Clock size={14} /> {store.deliveryTime}</span>
            <span className="flex items-center gap-1"><Bike size={14} /> {store.deliveryFee.toLocaleString("fr-FR")} FCFA</span>
            <span className="text-neutral-400">{store.cuisine}</span>
          </div>
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 sticky top-16 bg-[#fff] z-10 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
            {categories.map((cat) => (
              <a
                key={cat}
                href={`#cat-${cat}`}
                className="shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition"
              >
                {cat}
              </a>
            ))}
          </div>
        )}

        {categories.map((cat) => (
          <div key={cat} id={`cat-${cat}`} className="mb-8 scroll-mt-32">
            <h2 className="font-bold text-lg mb-3">{cat}</h2>
            <div className="divide-y divide-neutral-100">
              {products.filter((p) => (p.category || "Autres") === cat).map((p) => {
                const qty = quantities.get(p.id) ?? 0
                return (
                  <div key={p.id} className="flex items-center gap-4 py-4">
                    <div className="relative w-16 h-16 rounded-xl bg-neutral-50 flex items-center justify-center text-3xl shrink-0 overflow-hidden">
                      {p.photo && !brokenProductPhotos.has(p.id) ? (
                        <Image
                          src={p.photo}
                          alt={p.name}
                          fill
                          sizes="64px"
                          quality={55}
                          onError={() => setBrokenProductPhotos((prev) => new Set(prev).add(p.id))}
                          className="object-cover"
                        />
                      ) : (
                        p.image
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-[15px] truncate">{p.name}</div>
                      {p.description && <div className="text-neutral-500 text-[13px] truncate">{p.description}</div>}
                      <div className="font-bold text-[14px] mt-1">{p.price.toLocaleString("fr-FR")} FCFA</div>
                    </div>
                    {qty === 0 ? (
                      <button
                        onClick={() => updateQty(p, 1)}
                        className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-700 hover:border-black hover:text-black active:scale-95 transition shrink-0"
                      >
                        <Plus size={16} />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 shrink-0">
                        <button onClick={() => updateQty(p, qty - 1)} className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 active:scale-95 transition">
                          <Minus size={14} />
                        </button>
                        <span className="font-bold w-6 text-center">{qty}</span>
                        <button onClick={() => updateQty(p, qty + 1)} className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-neutral-800 active:scale-95 transition">
                          <Plus size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Floating cart bar */}
      {cartForThisStore && count > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent">
          <button
            onClick={() => router.push("/client/cart")}
            className="max-w-3xl mx-auto w-full bg-black text-white rounded-full py-4 px-6 flex items-center justify-between font-semibold shadow-lg hover:bg-neutral-800 transition"
          >
            <span className="flex items-center gap-2">
              <ShoppingBag size={18} />
              Voir le panier · {count} article{count > 1 ? "s" : ""}
            </span>
            <span>{cartTotal(cartForThisStore).toLocaleString("fr-FR")} FCFA</span>
          </button>
        </div>
      )}
    </div>
  )
}
