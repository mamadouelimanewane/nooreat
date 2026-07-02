"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Users, TrendingUp, Target, Zap, Bot, Send, Mail, Smartphone, Loader2 } from "lucide-react"

export default function ProfilingView() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/marketing/ai-profiling")
      .then(res => res.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(e => {
        console.error(e)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Bot size={48} className="text-blue-600 animate-bounce relative z-10" />
        </div>
        <p className="mt-6 text-gray-500 font-medium animate-pulse">L'IA de NOOR EAT analyse vos données clients...</p>
      </div>
    )
  }

  if (!data) return <div className="text-center py-20 text-gray-500">Erreur de chargement des données.</div>

  const IconForAction = (type: string) => {
    if (type === "sms") return <Smartphone size={16} />
    if (type === "email") return <Mail size={16} />
    return <Send size={16} />
  }

  return (
    <div className="space-y-6">
      {/* KPI Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] bg-blue-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users size={18} /></div>
            <p className="text-xs font-bold text-gray-500 uppercase">Base Clients</p>
          </div>
          <p className="text-2xl font-black text-gray-900 relative z-10">{data.metrics.totalCustomers}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] bg-green-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={18} /></div>
            <p className="text-xs font-bold text-gray-500 uppercase">Valeur Vie (LTV Moyen)</p>
          </div>
          <p className="text-2xl font-black text-gray-900 relative z-10">{data.metrics.avgLTV.toLocaleString()} FCFA</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute right-[-20px] top-[-20px] bg-purple-50 w-24 h-24 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center gap-3 mb-2 relative z-10">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Target size={18} /></div>
            <p className="text-xs font-bold text-gray-500 uppercase">Taux de Rétention</p>
          </div>
          <p className="text-2xl font-black text-gray-900 relative z-10">{data.metrics.retentionRate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFM Segmentation Chart */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
          <h3 className="font-bold text-gray-800 mb-2">Segmentation RFM</h3>
          <p className="text-xs text-gray-500 mb-6">Répartition de la base client (Récence, Fréquence, Montant)</p>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.segmentsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.segmentsData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: any, name: any) => [`${value} clients`, name]}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white shadow-lg shadow-purple-200">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Copilote Marketing IA</h3>
              <p className="text-sm text-gray-500">Recommandations stratégiques basées sur vos données</p>
            </div>
          </div>

          <div className="grid gap-4">
            {data.insights.map((insight: any) => (
              <div key={insight.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center group hover:border-indigo-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider ${
                      insight.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {insight.priority} Priority
                    </span>
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] uppercase font-bold">
                      Cible: {insight.targetSegment}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-md">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed">{insight.content}</p>
                </div>
                
                <button className="flex-shrink-0 w-full sm:w-auto px-4 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 group-hover:shadow-md shadow-indigo-200">
                  {IconForAction(insight.actionType)}
                  Générer {insight.actionType === "sms" ? "le SMS" : insight.actionType === "email" ? "l'Email" : "la Campagne"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer RFM Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-800">Échantillon Clients Profilés</h3>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Top 50 récents</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/50 border-b border-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-500 text-xs tracking-wider">CLIENT</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-500 text-xs tracking-wider">CONTACT</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-500 text-xs tracking-wider">SEGMENT</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-500 text-xs tracking-wider">RÉCENCE</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-500 text-xs tracking-wider">FRÉQUENCE</th>
                <th className="px-6 py-3 text-right font-semibold text-gray-500 text-xs tracking-wider">MONTANT (LTV)</th>
                <th className="px-6 py-3 text-center font-semibold text-gray-500 text-xs tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.userStats.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{u.phone || u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${
                      u.segment === 'VIP' ? 'bg-purple-100 text-purple-700' :
                      u.segment === 'Fidèle' ? 'bg-green-100 text-green-700' :
                      u.segment === 'À risque' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {u.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600">{u.rfm.recency} j</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-700">{u.rfm.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-blue-600">
                    {u.rfm.monetary.toLocaleString()} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors">
                      <Zap size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.userStats.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">Aucune donnée client trouvée.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
