import React, { useCallback, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { useDriverStore } from "../../store/useDriverStore"
import { earningsAPI } from "../../services/api"

const PERIODS = ["Aujourd'hui", "Semaine"]

type WeekPoint = { label: string; earnings: number; orders: number }
type HistoryTx = { id: string; description: string | null; amount: number; createdAt: string }

export default function EarningsScreen() {
  const { driver } = useDriverStore()
  const [activePeriod, setActivePeriod] = useState(0)
  const [todayEarnings, setTodayEarnings] = useState(0)
  const [todayOrders, setTodayOrders] = useState(0)
  const [weekSeries, setWeekSeries] = useState<WeekPoint[]>([])
  const [history, setHistory] = useState<HistoryTx[]>([])

  useFocusEffect(
    useCallback(() => {
      earningsAPI.getSummary().then((res) => {
        setTodayEarnings(res.data.todayEarnings)
        setTodayOrders(res.data.todayOrders)
        setWeekSeries(res.data.weekSeries)
      })
      earningsAPI.getHistory().then((res) => setHistory(res.data))
    }, [])
  )

  const maxEarning = Math.max(1, ...weekSeries.map((d) => d.earnings))
  const weekTotal = weekSeries.reduce((s, d) => s + d.earnings, 0)
  const weekOrders = weekSeries.reduce((s, d) => s + d.orders, 0)

  const totalDisplayed = activePeriod === 0 ? todayEarnings : weekTotal
  const ordersDisplayed = activePeriod === 0 ? todayOrders : weekOrders

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Period selector */}
      <View style={styles.periodSelector}>
        {PERIODS.map((p, i) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodBtn, activePeriod === i && styles.periodBtnActive]}
            onPress={() => setActivePeriod(i)}
          >
            <Text style={[styles.periodBtnText, activePeriod === i && styles.periodBtnTextActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Main KPI */}
      <View style={styles.mainKpi}>
        <Text style={styles.kpiLabel}>Total des gains</Text>
        <Text style={styles.kpiValue}>{totalDisplayed.toLocaleString()} FCFA</Text>
        <Text style={styles.kpiSub}>{ordersDisplayed} livraisons</Text>
      </View>

      {/* Sub stats */}
      <View style={styles.subStatsRow}>
        <View style={styles.subStat}>
          <Text style={styles.subStatValue}>
            {ordersDisplayed > 0 ? Math.round(totalDisplayed / ordersDisplayed) : 0} FCFA
          </Text>
          <Text style={styles.subStatLabel}>Gain moyen</Text>
        </View>
        <View style={[styles.subStat, styles.subStatMiddle]}>
          <Text style={styles.subStatValue}>{ordersDisplayed}</Text>
          <Text style={styles.subStatLabel}>Livraisons</Text>
        </View>
        <View style={styles.subStat}>
          <Text style={styles.subStatValue}>{driver?.rating ?? "—"} ⭐</Text>
          <Text style={styles.subStatLabel}>Note moy.</Text>
        </View>
      </View>

      {/* Weekly bar chart */}
      {activePeriod === 1 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Gains de la semaine</Text>
          {weekSeries.length === 0 ? (
            <Text style={styles.emptyText}>Aucun gain sur les 7 derniers jours.</Text>
          ) : (
            <View style={styles.chartBars}>
              {weekSeries.map((d) => (
                <View key={d.label} style={styles.barWrapper}>
                  <Text style={styles.barValue}>{(d.earnings / 1000).toFixed(1)}k</Text>
                  <View style={styles.barContainer}>
                    <View
                      style={[
                        styles.bar,
                        { height: Math.max(10, (d.earnings / maxEarning) * 100) },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{d.label}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {/* History */}
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Historique récent</Text>
        {history.length === 0 && <Text style={styles.emptyText}>Aucune livraison rémunérée pour le moment.</Text>}
        {history.map((item) => (
          <View key={item.id} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <Text style={styles.historyId}>{item.description}</Text>
              <Text style={styles.historyDate}>
                {new Date(item.createdAt).toLocaleDateString("fr-FR")} {new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
            <Text style={styles.historyAmount}>+{item.amount} FCFA</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5FA" },
  periodSelector: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#E8E8F5",
    borderRadius: 12,
    padding: 4,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 10,
  },
  periodBtnActive: { backgroundColor: "#6B6BD5" },
  periodBtnText: { fontSize: 13, color: "#888", fontWeight: "600" },
  periodBtnTextActive: { color: "#fff" },
  mainKpi: {
    margin: 16,
    marginTop: 0,
    backgroundColor: "#6B6BD5",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  kpiLabel: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 6 },
  kpiValue: { fontSize: 32, fontWeight: "800", color: "#fff" },
  kpiSub: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 6 },
  subStatsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  subStat: {
    flex: 1,
    padding: 14,
    alignItems: "center",
  },
  subStatMiddle: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#F0F0F0",
  },
  subStatValue: { fontSize: 15, fontWeight: "700", color: "#1A1A2E" },
  subStatLabel: { fontSize: 11, color: "#888", marginTop: 4 },
  chartCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  chartTitle: { fontSize: 15, fontWeight: "700", color: "#333", marginBottom: 20 },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 130,
    gap: 6,
  },
  barWrapper: { flex: 1, alignItems: "center" },
  barValue: { fontSize: 9, color: "#888", marginBottom: 4 },
  barContainer: {
    width: "100%",
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: "70%",
    backgroundColor: "#6B6BD5",
    borderRadius: 4,
    minHeight: 10,
  },
  barLabel: { fontSize: 10, color: "#888", marginTop: 6 },
  historySection: { marginHorizontal: 16 },
  historyTitle: { fontSize: 15, fontWeight: "700", color: "#333", marginBottom: 12 },
  emptyText: { fontSize: 13, color: "#999", fontStyle: "italic" },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  historyLeft: { flex: 1 },
  historyId: { fontSize: 13, fontWeight: "600", color: "#333" },
  historyDate: { fontSize: 11, color: "#999", marginTop: 2 },
  historyAmount: { fontSize: 15, fontWeight: "700", color: "#4CAF50" },
})
