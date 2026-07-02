"use client"

import { Eye, Check, X } from "lucide-react"

const mockPending = [
  { id: 1845, name: "Ibou Diallo", phone: "+221771234567", email: "iboudiallo@gmail.com", area: "Dakar", vehicle: "Moto", appliedAt: "2026-03-14 10:00:00", docs: 3 },
  { id: 1844, name: "Cheikh Sow", phone: "+221761234567", email: "cheikhsow@gmail.com", area: "Pikine", vehicle: "Moto", appliedAt: "2026-03-13 15:30:00", docs: 2 },
  { id: 1843, name: "Moustapha Ndiaye", phone: "+221751234567", email: "moustaphand@gmail.com", area: "Rufisque", vehicle: "Moto", appliedAt: "2026-03-12 09:00:00", docs: 3 },
]

export default function PendingDriversPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
        🕐 Livreurs en attente d'approbation
        <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded-full">{mockPending.length}</span>
      </h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "ID", "Livreur", "Zone", "Véhicule", "Documents", "Date demande", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockPending.map((d, i) => (
              <tr key={d.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 text-blue-600 font-semibold">{d.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{d.name}</div>
                  <div className="text-gray-500 text-xs">{d.phone}</div>
                  <div className="text-gray-400 text-xs">{d.email}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{d.area}</td>
                <td className="px-4 py-3 text-gray-600">{d.vehicle}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${d.docs >= 3 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {d.docs}/3 docs
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{d.appliedAt}</td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600" title="Voir profil"><Eye size={12} /></button>
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600" title="Approuver"><Check size={12} /></button>
                  <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600" title="Rejeter"><X size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
