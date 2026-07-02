"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewSubAdminPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "Admin", password: "", confirm: "" })

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700 text-sm">← Retour</button>
        <h1 className="text-lg font-semibold text-gray-700">Ajouter un sous-admin</h1>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-lg">
        <div className="space-y-4">
          {[
            { label: "Nom complet *", key: "name", type: "text", placeholder: "Prénom Nom" },
            { label: "Email *", key: "email", type: "email", placeholder: "email@NOOR EAT.com" },
            { label: "Téléphone", key: "phone", type: "tel", placeholder: "+221 77 000 00 00" },
            { label: "Mot de passe *", key: "password", type: "password", placeholder: "••••••••" },
            { label: "Confirmer le mot de passe *", key: "confirm", type: "password", placeholder: "••••••••" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-gray-500 block mb-1">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          ))}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Rôle *</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>Super Admin</option>
              <option>Admin</option>
              <option>Opérateur</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => router.back()} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Annuler</button>
            <button className="px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">Créer l'admin</button>
          </div>
        </div>
      </div>
    </div>
  )
}
