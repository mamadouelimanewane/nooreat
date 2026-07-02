"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"

const mockFaqs = [
  { id: 1, question: "Comment passer une commande ?", answer: "Téléchargez l'application, sélectionnez un magasin et ajoutez des produits à votre panier.", category: "Commandes", status: "Active" },
  { id: 2, question: "Comment suivre ma livraison ?", answer: "Suivez votre livreur en temps réel depuis l'onglet 'Mes commandes' dans l'application.", category: "Livraison", status: "Active" },
  { id: 3, question: "Comment contacter le support ?", answer: "Contactez-nous via le formulaire in-app ou par email à support@NOOR EAT.com.", category: "Support", status: "Active" },
]

export default function FaqsPage() {
  const [expanded, setExpanded] = useState<number | null>(null)
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2"><span>❓</span> FAQ</h1>
        <button className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg"><Plus size={14} /> Ajouter</button>
      </div>
      <div className="space-y-2">
        {mockFaqs.map((faq) => (
          <div key={faq.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(expanded === faq.id ? null : faq.id)}>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{faq.category}</span>
                <span className="font-medium text-gray-800 text-sm">{faq.question}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={faq.status} />
                <button className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={e => e.stopPropagation()}><Edit size={12} /></button>
                <button className="p-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={e => e.stopPropagation()}><Trash2 size={12} /></button>
                {expanded === faq.id ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>
            {expanded === faq.id && (
              <div className="px-4 pb-4 text-sm text-gray-600 border-t border-gray-50 pt-3">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
