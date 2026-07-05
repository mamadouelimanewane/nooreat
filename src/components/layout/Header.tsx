"use client"

import { ArrowLeft, Maximize2, Bell, Globe, ChevronDown, Search, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter()
  const [lang, setLang] = useState("FR")

  return (
    <header className="ne-header">
      {/* Left — Logo + Nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="ne-header-btn ne-menu-toggle"
          onClick={onMenuClick}
          title="Menu"
        >
          <Menu size={18} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="ne-logo-mark">N</div>
          <span className="ne-logo-text">
            NOOR<span> EAT</span>
          </span>
          <span className="ne-header-badge" style={{
            background: 'rgba(6,193,103,0.15)',
            color: 'var(--ne-accent)',
            fontSize: '10px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '999px',
            letterSpacing: '0.05em',
            marginLeft: '4px'
          }}>ADMIN</span>
        </div>

        <div className="ne-header-nav-extra" style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => router.back()}
            className="ne-header-btn"
            title="Retour"
          >
            <ArrowLeft size={16} />
          </button>
          <button className="ne-header-btn" title="Plein écran">
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Center — Search */}
      <div className="ne-header-search" style={{
        flex: 1,
        maxWidth: '400px',
        margin: '0 24px',
        position: 'relative'
      }}>
        <Search size={14} style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--ne-text-muted)'
        }} />
        <input
          placeholder="Rechercher restaurants, commandes, livreurs..."
          style={{
            width: '100%',
            background: 'var(--ne-bg-card)',
            border: '1px solid var(--ne-border)',
            borderRadius: '8px',
            color: 'var(--ne-text-primary)',
            fontSize: '13px',
            padding: '8px 12px 8px 34px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button className="ne-header-btn" style={{ position: 'relative' }}>
          <Bell size={17} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '7px',
            height: '7px',
            background: 'var(--ne-danger)',
            borderRadius: '50%',
            border: '1.5px solid var(--ne-bg-secondary)'
          }} />
        </button>

        <button
          className="ne-header-lang"
          onClick={() => setLang(lang === "FR" ? "EN" : "FR")}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'var(--ne-text-secondary)',
            fontSize: '12px',
            fontWeight: 600,
            padding: '6px 10px',
            background: 'var(--ne-bg-card)',
            border: '1px solid var(--ne-border)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'color 0.15s, border-color 0.15s'
          }}
        >
          <Globe size={13} />
          {lang}
          <ChevronDown size={11} />
        </button>

        <div className="ne-avatar" title="Profil Admin">A</div>
      </div>
    </header>
  )
}
