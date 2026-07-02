import { Suspense } from "react"
import { ShoppingBag, TrendingUp, Star, Wallet, Clock, CheckCircle, XCircle, Truck, ArrowUp, ArrowDown } from "lucide-react"
import { prisma } from "@/lib/prisma"

async function DashboardContent({ storeId }: { storeId: string }) {
  // Fetch real data for this store from Prisma
  // For demo purposes, if no storeId provided, we take the seeded one
  const store = await prisma.store.findFirst({
    where: storeId !== "1" ? { id: storeId } : { email: "store@NOOR EAT.com" },
    include: {
      _count: {
        select: {
          orders: true,
          products: true
        }
      },
      orders: {
        take: 5,
        orderBy: { createdAt: 'desc' },
      }
    }
  })

  if (!store) {
    return <div className="p-8 text-center text-gray-500">Magasin non trouvé.</div>
  }

  // Calculate some stats based on existing data
  const totalRevenue = store.orders.reduce((sum, o) => sum + (o.total || 0), 0)
  
  const stats = [
    { label: "Total commandes", value: store._count.orders.toString(), icon: ShoppingBag, color: "bg-blue-500", change: "Données réelles", up: true },
    { label: "Chiffre d'affaires", value: `${totalRevenue.toLocaleString()} FCFA`, icon: TrendingUp, color: "bg-green-500", change: "+0%", up: true },
    { label: "Note moyenne", value: `${store.rating} / 5`, icon: Star, color: "bg-amber-500", change: "stable", up: null },
    { label: "Solde portefeuille", value: `${store.walletMoney.toLocaleString()} FCFA`, icon: Wallet, color: "bg-purple-500", change: "Réel", up: true },
  ]

  // Mocking order breakdown for UI - in real DB would be grouped queries
  const orderStats = [
    { label: "En attente", count: 0, icon: Clock, color: "text-yellow-500 bg-yellow-50 border-yellow-200" },
    { label: "En préparation", count: 0, icon: ShoppingBag, color: "text-blue-500 bg-blue-50 border-blue-200" },
    { label: "En livraison", count: 0, icon: Truck, color: "text-cyan-500 bg-cyan-50 border-cyan-200" },
    { label: "Livrées", count: store._count.orders, icon: CheckCircle, color: "text-green-500 bg-green-50 border-green-200" },
    { label: "Annulées", count: 0, icon: XCircle, color: "text-red-500 bg-red-50 border-red-200" },
  ]

  const recentOrders = store.orders.map(order => ({
    id: `#${order.orderId}`,
    customer: "Client NOOR EAT", // Simplified for now
    items: "Détails indisponibles",
    amount: order.total.toLocaleString(),
    status: order.status,
    time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    statusColor: "bg-blue-100 text-blue-700"
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">{store.name}</h1>
        <p className="text-sm text-gray-500 mt-0.5">Vue d&apos;ensemble de votre activité · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center`}>
                <s.icon size={20} className="text-white" />
              </div>
              {s.up !== null && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${s.up ? "text-green-600" : "text-red-500"}`}>
                  {s.up ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {s.change}
                </span>
              )}
            </div>
            <div className="text-lg font-bold text-gray-800">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Order status row */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
        {orderStats.map((o) => (
          <div key={o.label} className={`bg-white rounded-xl border p-3 flex flex-col items-center gap-1 ${o.color}`}>
            <o.icon size={20} />
            <div className="text-xl font-bold">{o.count}</div>
            <div className="text-xs text-center font-medium">{o.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Commandes récentes</h2>
            <a href={`/merchant/orders?store=${store.id}`} className="text-xs text-cyan-500 hover:underline font-medium">Voir tout →</a>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.length > 0 ? recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50/60 transition-colors">
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                  {order.id.slice(1)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800">{order.customer}</div>
                  <div className="text-xs text-gray-400 truncate">{order.items}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-800">{order.amount} FCFA</div>
                  <div className="flex items-center gap-1.5 justify-end mt-0.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.statusColor}`}>{order.status}</span>
                    <span className="text-xs text-gray-400">{order.time}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-gray-400 text-sm italic">Aucune commande pour le moment.</div>
            )}
          </div>
        </div>

        {/* Top Products - Real Count */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Inventaire</h2>
            <p className="text-xs text-gray-400 mt-0.5">Aujourd&apos;hui</p>
          </div>
          <div className="p-5 flex flex-col items-center justify-center gap-2">
            <div className="text-3xl font-bold text-gray-800">{store._count.products}</div>
            <div className="text-sm text-gray-500 text-center">Produits actifs dans votre catalogue.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function MerchantDashboardPage({ searchParams }: { searchParams: Promise<{ store?: string }> }) {
  const params = await searchParams
  const storeId = params.store ?? "1"

  return (
    <Suspense fallback={<div className="flex justify-center pt-20">Chargement...</div>}>
      <DashboardContent storeId={storeId} />
    </Suspense>
  )
}
