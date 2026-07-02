import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // 1. Fetch raw data from DB
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      }
    })

    const orders = await prisma.order.findMany({
      where: { status: "Completed" },
      select: {
        id: true,
        userId: true,
        total: true,
        createdAt: true,
      }
    })

    // 2. Pre-process RFM values per user
    const now = new Date()
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

    let vipCount = 0
    let regularCount = 0
    let atRiskCount = 0
    let inactiveCount = 0

    let totalLTV = 0 // Life Time Value

    const userStats = users.map(user => {
      const uOrders = orders.filter(o => o.userId === user.id)
      
      const frequency = uOrders.length
      const monetary = uOrders.reduce((sum, o) => sum + o.total, 0)
      
      let recency = 9999
      if (uOrders.length > 0) {
        // Find most recent order
        const lastOrderDate = uOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0].createdAt
        recency = Math.floor((now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24))
      } else {
        recency = Math.floor((now.getTime() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24))
      }

      totalLTV += monetary

      // Basic Profiling Logic
      let segment = "Inactif"
      if (frequency >= 5 && monetary > 50000 && recency < 30) {
        segment = "VIP"
        vipCount++
      } else if (frequency >= 2 && recency < 45) {
        segment = "Fidèle"
        regularCount++
      } else if (frequency > 0 && recency >= 45 && recency <= 90) {
        segment = "À risque"
        atRiskCount++
      } else {
        segment = "Inactif"
        inactiveCount++
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        segment,
        rfm: { recency, frequency, monetary }
      }
    })

    // 3. Prepare AI Insights (Mocked logic representing an LLM summarization of the DB context)
    const insights = [
      {
        id: "insight-1",
        title: "Relance Inactifs",
        content: `Vous avez ${inactiveCount} clients inactifs. Nous suggérons l'envoi d'un SMS contenant un code promo de 10% valable ce weekend.`,
        actionType: "sms",
        targetSegment: "Inactif",
        priority: "High"
      },
      {
        id: "insight-2",
        title: "Récompenser les VIP",
        content: `Vos ${vipCount} clients VIP représentent un CA majeur. Proposez-leur la livraison gratuite sur leur prochaine commande via l'application.`,
        actionType: "push",
        targetSegment: "VIP",
        priority: "Medium"
      },
      {
        id: "insight-3",
        title: "Sauvetage À risque",
        content: `Attention, ${atRiskCount} clients fidèles qui achetaient régulièrement n'ont rien commandé depuis plus de 45 jours.`,
        actionType: "email",
        targetSegment: "À risque",
        priority: "High"
      }
    ]

    const totalCustomers = users.length
    const avgLTV = totalCustomers > 0 ? totalLTV / totalCustomers : 0

    return NextResponse.json({
      segmentsData: [
        { name: "VIP", value: vipCount, fill: "#8b5cf6" }, // Purple
        { name: "Fidèles", value: regularCount, fill: "#10b981" }, // Green
        { name: "À Risque", value: atRiskCount, fill: "#f59e0b" }, // Orange
        { name: "Inactifs", value: inactiveCount, fill: "#ef4444" }, // Red
      ],
      metrics: {
        totalCustomers,
        avgLTV: Math.round(avgLTV),
        conversionRate: "18.5%", // Would normally require web session tracking
        retentionRate: `${totalCustomers > 0 ? Math.round(((vipCount + regularCount) / totalCustomers) * 100) : 0}%`,
      },
      insights,
      userStats: userStats.slice(0, 50) // Return top 50 for the table to avoid massive payload
    })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
