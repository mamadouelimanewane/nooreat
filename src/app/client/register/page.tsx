"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Lock, ArrowRight, Loader2 } from "lucide-react"
import { setClientSession } from "@/lib/clientSession"
import { SESSION_EVENT } from "../layout"

export default function ClientRegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Inscription impossible")
        return
      }
      setClientSession(data.token, data.user)
      window.dispatchEvent(new Event(SESSION_EVENT))
      router.push("/client")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fff] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="w-14 h-14 rounded-full bg-[#06C167] flex items-center justify-center text-black font-black text-2xl mx-auto mb-3">N</span>
          <h1 className="text-xl font-extrabold">NOOR EAT</h1>
          <p className="text-neutral-500 text-sm mt-1">Créer un compte client</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-1.5">Nom complet</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input className="w-full bg-neutral-100 rounded-xl pl-10 pr-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Fatou Diop" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-1.5">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input className="w-full bg-neutral-100 rounded-xl pl-10 pr-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="vous@exemple.com" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-1.5">Téléphone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input className="w-full bg-neutral-100 rounded-xl pl-10 pr-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="77 123 45 67" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-neutral-500 mb-1.5">Mot de passe</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input className="w-full bg-neutral-100 rounded-xl pl-10 pr-3 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-black text-white rounded-full py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-neutral-800 transition disabled:opacity-50 mt-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <>Créer mon compte <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-neutral-500 text-sm mt-6">
          Déjà un compte ? <Link href="/client/login" className="text-black font-semibold underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
