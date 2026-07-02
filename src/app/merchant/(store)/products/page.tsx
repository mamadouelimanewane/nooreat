"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Search, Edit, Trash2, Eye, EyeOff, ChevronDown, ChevronRight, Loader2 } from "lucide-react"

const categories = [
  {
    id: 1,
    name: "Plats principaux",
    products: [
      { id: 1, name: "Riz au poisson", price: 3500, description: "Riz cuit avec poisson frais et légumes", available: true, orders: 48, image: "🍚" },
      { id: 2, name: "Thiébou dieun", price: 2500, description: "Plat traditionnel sénégalais au riz et poisson", available: true, orders: 29, image: "🐟" },
      { id: 3, name: "Yassa poulet", price: 3500, description: "Poulet mariné au citron avec oignons caramélisés", available: true, orders: 35, image: "🍗" },
      { id: 4, name: "Mafé bœuf", price: 3000, description: "Ragoût de bœuf à la sauce d'arachide", available: false, orders: 22, image: "🥩" },
    ]
  },
  {
    id: 2,
    name: "Boissons",
    products: [
      { id: 5, name: "Jus bissap", price: 1500, description: "Jus de fleur d'hibiscus naturel", available: true, orders: 65, image: "🥤" },
      { id: 6, name: "Jus gingembre", price: 1500, description: "Jus de gingembre frais épicé", available: true, orders: 41, image: "🧃" },
      { id: 7, name: "Eau minérale", price: 500, description: "Bouteille 75cl", available: true, orders: 120, image: "💧" },
    ]
  },
  {
    id: 3,
    name: "Entrées",
    products: [
      { id: 8, name: "Salade de tomates", price: 1000, description: "Salade fraîche avec tomates et oignons", available: true, orders: 15, image: "🥗" },
      { id: 9, name: "Soup kandja", price: 2000, description: "Soupe gombos traditionnelle", available: true, orders: 18, image: "🍲" },
    ]
  },
]

function ProductsContent() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get("store") ?? "1"
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<number[]>([1, 2, 3])
  const [editModal, setEditModal] = useState<number | null>(null)

  const toggleCategory = (id: number) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const allProducts = categories.flatMap(c => c.products)
  const filteredCategories = categories.map(cat => ({
    ...cat,
    products: cat.products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
  })).filter(cat => cat.products.length > 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Catalogue produits</h1>
          <p className="text-sm text-gray-500">{allProducts.length} produits · {categories.length} catégories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
          <Plus size={16} />
          Nouveau produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xl font-bold text-gray-800">{allProducts.length}</div>
          <div className="text-xs text-gray-500">Total produits</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xl font-bold text-green-600">{allProducts.filter(p => p.available).length}</div>
          <div className="text-xs text-gray-500">Disponibles</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <div className="text-xl font-bold text-red-500">{allProducts.filter(p => !p.available).length}</div>
          <div className="text-xs text-gray-500">Indisponibles</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher produit..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
          <Plus size={14} />
          Catégorie
        </button>
      </div>

      {/* Categories & Products */}
      <div className="space-y-3">
        {filteredCategories.map(cat => (
          <div key={cat.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {expanded.includes(cat.id)
                  ? <ChevronDown size={18} className="text-gray-400" />
                  : <ChevronRight size={18} className="text-gray-400" />}
                <span className="font-semibold text-gray-800">{cat.name}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{cat.products.length}</span>
              </div>
              <button
                onClick={e => { e.stopPropagation() }}
                className="flex items-center gap-1 text-xs text-cyan-500 hover:underline"
              >
                <Plus size={13} /> Ajouter
              </button>
            </button>

            {/* Products */}
            {expanded.includes(cat.id) && (
              <div className="border-t border-gray-50 divide-y divide-gray-50">
                {cat.products.map(product => (
                  <div key={product.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/40 transition-colors">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {product.image}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800 text-sm">{product.name}</span>
                        {!product.available && (
                          <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Indisponible</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 truncate">{product.description}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{product.orders} commandes</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-gray-800 text-sm">{product.price.toLocaleString("fr-FR")} FCFA</div>
                      <div className="flex items-center gap-1 mt-1 justify-end">
                        <button
                          className={`p-1.5 rounded-lg transition-colors ${product.available ? "text-green-500 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                          title={product.available ? "Désactiver" : "Activer"}
                        >
                          {product.available ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={15} />
                        </button>
                        <button className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MerchantProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 size={28} className="text-cyan-500 animate-spin" /></div>}>
      <ProductsContent />
    </Suspense>
  )
}
