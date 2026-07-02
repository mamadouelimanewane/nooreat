import React, { useEffect, useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import { COLORS, FONTS, SPACING, RADIUS } from "../../constants/theme"
import { ordersAPI } from "../../services/api"

const TABS = ["Tous", "En cours", "Livré", "Annulé"]

export default function OrdersScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState("Tous")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const res = await ordersAPI.getAll()
      setOrders(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filtered = orders.filter(
    (o) => activeTab === "Tous" || o.status.toLowerCase().includes(activeTab.toLowerCase().replace("en cours", "pending").replace("livré", "delivered").replace("annulé", "cancelled"))
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Commandes</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id || i._id}
        refreshing={loading}
        onRefresh={fetchOrders}
        contentContainerStyle={{ padding: SPACING.lg, gap: SPACING.md }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => navigation.navigate("OrderDetail", { order: item })}
          >
            <View style={styles.orderHeader}>
              <View style={styles.orderIdRow}>
                <Text style={styles.orderId}>{item.id || item._id}</Text>
                <View style={[styles.statusBadge, { backgroundColor: (item.statusColor || COLORS.info) + "20" }]}>
                  <Text style={[styles.statusText, { color: item.statusColor || COLORS.info }]}>
                    {item.emoji || "📦"} {item.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.orderDate}>{item.date}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.orderBody}>
              <Text style={styles.storeName}>🏪 {item.store?.name || item.storeName || "Boutique"}</Text>
              <Text style={styles.orderItems}>{item.items?.length || item.itemCount || 0} article{(item.items?.length || 0) > 1 ? "s" : ""}</Text>
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.orderTotal}>{item.total.toLocaleString()} FCFA</Text>
              {item.status === "Livré" && (
                <TouchableOpacity 
                  style={styles.reorderBtn}
                  onPress={() => Alert.alert("Recommander", "Cette commande a été ajoutée à votre panier")}
                >
                  <Text style={styles.reorderText}>↺ Recommander</Text>
                </TouchableOpacity>
              )}
              {(item.status === "En cours" || item.status === "Deliverign" || item.status === "Pending") && (
                <TouchableOpacity 
                  style={styles.trackBtn}
                  onPress={() => navigation.navigate("OrderDetail", { order: item })}
                >
                  <Text style={styles.trackText}>📍 Suivre</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📦</Text>
            <Text style={styles.emptyText}>Aucune commande</Text>
            <Text style={styles.emptySubtext}>Vos commandes apparaîtront ici</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    paddingHorizontal: SPACING.lg, paddingTop: 56, paddingBottom: SPACING.md,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.grayMedium,
  },
  title: { fontSize: FONTS.sizes.xl, fontWeight: "800", color: COLORS.text },
  tabs: {
    flexDirection: "row", backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, gap: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.md, paddingVertical: 7,
    borderRadius: RADIUS.round, backgroundColor: COLORS.grayLight,
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.sm, fontWeight: "600", color: COLORS.textSecondary },
  tabTextActive: { color: COLORS.white },
  orderCard: {
    backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  orderHeader: { gap: 4 },
  orderIdRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.text },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: "700" },
  orderDate: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  divider: { height: 1, backgroundColor: COLORS.grayMedium, marginVertical: SPACING.sm },
  orderBody: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  storeName: { fontSize: FONTS.sizes.sm, fontWeight: "600", color: COLORS.text },
  orderItems: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  orderFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: SPACING.sm },
  orderTotal: { fontSize: FONTS.sizes.lg, fontWeight: "800", color: COLORS.primary },
  reorderBtn: {
    backgroundColor: COLORS.primaryLight + "20", borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.md, paddingVertical: 6,
  },
  reorderText: { color: COLORS.primary, fontSize: FONTS.sizes.xs, fontWeight: "700" },
  trackBtn: {
    backgroundColor: COLORS.warning + "20", borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.md, paddingVertical: 6,
  },
  trackText: { color: COLORS.warning, fontSize: FONTS.sizes.xs, fontWeight: "700" },
  empty: { alignItems: "center", paddingTop: 80, gap: SPACING.sm },
  emptyEmoji: { fontSize: 60 },
  emptyText: { fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.text },
  emptySubtext: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
})
