"use client"

import { useState } from "react"
import { Plus, Info, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockCodes = [
  { id: 1, code: "NOOR EAT10", discount: 10, type: "Percentage", maxUses: 100, usedCount: 23, expiresAt: "2026-06-30", status: "Active" },
  { id: 2, code: "WELCOME500", discount: 500, type: "Fixed", maxUses: 50, usedCount: 50, expiresAt: "2026-03-31", status: "Inactive" },
  { id: 3, code: "LIVRAISON", discount: 100, type: "Fixed", maxUses: null, usedCount: 12, expiresAt: null, status: "Active" },
]

export default function PromoCodePage() {
  const [codes, setCodes] = useState(mockCodes)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span>🏷️</span>
          <h1 className="text-lg font-semibold text-gray-700">Codes promo</h1>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter un code</button>
          <button className="w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"><Info size={16} /></button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["N°", "Code", "Remise", "Type", "Utilisations max.", "Utilisé", "Expiration", "Statut", "Action"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {codes.map((c, i) => (
              <tr key={c.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-mono font-bold text-gray-800 bg-gray-50 rounded">{c.code}</td>
                <td className="px-4 py-3 font-semibold text-green-600">{c.discount}{c.type === "Percentage" ? "%" : " FCFA"}</td>
                <td className="px-4 py-3 text-gray-600">{c.type}</td>
                <td className="px-4 py-3 text-gray-600">{c.maxUses ?? "∞"}</td>
                <td className="px-4 py-3 text-gray-600">{c.usedCount}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{c.expiresAt ?? "Sans expiration"}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
                  <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 text-xs text-gray-400 border-t">Affichage de {codes.length} entrées</div>
      </div>
    </div>
  )
}
