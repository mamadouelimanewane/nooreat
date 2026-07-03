"use client"

import { useEffect, useState } from "react"
import { Plus, Search, Trash2, Eye, EyeOff, Loader2, X } from "lucide-react"

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  status: string
}

export default function MerchantProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const res = await fetch("/api/merchant/products")
      const data = await res.json()
      setProducts(res.ok ? data.products : [])
    } finally {
      setLoading(false)
    }
  }

  async function createProduct(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.price) return
    setSaving(true)
    try {
      const res = await fetch("/api/merchant/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description || undefined,
          price: Number(form.price),
          category: form.category || undefined,
        }),
      })
      if (res.ok) {
        setForm({ name: "", description: "", price: "", category: "" })
        setShowForm(false)
        loadProducts()
      }
    } finally {
      setSaving(false)
    }
  }

  async function toggleAvailability(product: Product) {
    const status = product.status === "Active" ? "Inactive" : "Active"
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, status } : p)))
    await fetch(`/api/merchant/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
  }

  async function deleteProduct(id: string) {
    if (!confirm("Supprimer ce produit ?")) return
    setProducts((prev) => prev.filter((p) => p.id !== id))
    await fetch(`/api/merchant/products/${id}`, { method: "DELETE" })
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
  const categories = [...new Set(products.map((p) => p.category ?? "Sans catégorie"))]

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 size={28} className="text-cyan-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Catalogue produits</h1>
          <p className="text-sm text-gray-500">{products.length} produits · {categories.length} catégories</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={16} />
          Nouveau produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xl font-bold text-gray-800">{products.length}</div>
          <div className="text-xs text-gray-500">Total produits</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xl font-bold text-green-600">{products.filter((p) => p.status === "Active").length}</div>
          <div className="text-xs text-gray-500">Disponibles</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xl font-bold text-red-500">{products.filter((p) => p.status !== "Active").length}</div>
          <div className="text-xs text-gray-500">Indisponibles</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher produit..."
          className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
        />
      </div>

      {/* New product form */}
      {showForm && (
        <form onSubmit={createProduct} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-800">Nouveau produit</h2>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Nom du produit"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
            <input
              required
              type="number"
              placeholder="Prix (FCFA)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>
          <input
            placeholder="Catégorie"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors"
          >
            {saving ? "Enregistrement..." : "Ajouter"}
          </button>
        </form>
      )}

      {/* Products list */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        {filtered.map((product) => (
          <div key={product.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/40 transition-colors">
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">🍽️</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-800 text-sm">{product.name}</span>
                {product.status !== "Active" && (
                  <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Indisponible</span>
                )}
              </div>
              <div className="text-xs text-gray-400 truncate">{product.description}</div>
              {product.category && <div className="text-xs text-gray-400 mt-0.5">{product.category}</div>}
            </div>
            <div className="text-right flex-shrink-0">
              <div className="font-bold text-gray-800 text-sm">{product.price.toLocaleString("fr-FR")} FCFA</div>
              <div className="flex items-center gap-1 mt-1 justify-end">
                <button
                  onClick={() => toggleAvailability(product)}
                  className={`p-1.5 rounded-lg transition-colors ${product.status === "Active" ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                  title={product.status === "Active" ? "Désactiver" : "Activer"}
                >
                  {product.status === "Active" ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
                <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm italic">Aucun produit pour le moment.</div>
        )}
      </div>
    </div>
  )
}
