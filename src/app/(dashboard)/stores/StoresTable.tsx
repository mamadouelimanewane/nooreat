"use client"

import { useState } from "react"
import { Edit, ExternalLink } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://NOOR EAT.vercel.app"

function generateToken(storeId: string, email: string): string {
  if (typeof window === "undefined") return ""
  return btoa(`store:${storeId}:${email}:NOOR EAT2024`).replace(/=/g, "")
}

function getLoginUrl(store: any): string {
  const token = generateToken(store.id, store.email)
  return `${BASE_URL}/merchant/login?store=${store.id}&token=${token}`
}

export default function StoresTable({ stores }: { stores: any[] }) {
  const [urlModal, setUrlModal] = useState<{ open: boolean; store: any | null }>({ open: false, store: null })
  const [copied, setCopied] = useState(false)

  const openUrlModal = (store: any) => {
    setUrlModal({ open: true, store })
    setCopied(false)
  }

  const copyUrl = async () => {
    if (!urlModal.store) return
    await navigator.clipboard.writeText(getLoginUrl(urlModal.store))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const loginUrl = urlModal.store ? getLoginUrl(urlModal.store) : ""

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {["", "N°", "Coordonnées", "Cuisine", "Adresse", "Connexion", "Note", "Solde", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {stores.map((store, i) => (
            <tr key={store.id} className="hover:bg-gray-50/80 transition-colors">
              <td className="px-4 py-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center text-lg">
                  {store.image && store.image.startsWith("http") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>🏪</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-500">{i + 1}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-800">{store.name}</div>
                <div className="text-gray-500 text-xs">{store.phone}</div>
                <div className="text-gray-400 text-xs">{store.email}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs text-gray-500">{store.cuisine || "—"}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-xs text-gray-500">{store.address || "—"}</div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                    <button onClick={() => openUrlModal(store)} className="px-2 py-1 bg-cyan-500 text-white text-xs rounded hover:bg-cyan-600">Lien</button>
                    <a href={getLoginUrl(store)} target="_blank" className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200">Test</a>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="text-gray-700">{store.rating}</span>
                </div>
              </td>
              <td className="px-4 py-3 font-medium">{store.walletMoney.toLocaleString()} F</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <StatusBadge status={store.status} />
                  <button className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit size={14} /></button>
                  <a href={`${BASE_URL}/client/store/${store.id}`} target="_blank" className="p-1 text-green-500 hover:bg-green-50 rounded" title="Voir la vitrine client">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {urlModal.open && urlModal.store && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6">
            <h2 className="font-bold mb-2">URL Marchand - {urlModal.store.name}</h2>
            <div className="p-3 bg-gray-50 rounded border mb-4 text-xs font-mono break-all">{loginUrl}</div>
            <div className="flex gap-2">
                <button onClick={copyUrl} className="flex-1 bg-cyan-500 text-white py-2 rounded font-medium">{copied ? "Copié !" : "Copier"}</button>
                <button onClick={() => setUrlModal({ open: false, store: null })} className="px-4 py-2 border rounded">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
