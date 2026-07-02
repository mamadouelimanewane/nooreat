"use client"

import { Suspense, useState } from "react"
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts"
import { Download, Calculator, TrendingUp, DollarSign, Calendar, FileText, Loader2 } from "lucide-react"

const weeklyData = [
  { day: "Lun", gmv: 45000, net: 42750 },
  { day: "Mar", gmv: 38000, net: 36100 },
  { day: "Mer", gmv: 65000, net: 61750 },
  { day: "Jeu", gmv: 51000, net: 48450 },
  { day: "Ven", gmv: 85000, net: 80750 },
  { day: "Sam", gmv: 120000, net: 114000 },
  { day: "Dim", gmv: 95000, net: 90250 },
]

const recentTransactions = [
  { id: "FAC-901", date: "12 Avril 2026", type: "Vente Client", doc: "Commande #1042", amount: 8500, fee: 425, net: 8075, status: "Payé" },
  { id: "FAC-900", date: "12 Avril 2026", type: "Vente Client", doc: "Commande #1040", amount: 12000, fee: 600, net: 11400, status: "Payé" },
  { id: "FAC-899", date: "11 Avril 2026", type: "Vente Client", doc: "Commande #1039", amount: 6500, fee: 325, net: 6175, status: "Payé" },
  { id: "RET-014", date: "10 Avril 2026", type: "Retrait Bancaire", doc: "Orange Money", amount: -50000, fee: 0, net: -50000, status: "Traité" },
  { id: "FAC-898", date: "09 Avril 2026", type: "Vente Client", doc: "Commande #1030", amount: 15000, fee: 750, net: 14250, status: "Payé" },
]

function AccountingContent() {
  const [period, setPeriod] = useState("Semaine")
  
  const totalGMV = weeklyData.reduce((sum, item) => sum + item.gmv, 0)
  const totalNet = weeklyData.reduce((sum, item) => sum + item.net, 0)
  const totalCommissions = totalGMV - totalNet

  const exportPDF = () => {
    alert("Téléchargement du Bilan Comptable au format PDF en cours...")
  }

  const exportCSV = () => {
    alert("Exportation des transactions brutes au format CSV/Excel...")
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Calculator size={22} className="text-cyan-600" />
            Comptabilité & Reporting
          </h1>
          <p className="text-sm text-gray-500">Suivez vos recettes, marges et données fiscales</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-xl transition-colors">
            <Download size={16} /> Export Excel
          </button>
          <button onClick={exportPDF} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm">
            <FileText size={16} /> Bilan PDF
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Ventes Brutes (GMV)</p>
              <p className="text-xs text-gray-400">Ce que paient les clients</p>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{totalGMV.toLocaleString()} <span className="text-lg text-gray-400 font-medium">FCFA</span></h3>
          <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-2">
            <TrendingUp size={12} /> +12% par rapport à la semaine dernière
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full opacity-50"></div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-500 flex items-center justify-center">
              <Calculator size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">Commissions NOOR EAT</p>
              <p className="text-xs text-gray-400">Prélèvement de la plateforme (5%)</p>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mt-2">{totalCommissions.toLocaleString()} <span className="text-lg text-gray-400 font-medium">FCFA</span></h3>
          <p className="text-xs text-gray-500 font-medium mt-2">Déductions automatiques traitées</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl shadow-lg shadow-cyan-200 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-cyan-100">Bénéfice Net</p>
              <p className="text-xs text-cyan-200">Argent réel pour votre magasin</p>
            </div>
          </div>
          <h3 className="text-3xl font-bold text-white mt-2 relative z-10">{totalNet.toLocaleString()} <span className="text-lg text-cyan-200 font-medium">FCFA</span></h3>
          <p className="text-xs text-cyan-100 font-medium mt-2 relative z-10">Total accumulé sur la semaine</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-800">Évolution du Bénéfice Net</h2>
              <p className="text-xs text-gray-500">Comparaison Brute vs Nette</p>
            </div>
            <select 
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-gray-50 focus:outline-none"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option>Semaine</option>
              <option>Mois</option>
              <option>Année</option>
            </select>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dx={-10} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                  formatter={(value: any, name: any) => [
                    `${value.toLocaleString()} FCFA`, 
                    name === "net" ? "Bénéfice Net" : "Ventes Brutes"
                  ]}
                />
                <Area type="monotone" dataKey="gmv" stroke="#D1D5DB" fillOpacity={0} strokeWidth={2} />
                <Area type="monotone" dataKey="net" stroke="#0891b2" fill="url(#colorNet)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Taxes and small metrics */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <h2 className="font-semibold text-gray-800 mb-4">Indicateurs de Performance</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Panier Moyen Net</p>
                <p className="text-lg font-bold text-gray-800">14 250 FCFA</p>
                <p className="text-[10px] text-green-600 mt-1">↑ +2.4% vs Sem. G</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">Rétention Client</p>
                <p className="text-lg font-bold text-gray-800">42%</p>
                <p className="text-[10px] text-gray-500 mt-1">Clients récurrents</p>
              </div>
              <div className="p-4 bg-cyan-50 rounded-xl border border-cyan-100">
                <p className="text-xs text-cyan-700 mb-1">Taux de Conversion</p>
                <p className="text-lg font-bold text-cyan-800">18.5%</p>
                <p className="text-[10px] text-cyan-600 mt-1">Visiteurs devenus acheteurs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Livre de Comptes (Ledger) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-800">Livre des Transactions (Grand Livre)</h2>
          <div className="flex gap-2">
            <button className="text-xs font-medium text-cyan-600 bg-cyan-50 px-3 py-1.5 rounded-lg hover:bg-cyan-100 transition-colors">Filtrer</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 text-xs tracking-wider">RÉFÉRENCE</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 text-xs tracking-wider">DATE</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600 text-xs tracking-wider">TYPE / DOC</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600 text-xs tracking-wider">BRUT</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600 text-xs tracking-wider">FRAIS</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-600 text-xs tracking-wider">NET</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-600 text-xs tracking-wider">STATUT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-gray-500">{tx.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" /> {tx.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-800">{tx.type}</div>
                    <div className="text-xs text-gray-500">{tx.doc}</div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-medium ${tx.amount > 0 ? "text-gray-800" : "text-red-600"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-red-500 text-xs">
                    {tx.fee > 0 ? `-${tx.fee.toLocaleString()}` : "—"}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-bold ${tx.net > 0 ? "text-green-600" : "text-red-600"}`}>
                    {tx.net > 0 ? "+" : ""}{tx.net.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function MerchantAccountingPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 size={28} className="text-cyan-500 animate-spin" /></div>}>
      <AccountingContent />
    </Suspense>
  )
}
