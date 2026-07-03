"use client"

import { useEffect, useState } from "react"
import { Star, MessageSquare, Loader2, ThumbsUp } from "lucide-react"

type Review = {
  id: string
  customerName: string
  rating: number
  comment: string | null
  createdAt: string
  reply: string | null
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className={i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  )
}

export default function MerchantReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [replyDraft, setReplyDraft] = useState<Record<string, string>>({})
  const [replying, setReplying] = useState<string | null>(null)

  useEffect(() => {
    loadReviews()
  }, [])

  async function loadReviews() {
    setLoading(true)
    try {
      const res = await fetch("/api/merchant/reviews")
      const data = await res.json()
      setReviews(res.ok ? data.reviews : [])
    } finally {
      setLoading(false)
    }
  }

  async function submitReply(id: string) {
    const reply = replyDraft[id]?.trim()
    if (!reply) return
    setReplying(id)
    try {
      const res = await fetch(`/api/merchant/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply }),
      })
      if (res.ok) {
        const { review } = await res.json()
        setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reply: review.reply } : r)))
      }
    } finally {
      setReplying(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Loader2 size={28} className="text-cyan-500 animate-spin" />
      </div>
    )
  }

  const avg = reviews.length ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "—"
  const dist = [5, 4, 3, 2, 1].map((s) => ({ stars: s, count: reviews.filter((r) => r.rating === s).length }))

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
            <Stars rating={Math.round(Number(avg) || 0)} />
            <div className="text-xs text-gray-400 mt-1">{reviews.length} avis</div>
          </div>
          <div className="flex-1 space-y-1.5">
            {dist.map((d) => (
              <div key={d.stars} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4">{d.stars}</span>
                <Star size={11} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${reviews.length ? (d.count / reviews.length) * 100 : 0}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-4">{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-400 text-sm">
            Aucune évaluation pour le moment.
          </div>
        )}
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold flex-shrink-0">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-800 text-sm">{review.customerName}</div>
                  <Stars rating={review.rating} />
                </div>
              </div>
              <div className="text-xs text-gray-400 flex-shrink-0">{new Date(review.createdAt).toLocaleDateString("fr-FR")}</div>
            </div>
            {review.comment && <p className="text-sm text-gray-600 mt-3 leading-relaxed">&quot;{review.comment}&quot;</p>}

            {review.reply ? (
              <div className="mt-3 p-3 bg-cyan-50 rounded-xl">
                <div className="flex items-center gap-1.5 text-xs text-cyan-700 font-semibold mb-1">
                  <ThumbsUp size={11} /> Votre réponse
                </div>
                <p className="text-sm text-gray-700">{review.reply}</p>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-3">
                <input
                  value={replyDraft[review.id] ?? ""}
                  onChange={(e) => setReplyDraft({ ...replyDraft, [review.id]: e.target.value })}
                  placeholder="Répondre à ce client..."
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <button
                  onClick={() => submitReply(review.id)}
                  disabled={replying === review.id}
                  className="text-xs text-cyan-600 bg-cyan-50 hover:bg-cyan-100 disabled:opacity-50 px-2.5 py-1.5 rounded-full flex items-center gap-1 transition-colors flex-shrink-0"
                >
                  <MessageSquare size={11} /> Répondre
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
