"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockPlans = [
  { id: 1, name: "Basic", price: 0, duration: "Free", features: ["Accès plateforme", "Support email"], status: "Active" },
  { id: 2, name: "Premium", price: 9900, duration: "Mensuel", features: ["Priorité commandes", "Support prioritaire", "Stats avancées"], status: "Active" },
  { id: 3, name: "Business", price: 49900, duration: "Mensuel", features: ["Tout Premium", "API access", "Manager dédié"], status: "Active" },
]

export default function MembershipPage() {
  const [plans] = useState(mockPlans)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700">⚙️ Plans d'abonnement</h1>
        <button className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg">
          <Plus size={14} /> Nouveau plan
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{plan.name}</h3>
                <p className="text-xs text-gray-500">{plan.duration}</p>
              </div>
              <StatusBadge status={plan.status} />
            </div>
            <div className="text-2xl font-bold text-green-600 mb-4">
              {plan.price === 0 ? "Gratuit" : `${plan.price.toLocaleString()} FCFA`}
            </div>
            <ul className="space-y-1 mb-4">
              {plan.features.map(f => (
                <li key={f} className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span className="text-green-500">✓</span> {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
              <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 size={12} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Plan", "Prix", "Durée", "Statut", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {plans.map((p, i) => (
              <tr key={p.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-semibold text-gray-800">{p.name}</td>
                <td className="px-4 py-3 text-green-600 font-medium">{p.price === 0 ? "Gratuit" : `${p.price.toLocaleString()} FCFA`}</td>
                <td className="px-4 py-3 text-gray-600">{p.duration}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"><Edit size={12} /></button>
                  <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600"><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
