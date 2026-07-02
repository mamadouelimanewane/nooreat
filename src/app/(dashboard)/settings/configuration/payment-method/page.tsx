"use client"

import { useState } from "react"
import { Edit } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockMethods = [
  { id: 1, name: "Cash", code: "COD", icon: "💵", type: "Offline", status: "Active" },
  { id: 2, name: "Orange Money", code: "OM", icon: "🟠", type: "Mobile Money", status: "Active" },
  { id: 3, name: "Wave", code: "WAVE", icon: "🔵", type: "Mobile Money", status: "Active" },
  { id: 4, name: "Free Money", code: "FM", icon: "🟢", type: "Mobile Money", status: "Inactive" },
  { id: 5, name: "Stripe", code: "STRIPE", icon: "💳", type: "Card", status: "Inactive" },
]

export default function PaymentMethodPage() {
  const [methods] = useState(mockMethods)

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6">⚙️ Méthodes de paiement</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Méthode", "Code", "Type", "Statut", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {methods.map((m, i) => (
              <tr key={m.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{m.icon}</span>
                    <span className="font-semibold text-gray-800">{m.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600 bg-gray-50 rounded">{m.code}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-blue-100 text-blue-700">{m.type}</span>
                </td>
                <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                <td className="px-4 py-3">
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
