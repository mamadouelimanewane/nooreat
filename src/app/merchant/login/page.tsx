"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Store, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function MerchantLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState("")
  const [loggingIn, setLoggingIn] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoggingIn(true)
    try {
      const res = await fetch("/api/merchant/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || "Identifiants incorrects")
        return
      }
      router.push("/merchant/dashboard")
    } catch {
      setError("Erreur de connexion. Réessayez.")
    } finally {
      setLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-2xl shadow-lg mb-4">
            <Store size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">NOOR EAT</h1>
          <p className="text-gray-500 text-sm mt-1">Espace Vendeur</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div className="mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Connexion Vendeur</h2>
              <p className="text-gray-500 text-xs mt-0.5">Entrez vos identifiants</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                placeholder="email@magasin.com"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl border border-red-100">
                <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-300 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loggingIn ? (
                <><Loader2 size={16} className="animate-spin" />Connexion...</>
              ) : "Se connecter"}
            </button>

            <p className="text-center text-xs text-gray-400 mt-2">
              Mot de passe oublié ?{" "}
              <span className="text-cyan-500 cursor-pointer hover:underline">Contacter l&apos;admin</span>
            </p>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 NOOR EAT · Plateforme de livraison
        </p>
      </div>
    </div>
  )
}
