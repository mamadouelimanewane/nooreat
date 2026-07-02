"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard, Settings, Tag, Clock, Store, FileText, ShoppingCart,
  Image, Truck, Car, Users, Megaphone, Wallet, CreditCard, BarChart2,
  BarChart, ChevronDown, ChevronRight, LogOut, UserCog, Globe, Map,
  Weight, Bookmark, Bell, DollarSign, Receipt, MapPin, Package, BrainCircuit
} from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"

type NavItem = {
  label: string
  href?: string
  icon?: React.ReactNode
  children?: NavItem[]
}

const navigation: { section: string; items: NavItem[] }[] = [
  {
    section: "",
    items: [
      { label: "Tableau de bord", href: "/dashboard", icon: <LayoutDashboard size={15} /> },
    ],
  },
  {
    section: "STRATÉGIE & IA",
    items: [
      { label: "Intelligence IA", href: "/analytics", icon: <BrainCircuit size={15} /> },
      { label: "Marketing Hub", href: "/marketing", icon: <Megaphone size={15} /> },
    ],
  },
  {
    section: "CONFIGURATION",
    items: [
      {
        label: "Configuration", icon: <Settings size={15} />,
        children: [
          { label: "Pays", href: "/countries", icon: <Globe size={13} /> },
          { label: "Documents", href: "/documents", icon: <FileText size={13} /> },
          { label: "Type de véhicule", href: "/vehicles", icon: <Car size={13} /> },
          { label: "Zone de service", href: "/service-areas", icon: <Map size={13} /> },
          { label: "Catégories", href: "/categories", icon: <Tag size={13} /> },
          { label: "Unité de poids", href: "/weight-units", icon: <Weight size={13} /> },
          { label: "Marqueurs carte", href: "/map-markers", icon: <MapPin size={13} /> },
        ],
      },
      {
        label: "Tarification", icon: <CreditCard size={15} />,
        children: [
          { label: "Règles tarifaires", href: "/price-card/fare-rules" },
          { label: "Tarif dynamique", href: "/price-card/surge" },
        ],
      },
      { label: "Codes promo", href: "/promo-code", icon: <Tag size={15} /> },
      { label: "Créneaux horaires", href: "/service-time-slots", icon: <Clock size={15} /> },
    ],
  },
  {
    section: "RESTAURANTS",
    items: [
      { label: "Restaurants", href: "/stores", icon: <Store size={15} /> },
      { label: "Factures commandes", href: "/invoices", icon: <Receipt size={15} /> },
      { label: "Commandes", href: "/orders", icon: <ShoppingCart size={15} /> },
      { label: "Slider accueil", href: "/slider", icon: <Image size={15} /> },
    ],
  },
  {
    section: "LIVREURS",
    items: [
      {
        label: "Livreurs", icon: <Truck size={15} />,
        children: [
          { label: "Tous les livreurs", href: "/drivers" },
          { label: "Par type de véhicule", href: "/drivers/vehicle-based" },
          { label: "Approbation en attente", href: "/drivers/pending" },
          { label: "Livreurs rejetés", href: "/drivers/rejected" },
          { label: "Expiration documents", href: "/drivers/documents" },
        ],
      },
      {
        label: "Véhicules", icon: <Car size={15} />,
        children: [
          { label: "Tous les véhicules", href: "/vehicles/list" },
          { label: "Types de véhicules", href: "/vehicles" },
        ],
      },
      {
        label: "Carte", icon: <Map size={15} />,
        children: [
          { label: "Carte des livreurs", href: "/map/driver" },
          { label: "Heat Map", href: "/map/heatmap" },
        ],
      },
    ],
  },
  {
    section: "UTILISATEURS",
    items: [
      { label: "Utilisateurs", href: "/users", icon: <Users size={15} /> },
    ],
  },
  {
    section: "CONTENU & NOTIFS",
    items: [
      {
        label: "Gestion du contenu", icon: <Bookmark size={15} />,
        children: [
          { label: "Pages", href: "/content/pages" },
          { label: "FAQ", href: "/content/faqs" },
          { label: "Chaînes application", href: "/content/app-strings" },
          { label: "Options de paiement", href: "/content/payment-options" },
        ],
      },
      { label: "Notifications", href: "/notifications", icon: <Bell size={15} /> },
      { label: "Portefeuilles", href: "/wallet", icon: <Wallet size={15} /> },
    ],
  },
  {
    section: "TRANSACTIONS",
    items: [
      {
        label: "Demandes de retrait", icon: <DollarSign size={15} />,
        children: [
          { label: "Retrait livreurs", href: "/cashout/drivers" },
          { label: "Retrait restaurants", href: "/cashout/stores" },
        ],
      },
    ],
  },
  {
    section: "RAPPORTS",
    items: [
      {
        label: "Revenus", icon: <BarChart2 size={15} />,
        children: [
          { label: "Gains livreurs", href: "/reports/earnings/drivers" },
          { label: "Gains restaurants", href: "/reports/earnings/stores" },
        ],
      },
      { label: "Temps en ligne livreurs", href: "/reports/driver-online-time", icon: <Clock size={15} /> },
      {
        label: "Transactions", icon: <BarChart size={15} />,
        children: [
          { label: "Toutes les transactions", href: "/reports/transactions" },
          { label: "Portefeuille utilisateurs", href: "/reports/transactions/user" },
          { label: "Portefeuille livreurs", href: "/reports/transactions/driver" },
        ],
      },
    ],
  },
  {
    section: "PARAMÈTRES",
    items: [
      {
        label: "Sous-admins", icon: <UserCog size={15} />,
        children: [
          { label: "Tous les admins", href: "/settings/sub-admin" },
          { label: "Ajouter un admin", href: "/settings/sub-admin/new" },
          { label: "Rôles & Permissions", href: "/sub-admin/roles" },
        ],
      },
      {
        label: "Paramètres", icon: <Settings size={15} />,
        children: [
          { label: "Configuration générale", href: "/settings/configuration" },
          { label: "Config. email", href: "/settings/configuration/email" },
          { label: "URLs application", href: "/settings/configuration/app-url" },
          { label: "Profil", href: "/settings/profile" },
        ],
      },
    ],
  },
]

function NavLink({ item, depth = 0 }: { item: NavItem; depth?: number }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isActive = item.href ? pathname === item.href || pathname.startsWith(item.href + "/") : false

  if (item.children) {
    const hasActiveChild = item.children.some(
      (c) => c.href && (pathname === c.href || pathname.startsWith(c.href + "/"))
    )
    const expanded = open || hasActiveChild

    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            "ne-nav-item w-full",
            depth > 0 ? "pl-8" : "",
            hasActiveChild ? "parent-active" : ""
          )}
        >
          <span className="ne-nav-item-icon">
            {item.icon}
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        {expanded && (
          <div style={{ marginLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.06)', marginTop: '2px' }}>
            {item.children.map((child) => (
              <NavLink key={child.label} item={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href!}
      className={cn(
        "ne-nav-item",
        depth > 0 ? "pl-8" : "",
        isActive ? "active" : ""
      )}
    >
      {item.icon && <span className="ne-nav-item-icon">{item.icon}</span>}
      {!item.icon && <span className="w-7" />}
      {item.label}
    </Link>
  )
}

export default function Sidebar() {
  return (
    <aside className="ne-sidebar">
      <nav className="ne-sidebar-nav">
        {navigation.map((group) => (
          <div key={group.section} style={{ marginBottom: '4px' }}>
            {group.section && (
              <p className="ne-sidebar-section-label">{group.section}</p>
            )}
            {group.items.map((item) => (
              <NavLink key={item.label} item={item} />
            ))}
          </div>
        ))}
      </nav>

      <div className="ne-sidebar-footer">
        <Link href="/settings/configuration" className="ne-header-btn" style={{ borderRadius: '8px' }}>
          <Settings size={16} />
        </Link>
        <Link href="/settings/profile" className="ne-header-btn" style={{ borderRadius: '8px' }}>
          <Users size={16} />
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="ne-header-btn"
          style={{ borderRadius: '8px', color: 'var(--ne-danger)' }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  )
}
