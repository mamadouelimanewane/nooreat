import {
  Users, Truck, Globe, Map, FileText, DollarSign, Tag,
  Store, FolderOpen, Package, ShoppingCart, TrendingUp,
} from "lucide-react"
import StatCard from "@/components/ui/StatCard"
import { prisma } from "@/lib/prisma"

export default async function DashboardPage() {
  const [
    userCount,
    driverCount,
    countryCount,
    areaCount,
    storeCount,
    categoryCount,
    productCount,
    orderCount,
    totalRevenue,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.driver.count(),
    prisma.country.count(),
    prisma.serviceArea.count(),
    prisma.store.count(),
    prisma.category.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } })
  ])

  const siteStats = [
    { label: "Utilisateurs",        value: userCount.toLocaleString(),   color: "green",  icon: <Users size={20} />,      href: "/users" },
    { label: "Livreurs actifs",     value: driverCount.toLocaleString(), color: "blue",   icon: <Truck size={20} />,      href: "/drivers" },
    { label: "Pays de service",     value: countryCount.toLocaleString(),color: "orange", icon: <Globe size={20} />,      href: "/countries" },
    { label: "Zones de service",    value: areaCount.toLocaleString(),   color: "purple", icon: <Map size={20} />,        href: "/service-areas" },
    { label: "Docs expirant",       value: "1",                          color: "red",    icon: <FileText size={20} />,   href: "/drivers/documents" },
    { label: "Revenus totaux",      value: `${(totalRevenue._sum.total || 0).toLocaleString()} FCFA`, color: "cyan", icon: <TrendingUp size={20} />, href: "/reports/earnings" },
    { label: "Remises accordées",   value: "0",                          color: "pink",   icon: <Tag size={20} />,        href: "/promo-code" },
  ]

  const restaurantStats = [
    { label: "Restaurants partenaires", value: storeCount.toLocaleString(),   color: "green",  icon: <Store size={20} />,       href: "/stores" },
    { label: "Catégories menus",        value: categoryCount.toLocaleString(),color: "cyan",   icon: <FolderOpen size={20} />,  href: "/categories" },
    { label: "Plats référencés",        value: productCount.toLocaleString(), color: "teal",   icon: <Package size={20} />,     href: "/stores" },
    { label: "Total commandes",         value: orderCount.toLocaleString(),   color: "orange", icon: <ShoppingCart size={20} />,href: "/orders" },
    { label: "Chiffre d'affaires",      value: `${(totalRevenue._sum.total || 0).toLocaleString()} F`, color: "cyan", icon: <DollarSign size={20} />, href: "/reports/earnings" },
    { label: "Promotions actives",      value: "0",                           color: "red",    icon: <Tag size={20} />,         href: "/promo-code" },
  ]

  return (
    <div className="ne-animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Hero greeting */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--ne-text-primary)', marginBottom: '4px' }}>
            Bonjour 👋
          </h1>
          <p style={{ color: 'var(--ne-text-secondary)', fontSize: '14px' }}>
            Voici l'état de votre plateforme <strong style={{ color: 'var(--ne-accent)' }}>NOOR EAT</strong> à Dakar
          </p>
        </div>
        <div style={{
          background: 'var(--ne-accent-muted)',
          border: '1px solid rgba(6,193,103,0.2)',
          borderRadius: '12px',
          padding: '10px 18px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }}>
          <span style={{ fontSize: '11px', color: 'var(--ne-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Plateforme</span>
          <span style={{ fontSize: '16px', color: 'var(--ne-accent)', fontWeight: 800, letterSpacing: '-0.02em' }}>🇸🇳 Dakar, SN</span>
        </div>
      </div>

      {/* Platform Statistics */}
      <section>
        <div className="ne-section-header">
          <div className="ne-section-dot" />
          <span className="ne-section-title">Statistiques Plateforme</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {siteStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Restaurant Statistics */}
      <section>
        <div className="ne-section-header">
          <div className="ne-section-dot" style={{ background: 'var(--ne-warning)' }} />
          <span className="ne-section-title">Statistiques Restaurants</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
          {restaurantStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      {/* Quick links */}
      <section>
        <div className="ne-section-header">
          <div className="ne-section-dot" style={{ background: 'var(--ne-info)' }} />
          <span className="ne-section-title">Actions Rapides</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { label: "Ajouter un restaurant", href: "/stores/new", emoji: "🍽️" },
            { label: "Voir les commandes", href: "/orders", emoji: "📦" },
            { label: "Gérer les livreurs", href: "/drivers", emoji: "🛵" },
            { label: "Envoyer notification", href: "/notifications", emoji: "🔔" },
          ].map(link => (
            <a key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
              <div className="ne-card" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'transform 0.15s, border-color 0.15s'
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(6,193,103,0.3)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = ''
                  ;(e.currentTarget as HTMLDivElement).style.borderColor = ''
                }}
              >
                <span style={{ fontSize: '22px' }}>{link.emoji}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ne-text-primary)' }}>{link.label}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
