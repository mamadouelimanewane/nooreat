import Link from "next/link"
import { ShoppingBag, Truck, Store, Wallet, ArrowRight } from "lucide-react"

const SERVICES = [
  {
    icon: ShoppingBag,
    title: "Commander",
    desc: "Parcourez les restaurants de Dakar et faites-vous livrer en quelques clics, depuis votre navigateur ou l'app mobile.",
    href: "/client",
    cta: "Commander maintenant",
  },
  {
    icon: Truck,
    title: "Livrer",
    desc: "Devenez livreur NOOR EAT : acceptez des courses, suivez vos gains et gérez vos livraisons depuis un tableau de bord dédié.",
    href: "/livreur/login",
    cta: "Espace livreur",
  },
  {
    icon: Store,
    title: "Vendre",
    desc: "Vous tenez un restaurant ? Gérez votre menu, vos commandes et votre comptabilité depuis le portail marchand.",
    href: "/merchant/login",
    cta: "Espace marchand",
  },
  {
    icon: Wallet,
    title: "Administrer",
    desc: "Back-office complet pour piloter la plateforme : restaurants, livreurs, commandes, finances.",
    href: "/login",
    cta: "Espace admin",
  },
]

export default function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--ne-bg-primary)", overflowX: "hidden" }}>
      {/* Header */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 24px", maxWidth: "1200px", margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="ne-logo-mark">N</div>
          <span className="ne-logo-text">NOOR<span> EAT</span></span>
        </div>
        <Link href="/client" className="ne-btn-primary">
          Commander <ArrowRight size={15} />
        </Link>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: "900px", margin: "0 auto", textAlign: "center",
        padding: "64px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
          width: "min(600px, 90vw)", height: "400px",
          background: "radial-gradient(circle, rgba(6,193,103,0.14) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <h1 style={{
          fontSize: "clamp(32px, 6vw, 60px)", fontWeight: 900, letterSpacing: "-0.03em",
          lineHeight: 1.08, marginBottom: "20px", position: "relative",
        }}>
          Vos restaurants préférés,<br />
          livrés <span style={{ color: "var(--ne-accent)" }}>partout à Dakar</span>
        </h1>
        <p style={{
          color: "var(--ne-text-secondary)", fontSize: "18px", maxWidth: "560px",
          margin: "0 auto 32px", position: "relative",
        }}>
          NOOR EAT connecte clients, restaurants et livreurs sur une seule plateforme,
          rapide et fiable.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
          <Link href="/client" className="ne-btn-primary" style={{ fontSize: "15px", padding: "13px 26px" }}>
            Je commande <ArrowRight size={16} />
          </Link>
          <Link href="/livreur/login" className="ne-btn-ghost" style={{ fontSize: "15px", padding: "13px 26px" }}>
            Je livre
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div className="ne-section-header" style={{ justifyContent: "center", border: "none" }}>
          <span className="ne-section-title">Nos services</span>
        </div>
        <div style={{
          display: "grid", gap: "20px", marginTop: "24px",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        }}>
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="ne-card ne-quicklink-card"
              style={{ textDecoration: "none", display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div className="ne-stat-icon green">
                <s.icon size={22} />
              </div>
              <h3 style={{ fontSize: "17px" }}>{s.title}</h3>
              <p style={{ color: "var(--ne-text-secondary)", fontSize: "13.5px", flex: 1 }}>{s.desc}</p>
              <span style={{ color: "var(--ne-accent)", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                {s.cta} <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{
        maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px",
        textAlign: "center",
      }}>
        {[
          { label: "restaurants partenaires", value: "50+" },
          { label: "livraison moyenne", value: "20-40 min" },
          { label: "zones couvertes à Dakar", value: "10+" },
        ].map((stat) => (
          <div key={stat.label}>
            <div style={{ fontSize: "32px", fontWeight: 900, color: "var(--ne-accent)" }}>{stat.value}</div>
            <div style={{ color: "var(--ne-text-muted)", fontSize: "13px" }}>{stat.label}</div>
          </div>
        ))}
      </section>

      <footer style={{
        borderTop: "1px solid var(--ne-border)", padding: "24px",
        textAlign: "center", color: "var(--ne-text-muted)", fontSize: "12px",
      }}>
        © {new Date().getFullYear()} NOOR EAT — Dakar, Sénégal
      </footer>
    </div>
  )
}
