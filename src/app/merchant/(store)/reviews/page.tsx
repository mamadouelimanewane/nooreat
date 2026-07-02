"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Star, MessageSquare, Loader2, ThumbsUp } from "lucide-react"

const reviews = [
  { id: 1, customer: "Amadou Diallo", rating: 5, comment: "Excellent service ! La nourriture était délicieuse et la livraison très rapide.", date: "16/03/2026", order: "#1040", replied: false },
  { id: 2, customer: "Fatou Sarr", rating: 4, comment: "Très bon plat, légèrement en retard mais la qualité était au rendez-vous.", date: "15/03/2026", order: "#1035", replied: true },
  { id: 3, customer: "Moussa Ba", rating: 5, comment: "Le meilleur thiébou dieun que j'ai jamais goûté ! Je recommande vivement.", date: "15/03/2026", order: "#1034", replied: false },
  { id: 4, customer: "Aïssatou Fall", rating: 3, comment: "Commande correcte mais le yassa était un peu froid à la livraison.", date: "14/03/2026", order: "#1030", replied: false },
  { id: 5, customer: "Omar Ndiaye", rating: 5, comment: "Parfait ! Portions généreuses et saveurs authentiques.", date: "14/03/2026", order: "#1029", replied: true },
  { id: 6, customer: "Mariama Diallo", rating: 2, comment: "Déçue, la commande n'était pas complète. Manquait le jus.", date: "13/03/2026", order: "#1025", replied: true },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  )
}

function ReviewsContent() {
  const searchParams = useSearchParams()
  const storeId = searchParams.get("store") ?? "1"

  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  const dist = [5,4,3,2,1].map(s => ({ stars: s, count: reviews.filter(r => r.rating === s).length }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Évaluations clients</h1>
        <p className="text-sm text-gray-500">{reviews.length} évaluations au total</p>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex gap-6 items-center">
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800">{avg}</div>
            <Stars rating={Math.round(Number(avg))} />
            <div className="text-xs text-gray-400 mt-1">{reviews.length} avis</div>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map(d => (
              <div key={d.stars} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">{d.stars}</span>
                <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(d.count / reviews.length) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-4">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.map(review => (
          <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold flex-shrink-0">
                  {review.customer.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{review.customer}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Stars rating={review.rating} />
                    <span className="text-xs text-gray-400">Commande {review.order}</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">{review.date}</div>
            </div>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">&quot;{review.comment}&quot;</p>
            <div className="flex items-center gap-2 mt-3">
              {review.replied ? (
                <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <ThumbsUp size={11} /> Répondu
                </span>
              ) : (
                <button className="text-xs text-cyan-600 bg-cyan-50 hover:bg-cyan-100 px-2.5 py-1 rounded-full flex items-center gap-1 transition-colors">
                  <MessageSquare size={11} /> Répondre
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MerchantReviewsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center pt-20"><Loader2 size={28} className="text-cyan-500 animate-spin" /></div>}>
      <ReviewsContent />
    </Suspense>
  )
}
