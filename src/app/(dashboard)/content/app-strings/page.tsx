"use client"

import { useState } from "react"
import { Search, Edit2, Save, X } from "lucide-react"

const mockStrings = [
  { key: "app.welcome", section: "Général", value: "Bienvenue sur NOOR EAT" },
  { key: "app.tagline", section: "Général", value: "Livraison rapide et fiable" },
  { key: "order.placed", section: "Commandes", value: "Votre commande a été passée avec succès" },
  { key: "order.confirmed", section: "Commandes", value: "Commande confirmée par le restaurant" },
  { key: "order.picked_up", section: "Commandes", value: "Livreur en route vers vous" },
  { key: "order.delivered", section: "Commandes", value: "Commande livrée !" },
  { key: "order.cancelled", section: "Commandes", value: "Commande annulée" },
  { key: "driver.online", section: "Livreur", value: "Vous êtes en ligne" },
  { key: "driver.offline", section: "Livreur", value: "Vous êtes hors ligne" },
  { key: "driver.new_order", section: "Livreur", value: "Nouvelle commande disponible" },
  { key: "payment.success", section: "Paiement", value: "Paiement effectué avec succès" },
  { key: "payment.failed", section: "Paiement", value: "Échec du paiement" },
]

export default function AppStringsPage() {
  const [search, setSearch] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [data, setData] = useState(mockStrings)

  const filtered = data.filter(s =>
    !search || s.key.includes(search.toLowerCase()) || s.value.toLowerCase().includes(search.toLowerCase())
  )

  const startEdit = (s: typeof mockStrings[0]) => {
    setEditId(s.key)
    setEditValue(s.value)
  }

  const saveEdit = (key: string) => {
    setData(prev => prev.map(s => s.key === key ? { ...s, value: editValue } : s))
    setEditId(null)
  }

  const sections = [...new Set(data.map(s => s.section))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          📱 Chaînes de l&apos;application
        </h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une clé ou valeur..."
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-72"
          />
          <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Search size={16} /></button>
        </div>
      </div>

      {sections.map(section => {
        const items = filtered.filter(s => s.section === section)
        if (!items.length) return null
        return (
          <div key={section} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <span className="font-semibold text-sm text-gray-700">{section}</span>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50/50">
                <tr>
                  {["Clé", "Valeur", "Action"].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map(s => (
                  <tr key={s.key} className="hover:bg-gray-50/80">
                    <td className="px-4 py-3 font-mono text-xs text-blue-600 w-64">{s.key}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {editId === s.key ? (
                        <input
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          className="border border-blue-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      ) : s.value}
                    </td>
                    <td className="px-4 py-3">
                      {editId === s.key ? (
                        <div className="flex gap-1">
                          <button onClick={() => saveEdit(s.key)} className="p-1 bg-green-500 text-white rounded hover:bg-green-600"><Save size={13} /></button>
                          <button onClick={() => setEditId(null)} className="p-1 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"><X size={13} /></button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(s)} className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit2 size={13} /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}
    </div>
  )
}
