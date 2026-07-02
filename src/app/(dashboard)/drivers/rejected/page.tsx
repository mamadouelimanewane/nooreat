"use client"

import { Eye, RefreshCw } from "lucide-react"

const mockRejected = [
  { id: 1820, name: "Samba Gueye", phone: "+221771111111", email: "sambagueye@gmail.com", area: "Dakar", reason: "Documents invalides", rejectedAt: "2026-03-10 14:00:00" },
  { id: 1815, name: "Alioune Badara Seck", phone: "+221762222222", email: "abseck@gmail.com", area: "Dakar", reason: "Photo non conforme", rejectedAt: "2026-03-08 11:30:00" },
]

export default function RejectedDriversPage() {
  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6 flex items-center gap-2">
        ❌ Livreurs rejetés
        <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded-full">{mockRejected.length}</span>
      </h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "ID", "Livreur", "Zone", "Motif du rejet", "Date rejet", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockRejected.map((d, i) => (
              <tr key={d.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 text-blue-600 font-semibold">{d.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{d.name}</div>
                  <div className="text-gray-500 text-xs">{d.phone}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{d.area}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 text-xs rounded-full font-medium bg-red-100 text-red-700">{d.reason}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{d.rejectedAt}</td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1.5 bg-green-500 text-white rounded hover:bg-green-600" title="Voir profil"><Eye size={12} /></button>
                  <button className="p-1.5 bg-orange-500 text-white rounded hover:bg-orange-600" title="Réexaminer"><RefreshCw size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
