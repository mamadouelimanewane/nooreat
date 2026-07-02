"use client"

import { Plus, Edit, Trash2, Key } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"
import Link from "next/link"

const mockAdmins = [
  { id: 1, name: "Mamadou Dia", email: "mamadou.dia@NOOR EAT.com", role: "Super Admin", createdAt: "2025-01-01", status: "Active" },
  { id: 2, name: "Aissatou Fall", email: "aissatou.fall@NOOR EAT.com", role: "Admin", createdAt: "2025-03-01", status: "Active" },
  { id: 3, name: "Cheikh Ndiaye", email: "cheikh.ndiaye@NOOR EAT.com", role: "Opérateur", createdAt: "2025-06-01", status: "Inactive" },
]

export default function SubAdminPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>👤</span> Sous-admins</h1>
        <Link href="/settings/sub-admin/new">
          <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter un admin</button>
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{["N°", "Nom", "Email", "Rôle", "Créé le", "Statut", "Action"].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {mockAdmins.map((a, i) => (
              <tr key={a.id} className="hover:bg-gray-50/80">
                <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                <td className="px-4 py-3 text-gray-600">{a.email}</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 text-xs rounded-full font-medium ${a.role === "Super Admin" ? "bg-purple-100 text-purple-700" : a.role === "Admin" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{a.role}</span></td>
                <td className="px-4 py-3 text-xs text-gray-500">{a.createdAt}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-1.5 bg-blue-500 text-white rounded hover:bg-blue-600" title="Modifier"><Edit size={12} /></button>
                  <button className="p-1.5 bg-orange-500 text-white rounded hover:bg-orange-600" title="Changer mot de passe"><Key size={12} /></button>
                  <button className="p-1.5 bg-red-500 text-white rounded hover:bg-red-600" title="Supprimer"><Trash2 size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
