"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError("Ces identifiants ne correspondent à aucun compte.")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--ne-bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Radial glow background */}
      <div style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(6,193,103,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(6,193,103,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'var(--ne-accent)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 900,
            color: '#000',
            margin: '0 auto 16px',
            boxShadow: '0 8px 32px rgba(6,193,103,0.35)',
            letterSpacing: '-2px',
          }}>N</div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 900,
            color: 'var(--ne-text-primary)',
            letterSpacing: '-0.04em',
            marginBottom: '6px',
          }}>NOOR <span style={{ color: 'var(--ne-accent)' }}>EAT</span></h1>
          <p style={{ color: 'var(--ne-text-secondary)', fontSize: '13px' }}>
            Connexion à l'espace administrateur
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: 'var(--ne-bg-card)',
          border: '1px solid var(--ne-border)',
          borderRadius: '20px',
          padding: '36px',
          boxShadow: 'var(--ne-shadow-lg)',
        }}>
          {/* Error */}
          {error && (
            <div style={{
              marginBottom: '20px',
              padding: '12px 16px',
              background: 'rgba(240,62,62,0.12)',
              border: '1px solid rgba(240,62,62,0.3)',
              borderRadius: '10px',
              color: '#f03e3e',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span>{error}</span>
              <button onClick={() => setError("")} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f03e3e', fontSize: '16px' }}>✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Email */}
            <div>
              <label className="ne-label">Adresse e-mail</label>
              <div style={{ position: 'relative' }}>
                <Mail size={15} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ne-text-muted)', pointerEvents: 'none'
                }} />
                <input
                  type="email"
                  id="email"
                  placeholder="admin@nooreat.sn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'var(--ne-bg-input)',
                    border: '1px solid var(--ne-border)',
                    borderRadius: '10px',
                    color: 'var(--ne-text-primary)',
                    fontSize: '14px',
                    padding: '12px 14px 12px 40px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--ne-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--ne-border)'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="ne-label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <Lock size={15} style={{
                  position: 'absolute', left: '14px', top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--ne-text-muted)', pointerEvents: 'none'
                }} />
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    background: 'var(--ne-bg-input)',
                    border: '1px solid var(--ne-border)',
                    borderRadius: '10px',
                    color: 'var(--ne-text-primary)',
                    fontSize: '14px',
                    padding: '12px 14px 12px 40px',
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--ne-accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--ne-border)'}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                padding: '14px',
                background: loading ? 'var(--ne-accent-dark)' : 'var(--ne-accent)',
                color: '#000',
                fontWeight: 800,
                fontSize: '15px',
                borderRadius: '10px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.15s, transform 0.1s',
                fontFamily: 'inherit',
                letterSpacing: '-0.01em',
                marginTop: '4px',
              }}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" />Connexion...</>
              ) : (
                <>Se connecter <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>

        <p style={{
          textAlign: 'center',
          color: 'var(--ne-text-muted)',
          fontSize: '12px',
          marginTop: '24px',
        }}>
          © 2026 NOOR EAT · Plateforme de restauration à Dakar 🇸🇳
        </p>
      </div>
    </div>
  )
}
