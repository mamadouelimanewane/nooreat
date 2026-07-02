import React, { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  Dimensions,
} from "react-native"
import { useDriverStore } from "../../store/useDriverStore"
import { COLORS, RADIUS } from "../../constants/theme"

const { width } = Dimensions.get("window")

export default function HomeScreen({ navigation }: any) {
  const {
    driver,
    isOnline,
    toggleOnline,
    pendingOrders,
    currentOrder,
    todayEarnings,
    todayOrders,
    acceptOrder,
  } = useDriverStore()

  const handleAccept = (order: any) => {
    acceptOrder(order)
    navigation.navigate("ActiveDelivery")
  }

  return (
    <View style={styles.container}>
      {/* Header Premium */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerUserInfo}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{driver?.name?.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Bonjour, {driver?.name?.split(" ")[0]}</Text>
              <Text style={styles.subGreeting}>{driver?.vehicleType} · ⭐ {driver?.rating}</Text>
            </View>
          </View>
          <View style={styles.onlineStatus}>
            <Text style={[styles.onlineLabel, { color: isOnline ? COLORS.success : COLORS.gray }]}>
              {isOnline ? "EN LIGNE" : "HORS LIGNE"}
            </Text>
            <Switch
              value={isOnline}
              onValueChange={toggleOnline}
              trackColor={{ false: COLORS.grayMedium, true: COLORS.primaryLight }}
              thumbColor={isOnline ? COLORS.primary : COLORS.white}
            />
          </View>
        </View>

        {/* Stats Row Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: "#EEF2FF" }]}>
              <Text style={{ fontSize: 18 }}>💰</Text>
            </View>
            <Text style={styles.statValue}>{todayEarnings.toLocaleString()} F</Text>
            <Text style={styles.statLabel}>Gains du jour</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: "#ECFDF5" }]}>
              <Text style={{ fontSize: 18 }}>🛵</Text>
            </View>
            <Text style={styles.statValue}>{todayOrders}</Text>
            <Text style={styles.statLabel}>Livraisons</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: "#FFFBEB" }]}>
              <Text style={{ fontSize: 18 }}>📢</Text>
            </View>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Acceptation</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Active Delivery Focus */}
        {currentOrder && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Livraison en cours</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.activeOrderCard}
              onPress={() => navigation.navigate("ActiveDelivery")}
            >
              <View style={styles.activeOrderGlow} />
              <View style={styles.activeOrderContent}>
                <View style={styles.activeOrderHeader}>
                  <Text style={styles.activeOrderId}>ID: {currentOrder.id.slice(-6)}</Text>
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>
                      {currentOrder.status === "accepted" ? "À COLLECTER" : "EN CHEMIN"}
                    </Text>
                  </View>
                </View>
                <View style={styles.routeContainer}>
                  <View style={styles.routeLine}>
                    <View style={[styles.routeDot, { backgroundColor: COLORS.white }]} />
                    <View style={styles.routeDashedLine} />
                    <View style={[styles.routeDot, { backgroundColor: COLORS.white, opacity: 0.5 }]} />
                  </View>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeAddr} numberOfLines={1}>{currentOrder.storeAddress}</Text>
                    <Text style={[styles.routeAddr, { marginTop: 14 }]} numberOfLines={1}>{currentOrder.deliveryAddress}</Text>
                  </View>
                </View>
                <Text style={styles.viewAction}>Reprendre la navigation →</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Requests List */}
        {isOnline && pendingOrders.length > 0 && !currentOrder && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nouvelles demandes</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{pendingOrders.length}</Text>
              </View>
            </View>
            {pendingOrders.map((order) => (
              <View key={order.id} style={styles.requestCard}>
                {order.isBatched && (
                  <View style={{ backgroundColor: "#FEF3C7", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: COLORS.border }}>
                    <Text style={{ marginRight: 6 }}>🔄</Text>
                    <Text style={{ fontSize: 12, fontWeight: "800", color: "#B45309" }}>
                      TRAJET GROUPÉ : {order.batchedOrdersCount} commandes sur la même route
                    </Text>
                  </View>
                )}
                <View style={[styles.requestMain, order.isBatched && { backgroundColor: "#FFFBEB" }]}>
                  <View style={styles.requestHeader}>
                    <Text style={styles.requestId}>{order.isBatched ? "Commandes Multiples" : `Commande #${order.id.slice(-4)}`}</Text>
                    <Text style={styles.requestEarnings}>+{order.earnings} FCFA</Text>
                  </View>
                  <View style={styles.requestRoute}>
                    <View style={styles.requestStop}>
                      <Text style={styles.stopIcon}>🏪</Text>
                      <Text style={styles.stopText} numberOfLines={1}>{order.storeAddress}</Text>
                    </View>
                    <View style={styles.requestStop}>
                      <Text style={styles.stopIcon}>🏠</Text>
                      <Text style={styles.stopText} numberOfLines={1}>{order.deliveryAddress}</Text>
                    </View>
                  </View>
                  <View style={styles.requestMeta}>
                    <Text style={styles.metaLabel}>📏 {order.distance}</Text>
                    <Text style={styles.metaLabel}>📦 {order.items} art.</Text>
                  </View>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity activeOpacity={0.7} style={styles.acceptBtn} onPress={() => handleAccept(order)}>
                    <Text style={styles.acceptBtnText}>
                      {order.isBatched ? `ACCEPTER LES ${order.batchedOrdersCount} MISSIONS` : "ACCEPTER LA MISSION"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Empty State */}
        {isOnline && pendingOrders.length === 0 && !currentOrder && (
          <View style={styles.emptyContainer}>
            <View style={styles.radarCircle}>
              <View style={styles.radarPulse} />
              <Text style={{ fontSize: 40 }}>📡</Text>
            </View>
            <Text style={styles.emptyTitle}>Recherche de missions...</Text>
            <Text style={styles.emptyDesc}>Restez dans une zone animée pour augmenter vos chances.</Text>
          </View>
        )}

        {!isOnline && (
          <View style={styles.offlineContainer}>
            <Text style={{ fontSize: 48, marginBottom: 20 }}>💤</Text>
            <Text style={styles.emptyTitle}>Vous êtes en pause</Text>
            <Text style={styles.emptyDesc}>Activez votre statut pour commencer à gagner de l'argent.</Text>
            <TouchableOpacity activeOpacity={0.8} style={styles.goOnlineBtn} onPress={toggleOnline}>
              <Text style={styles.goOnlineText}>PASSER EN LIGNE</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 5,
    zIndex: 10,
  },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerUserInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.round,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.white, fontSize: 20, fontWeight: "800" },
  greeting: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  subGreeting: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  onlineStatus: { alignItems: "flex-end", gap: 4 },
  onlineLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 0.5 },
  statsContainer: { flexDirection: "row", gap: 12, marginTop: 24 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.grayLight,
    padding: 12,
    borderRadius: RADIUS.md,
    alignItems: "flex-start",
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 15, fontWeight: "800", color: COLORS.text },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2, fontWeight: "600" },
  scrollContent: { flex: 1, paddingHorizontal: 20 },
  section: { marginTop: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: COLORS.text },
  countBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.round,
  },
  countText: { color: COLORS.white, fontSize: 10, fontWeight: "800" },
  activeOrderCard: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  activeOrderGlow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  activeOrderContent: { padding: 20 },
  activeOrderHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  activeOrderId: { color: COLORS.white, fontWeight: "800", fontSize: 14 },
  activeBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.round },
  activeBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: "900" },
  routeContainer: { flexDirection: "row", gap: 14 },
  routeLine: { alignItems: "center", paddingVertical: 4 },
  routeDot: { width: 8, height: 8, borderRadius: 4 },
  routeDashedLine: { width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.3)", marginVertical: 4 },
  routeInfo: { flex: 1 },
  routeAddr: { color: COLORS.white, fontSize: 14, fontWeight: "600" },
  viewAction: { color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: "700", textAlign: "right", marginTop: 16 },
  requestCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: "hidden",
  },
  requestMain: { padding: 16 },
  requestHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  requestId: { fontSize: 14, fontWeight: "700", color: COLORS.textSecondary },
  requestEarnings: { fontSize: 18, fontWeight: "800", color: COLORS.success },
  requestRoute: { gap: 10 },
  requestStop: { flexDirection: "row", alignItems: "center", gap: 10 },
  stopIcon: { fontSize: 16 },
  stopText: { fontSize: 13, fontWeight: "600", color: COLORS.text, flex: 1 },
  requestMeta: { flexDirection: "row", gap: 12, marginTop: 14 },
  metaLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600", backgroundColor: COLORS.grayLight, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  requestActions: { borderTopWidth: 1, borderTopColor: COLORS.border },
  acceptBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, alignItems: "center" },
  acceptBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 13, letterSpacing: 0.5 },
  emptyContainer: { alignItems: "center", justifyContent: "center", paddingTop: 80 },
  radarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  radarPulse: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
    opacity: 0.2,
  },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text, marginBottom: 8 },
  emptyDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: "center", paddingHorizontal: 40, lineHeight: 20 },
  offlineContainer: { alignItems: "center", justifyContent: "center", paddingTop: 60 },
  goOnlineBtn: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: RADIUS.round,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  goOnlineText: { color: COLORS.white, fontWeight: "800", fontSize: 14 },
})
