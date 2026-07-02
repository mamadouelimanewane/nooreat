"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, Users, ShoppingBag, Store, 
  Filter, Calendar, Download, BrainCircuit, Sparkles, Target, ArrowUpRight
} from "lucide-react"

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics/summary')
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  )

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Intelligence Business <TrendingUp className="text-indigo-600" />
          </h1>
          <p className="text-gray-500 text-sm">Analyse approfondie des performances et profilage IA</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Calendar size={16} /> 7 Derniers jours
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-shadow shadow-lg shadow-indigo-200">
            <Download size={16} /> Exporter PDF
          </button>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Clients Actifs", value: data.counters.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50", trend: "+12%" },
          { label: "Ventes Totales", value: data.counters.totalOrders, icon: ShoppingBag, color: "text-green-600", bg: "bg-green-50", trend: "+24%" },
          { label: "Marchés Partenaires", value: data.counters.totalStores, icon: Store, color: "text-amber-600", bg: "bg-amber-50", trend: "+2" },
          { label: "Revenu Hebdo", value: (data.salesChart.reduce((a:any,b:any)=>a+b.value, 0)).toLocaleString() + " F", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+18%" },
        ].map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className={`${c.bg} p-3 rounded-xl`}>
                <c.icon className={c.color} size={24} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                {c.trend} <ArrowUpRight size={10} />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-black text-gray-900">{c.value}</h3>
              <p className="text-gray-500 text-sm font-medium mt-1">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sales Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-gray-800 text-lg">Flux de Ventes (FCFA)</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-xs text-gray-400 font-medium">Revenu Quotidien</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.salesChart}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{stroke: '#6366F1', strokeWidth: 2}}
                />
                <Area type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insight Panel */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-8 rounded-2xl text-white shadow-xl flex flex-col relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-20%] w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 text-indigo-200 bg-white/10 w-fit px-3 py-1.5 rounded-full text-sm font-bold border border-white/10">
              <BrainCircuit size={18} /> IA ANALYSYS LIVE
            </div>
            
            <h2 className="text-2xl font-bold leading-tight mb-4">
              Recommandations <br/><span className="text-indigo-300">Intelligentes</span>
            </h2>

            <div className="space-y-4 mb-8">
              <div className="bg-white/10 p-4 rounded-xl border border-white/5">
                <p className="text-indigo-100 text-sm leading-relaxed">
                  <span className="font-bold text-white block mb-1">Résumé</span>
                  {data.aiAnalysis.summary}
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/5">
                <p className="text-indigo-100 text-sm leading-relaxed">
                  <span className="font-bold text-white block mb-1">Observation</span>
                  {data.aiAnalysis.insight}
                </p>
              </div>
            </div>

            <div className="mt-auto bg-amber-400 p-4 rounded-xl text-indigo-950 flex items-center gap-3 shadow-lg transform hover:scale-105 transition-transform cursor-pointer">
              <Sparkles size={24} className="animate-pulse" />
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest opacity-70">Action Conseillée</p>
                <p className="text-sm font-bold">{data.aiAnalysis.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Stores List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Top Marchés (CA)</h3>
            <Filter size={18} className="text-gray-400" />
          </div>
          <div className="space-y-4">
            {data.topStores.map((s:any, i:number) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    {i+1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{s.name}</p>
                    <p className="text-xs text-gray-400">{s.orders} commandes traitées</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900">{s.revenue.toLocaleString()} F</p>
                  <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full" 
                      style={{ width: `${(s.revenue / data.topStores[0].revenue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Profiling (Mock Distribution) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Profilage Clients</h3>
            <Target size={18} className="text-gray-400" />
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full h-[200px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Nouveaux', value: 40 },
                      { name: 'Récurrents', value: 35 },
                      { name: 'VIP', value: 25 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4 w-full">
              {[
                { label: "Nouveaux Clients", val: "40%", color: "bg-indigo-500" },
                { label: "Clients Récurrents", val: "35%", color: "bg-emerald-500" },
                { label: "Clients VIP", val: "25%", color: "bg-amber-500" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${s.color}`}></div>
                    <span className="text-sm font-medium text-gray-600">{s.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{s.val}</span>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Conseil Segment</p>
                <p className="text-xs text-gray-600 mt-1">Les clients VIP commandent en moyenne 3.2x plus le week-end.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
