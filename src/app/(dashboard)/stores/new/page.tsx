"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Store, MapPin, Phone, Mail, FileText, CheckCircle2 } from "lucide-react"

export default function NewStorePage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-2xl mx-auto mt-10">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Magasin créé avec succès !</h2>
        <p className="text-gray-500 text-center mb-8">Le magasin a été ajouté à la plateforme. Un email a été envoyé au gestionnaire avec ses accès au backoffice commerçant.</p>
        <div className="flex gap-4">
          <Link href="/stores">
            <button className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">Retour à la liste</button>
          </Link>
          <button onClick={() => setSuccess(false)} className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors">Créer un autre</button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/stores" className="p-2 bg-white rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Ajouter un nouveau magasin</h1>
          <p className="text-sm text-gray-500">Configurez les informations d'un nouveau partenaire commercial</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations générales */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
            <Store size={18} className="text-cyan-500" />
            <h2 className="font-semibold text-gray-800">Informations générales</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du magasin *</label>
              <input required typeof="text" placeholder="Ex: Marché Sandaga Alimentation" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie principale</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-gray-700 bg-white">
                <option>Alimentation générale</option>
                <option>Produits frais (Viande, Poisson)</option>
                <option>Légumes et Fruits</option>
                <option>Restauration rapide</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description courte</label>
              <textarea rows={3} placeholder="Mots clés sur le magasin..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50"></textarea>
            </div>
          </div>
        </div>

        {/* Coordonnées */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
            <Phone size={18} className="text-cyan-500" />
            <h2 className="font-semibold text-gray-800">Contacts du gérant</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email de connexion *</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="email" placeholder="gerant@magasin.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input required type="tel" placeholder="+221 77 000 00 00" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
            <MapPin size={18} className="text-cyan-500" />
            <h2 className="font-semibold text-gray-800">Localisation</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secteur / Quartier *</label>
              <input required type="text" placeholder="Ex: Rufisque" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Adresse détaillée</label>
              <input type="text" placeholder="Avenue Centrale..." className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
            </div>
            <div className="md:col-span-2">
              <div className="w-full h-48 bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400">
                <MapPin size={32} className="mb-2 opacity-50" />
                <p className="text-sm">Cliquez pour placer le magasin sur la carte</p>
                <p className="text-xs mt-1">Module Google Maps à intégrer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Finances */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
            <FileText size={18} className="text-cyan-500" />
            <h2 className="font-semibold text-gray-800">Paramètres financiers et livraisons</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commission plateforme (%) *</label>
              <input required type="number" defaultValue="5" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
              <p className="text-xs text-gray-500 mt-1">Pourcentage prélevé sur les ventes de ce magasin.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assignation livreur</label>
              <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-gray-700 bg-white">
                <option>Automatique (le plus proche)</option>
                <option>Manuelle par le magasinier</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Comment le livreur est sélectionné pour ce magasin.</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4 pt-4">
          <Link href="/stores">
            <button type="button" className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors">Annuler</button>
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-70 text-white rounded-xl font-bold transition-all shadow-md shadow-cyan-200"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            {loading ? "Création en cours..." : "Créer le magasin"}
          </button>
        </div>
      </form>
    </div>
  )
}
