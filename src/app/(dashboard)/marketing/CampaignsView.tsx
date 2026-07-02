import { 
  Megaphone, Target, Zap, BarChart3, Search, Send, Sparkles 
} from "lucide-react"

const CAMPAIGNS = [
  { id: 1, title: "Promo Ramadan Fresh", target: "Tous les clients", status: "Planifié", reach: "12,450", date: "2026-04-10" },
  { id: 2, title: "Fidélité Weekend Plateaux", target: "Zones Plateau", status: "Actif", reach: "3,200", date: "En cours" },
  { id: 3, title: "Relance Inactifs", target: "Inactifs > 30j", status: "Terminé", reach: "5,800", date: "2026-03-25" },
]

export default function CampaignsView() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Target size={20} /></div>
            <span className="text-xs font-bold text-green-600">+12% ce mois</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">24,850</h3>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Audience Totale</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Zap size={20} /></div>
            <span className="text-xs font-bold text-indigo-600">Engagement 4.2%</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">1,043</h3>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">Clics Campagne (7j)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><BarChart3 size={20} /></div>
            <span className="text-xs font-bold text-amber-600">ROI x3.5</span>
          </div>
          <h3 className="text-2xl font-black text-gray-900">452,000 F</h3>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">CA Généré par Promo</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Campagnes Récentes</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Chercher..." className="pl-9 pr-4 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-rose-500/20" />
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {CAMPAIGNS.map(c => (
              <div key={c.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.status === 'Actif' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                    <Megaphone size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors">{c.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Cible : <span className="font-medium text-gray-700">{c.target}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{c.reach}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Portée</p>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${c.status === 'Actif' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                      {c.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{c.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 text-xs font-bold text-gray-400 hover:text-rose-600 uppercase tracking-widest bg-gray-50/50 transition-colors">
            Voir tout l'historique
          </button>
        </div>

        {/* Quick Tools */}
        <div className="space-y-6">
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl">
            <h4 className="font-bold text-lg mb-2">Notification Flash ⚡️</h4>
            <p className="text-indigo-100 text-xs mb-6 font-medium leading-relaxed">Envoyez instantanément une alerte push à tous vos nouveaux clients du jour.</p>
            <textarea 
              placeholder="Votre message ici..." 
              className="w-full h-24 bg-white/10 border border-white/20 rounded-xl p-3 text-sm text-white placeholder:text-indigo-300 outline-none focus:ring-2 focus:ring-amber-400 mb-4"
            ></textarea>
            <button className="w-full py-3 bg-amber-400 text-indigo-950 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-amber-300 transition-all shadow-lg hover:translate-y-[-2px]">
              <Send size={16} /> Envoyer Maintenant
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" /> IA Marketing Tips
            </h4>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-rose-500">
                <p className="text-[11px] font-bold text-rose-600 uppercase mb-1">Opportunité</p>
                <p className="text-xs text-gray-600 font-medium">Les commandes de fruits augmentent de 30% les mercredis matin à Dakar. Pensez à l'onglet Segmentation.</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border-l-4 border-indigo-500">
                <p className="text-[11px] font-bold text-indigo-600 uppercase mb-1">Ciblage</p>
                <p className="text-xs text-gray-600 font-medium">L'onglet Segmentation IA est disponible. Analysez vos clients inactifs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
