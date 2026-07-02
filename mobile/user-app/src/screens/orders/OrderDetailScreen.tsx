import React, { useState, useEffect, useRef } from "react"
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, Linking, Dimensions,
} from "react-native"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import { LOCATIONIQ_DIRECTIONS_URL, decodePolyline } from "../../constants/maps"
import { COLORS, FONTS, SPACING, RADIUS } from "../../constants/theme"

export default function OrderDetailScreen({ route, navigation }: any) {
  const { order: initialOrder } = route.params
  const [order, setOrder] = useState(initialOrder)
  const [loading, setLoading] = useState(false)
  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([])

  React.useEffect(() => {
    let interval: any
    if (order && order.status !== "DELIVERED" && order.status !== "CANCELLED") {
      interval = setInterval(fetchOrderUpdate, 10000) // Poll every 10s
    }
    return () => clearInterval(interval)
  }, [order?.status])

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") return
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
      setUserCoords(coords)

      // Destination mock (magasin — en production vient de l'objet order)
      const destLat = loc.coords.latitude + 0.015
      const destLng = loc.coords.longitude + 0.008

      // Calcul de la route via LocationIQ Directions API
      try {
        const url = LOCATIONIQ_DIRECTIONS_URL(loc.coords.latitude, loc.coords.longitude, destLat, destLng)
        const res = await fetch(url)
        const data = await res.json()
        if (data?.routes?.[0]?.geometry) {
          setRouteCoords(decodePolyline(data.routes[0].geometry))
        } else {
          setRouteCoords([coords, { latitude: destLat, longitude: destLng }])
        }
      } catch {
        setRouteCoords([coords, { latitude: destLat, longitude: destLng }])
      }
    })()
  }, [])

  const fetchOrderUpdate = async () => {
    try {
      const { ordersAPI } = await import("../../services/api")
      const res = await ordersAPI.getById(order.id || order._id)
      setOrder(res.data)
    } catch (e) {
      console.log("Error polling order", e)
    }
  }

  const getStepStatus = (status: string) => {
    const steps = [
      { id: 1, label: "Commande confirmée", icon: "✅", done: true },
      { id: 2, label: "En préparation", icon: "👨‍🍳", done: ["PREPARING", "READY", "PICKED_UP", "DELIVERED"].includes(status) },
      { id: 3, label: "Livreur assigné", icon: "🛵", done: ["PICKED_UP", "DELIVERED"].includes(status), active: ["ASSIGNED", "ACCEPTED"].includes(status) },
      { id: 4, label: "En route vers vous", icon: "📍", done: status === "DELIVERED", active: status === "PICKED_UP" },
      { id: 5, label: "Livré", icon: "🏠", done: status === "DELIVERED", active: status === "DELIVERED" },
    ]
    return steps
  }

  const STEPS = getStepStatus(order?.status || "PENDING")
  
  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Commande introuvable</Text>
      </View>
    )
  }

  const items = order.items || []
  const subtotal = items.reduce((sum: number, i: any) => sum + (i.price * (i.quantity || i.qty || 0)), 0)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Commande {order.id || order._id}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carte de suivi GPS (MapView) */}
        {userCoords ? (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: userCoords.latitude,
                longitude: userCoords.longitude,
                latitudeDelta: 0.03,
                longitudeDelta: 0.03,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
            >
              {/* Magasin */}
              <Marker coordinate={{ latitude: userCoords.latitude + 0.008, longitude: userCoords.longitude - 0.004 }} title="Magasin" pinColor="#f97316" />
              {/* Livreur */}
              <Marker coordinate={{ latitude: userCoords.latitude + 0.004, longitude: userCoords.longitude }} title="Livreur">
                <View style={styles.driverMarker}><Text style={{fontSize:18}}>🛵</Text></View>
              </Marker>
              {/* Vous */}
              <Marker coordinate={userCoords} title="Vous" pinColor={COLORS.primary} />
              {/* Route calculée via LocationIQ Directions API */}
              {routeCoords.length > 0 && (
                <Polyline coordinates={routeCoords} strokeColor={COLORS.primary} strokeWidth={4} lineDashPattern={[0]} />
              )}
            </MapView>
            <View style={styles.etaBadge}>
              <Text style={styles.etaBadgeText}>🕒 Arrivée estimée : <Text style={{fontWeight:"800"}}>12 min</Text></Text>
            </View>
          </View>
        ) : (
          <View style={[styles.trackingCard, {alignItems:"center", justifyContent:"center", minHeight:120}]}>
            <Text style={{fontSize:32}}>🛠️</Text>
            <Text style={[styles.cardTitle, {marginTop:8}]}>Localisation en cours...</Text>
            <Text style={{fontSize:FONTS.sizes.sm, color:COLORS.textSecondary}}>GPS requis pour voir la carte en direct</Text>
          </View>
        )}

        {/* Suivi en temps réel - Étapes */}
        <View style={styles.trackingCard}>
          <View style={{ marginBottom: SPACING.md }}>
            <Text style={styles.cardTitle}>🔑 Code de livraison : <Text style={{color: COLORS.primary, fontSize: 22}}>{order.deliveryPin || "----"}</Text></Text>
            <Text style={{fontSize: 11, color: COLORS.textSecondary, marginTop: 4}}>À donner au livreur uniquement à la réception du colis.</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
            <Text style={styles.cardTitle}>🛥 Suivi en temps réel</Text>
            {["PICKED_UP", "ACCEPTED", "ASSIGNED"].includes(order.status) && (
              <TouchableOpacity 
                style={styles.mapBtn} 
                onPress={() => navigation.navigate("ActiveDelivery", { order })}
              >
                <Text style={styles.mapBtnText}>📍 Voir carte</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.steps}>
            {STEPS.map((step, idx) => (
              <View key={step.id} style={styles.stepRow}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepDot, step.done && styles.stepDotDone, step.active && styles.stepDotActive]}>
                    <Text style={styles.stepDotText}>{step.done || step.active ? step.icon : ""}</Text>
                  </View>
                  {idx < STEPS.length - 1 && <View style={[styles.stepLine, step.done && styles.stepLineDone]} />}
                </View>
                <Text style={[styles.stepLabel, step.active && styles.stepLabelActive, step.done && styles.stepLabelDone]}>
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Livreur */}
        {order.driver ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Votre livreur</Text>
            <View style={styles.driverRow}>
              <View style={styles.driverAvatar}>
                <Text style={{ fontSize: 28 }}>🛵</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{order.driver.name}</Text>
                <Text style={styles.driverVehicle}>{order.driver.vehicle}</Text>
                <Text style={styles.driverRating}>⭐ {order.driver.rating}</Text>
              </View>
              <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${order.driver.phone}`)}>
                <Text style={{ fontSize: 22 }}>📞</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Livreur</Text>
            <Text style={styles.addressText}>Recherche d'un livreur...</Text>
          </View>
        )}

        {/* Adresse */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Adresse de livraison</Text>
          <View style={styles.addressRow}>
            <Text style={{ fontSize: 20 }}>📍</Text>
            <Text style={styles.addressText}>{order.address || "Dakar, Sénégal"}</Text>
          </View>
        </View>

        {/* Articles */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Articles commandés</Text>
          {items.map((item: any, idx: number) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemQty}>{item.quantity || item.qty}x</Text>
              <Text style={styles.itemName}>{item.name || item.product?.name || "Produit"}</Text>
              <Text style={styles.itemPrice}>{(item.price * (item.quantity || item.qty)).toLocaleString()} FCFA</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Récapitulatif</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total</Text>
            <Text style={styles.totalValue}>{subtotal.toLocaleString()} FCFA</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Livraison</Text>
            <Text style={styles.totalValue}>{(order.deliveryFee || 0).toLocaleString()} FCFA</Text>
          </View>
          <View style={[styles.totalRow, styles.totalRowFinal]}>
            <Text style={styles.totalFinalLabel}>Total</Text>
            <Text style={styles.totalFinalValue}>{order.total.toLocaleString()} FCFA</Text>
          </View>
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md, backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.grayMedium, gap: SPACING.sm,
  },
  backBtn: { marginRight: SPACING.sm },
  backIcon: { fontSize: 22, color: COLORS.text },
  title: { flex: 1, fontSize: FONTS.sizes.md, fontWeight: "800", color: COLORS.text },
  statusBadge: { backgroundColor: "#FFF3E0", borderRadius: RADIUS.round, paddingHorizontal: SPACING.sm, paddingVertical: 4 },
  statusText: { color: "#E65100", fontSize: FONTS.sizes.xs, fontWeight: "700" },
  mapContainer: {
    margin: SPACING.md, marginBottom: 0, borderRadius: RADIUS.lg, overflow: "hidden",
    height: Dimensions.get("window").width * 0.6,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
    position: "relative",
  },
  map: { width: "100%", height: "100%" },
  driverMarker: {
    backgroundColor: COLORS.white, borderRadius: 20, padding: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
  },
  etaBadge: {
    position: "absolute", bottom: 12, left: 12, right: 12,
    backgroundColor: "rgba(255,255,255,0.94)", borderRadius: RADIUS.md,
    paddingVertical: 8, paddingHorizontal: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3,
  },
  etaBadgeText: { fontSize: FONTS.sizes.sm, color: COLORS.text, textAlign: "center" },
  card: {
    backgroundColor: COLORS.white, margin: SPACING.md, marginBottom: 0,
    borderRadius: RADIUS.lg, padding: SPACING.lg,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  trackingCard: {
    backgroundColor: COLORS.white, margin: SPACING.md, marginBottom: 0,
    borderRadius: RADIUS.lg, padding: SPACING.lg,
    borderLeftWidth: 4, borderLeftColor: COLORS.primary,
  },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: "800", color: COLORS.text, marginBottom: 0 },
  mapBtn: { backgroundColor: COLORS.primary + "15", paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.primary + "30" },
  mapBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: "800" },
  eta: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginBottom: SPACING.md },
  etaTime: { color: COLORS.primary, fontWeight: "800" },
  steps: { gap: 0 },
  stepRow: { flexDirection: "row", alignItems: "flex-start", gap: SPACING.md },
  stepLeft: { alignItems: "center", width: 32 },
  stepDot: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.grayLight,
    alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: COLORS.grayMedium,
  },
  stepDotDone: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  stepDotActive: { backgroundColor: COLORS.secondary, borderColor: COLORS.secondary },
  stepDotText: { fontSize: 14 },
  stepLine: { width: 2, height: 24, backgroundColor: COLORS.grayMedium, marginTop: 2 },
  stepLineDone: { backgroundColor: COLORS.primary },
  stepLabel: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, paddingTop: 6, paddingBottom: SPACING.md },
  stepLabelActive: { color: COLORS.secondary, fontWeight: "700" },
  stepLabelDone: { color: COLORS.text, fontWeight: "600" },
  driverRow: { flexDirection: "row", alignItems: "center", gap: SPACING.md },
  driverAvatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: "#EDE7F6", alignItems: "center", justifyContent: "center",
  },
  driverInfo: { flex: 1 },
  driverName: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.text },
  driverVehicle: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  driverRating: { fontSize: FONTS.sizes.xs, color: COLORS.text, marginTop: 2 },
  callBtn: {
    width: 48, height: 48, borderRadius: RADIUS.round,
    backgroundColor: "#E8F5E9", alignItems: "center", justifyContent: "center",
  },
  addressRow: { flexDirection: "row", gap: SPACING.sm, alignItems: "flex-start" },
  addressText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text, lineHeight: 20 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.grayMedium, gap: SPACING.sm },
  itemQty: { width: 28, fontSize: FONTS.sizes.sm, fontWeight: "700", color: COLORS.primary },
  itemName: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.text },
  itemPrice: { fontSize: FONTS.sizes.sm, fontWeight: "600", color: COLORS.text },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  totalRowFinal: { marginTop: SPACING.sm, paddingTop: SPACING.sm, borderTopWidth: 1, borderTopColor: COLORS.grayMedium },
  totalLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  totalValue: { fontSize: FONTS.sizes.sm, color: COLORS.text },
  totalFinalLabel: { fontSize: FONTS.sizes.md, fontWeight: "800", color: COLORS.text },
  totalFinalValue: { fontSize: FONTS.sizes.md, fontWeight: "800", color: COLORS.primary },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
})
