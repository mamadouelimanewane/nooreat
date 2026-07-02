import React, { useState, useEffect } from "react"
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Linking, Dimensions
} from "react-native"
import * as Location from "expo-location"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import { LOCATIONIQ_DIRECTIONS_URL, decodePolyline } from "../../constants/maps"
import { useDriverStore } from "../../store/useDriverStore"

const STEPS = [
  { key: "accepted", label: "Aller au magasin", icon: "🏪", desc: "En route vers le point de collecte" },
  { key: "pickedup", label: "Commande récupérée", icon: "📦", desc: "En route vers le client" },
  { key: "delivered", label: "Livraison confirmée", icon: "✅", desc: "Commande livrée avec succès" },
]

export default function ActiveDeliveryScreen({ navigation }: any) {
  const { currentOrder, setCurrentOrder, completeDelivery } = useDriverStore()
  const [step, setStep] = useState(0)

  if (!currentOrder) {
    navigation.goBack()
    return null
  }

  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([])

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert("Permission GPS refusée", "Veuillez autoriser la géolocalisation pour un suivi optimal.")
        return
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      setLocation(loc)

      // Coordonnées mock du magasin et client (en production: viennent de la commande)
      const storeLat = loc.coords.latitude + 0.01
      const storeLng = loc.coords.longitude - 0.005
      const clientLat = loc.coords.latitude + 0.02
      const clientLng = loc.coords.longitude + 0.01

      // Calcul du trajet via LocationIQ Directions API
      try {
        const url = LOCATIONIQ_DIRECTIONS_URL(loc.coords.latitude, loc.coords.longitude, clientLat, clientLng)
        const res = await fetch(url)
        const data = await res.json()
        if (data?.routes?.[0]?.geometry) {
          setRouteCoords(decodePolyline(data.routes[0].geometry))
        } else {
          // Fallback si API indisponible
          setRouteCoords([
            { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
            { latitude: storeLat, longitude: storeLng },
            { latitude: clientLat, longitude: clientLng },
          ])
        }
      } catch {
        setRouteCoords([
          { latitude: loc.coords.latitude, longitude: loc.coords.longitude },
          { latitude: storeLat, longitude: storeLng },
          { latitude: clientLat, longitude: clientLng },
        ])
      }
    })()
  }, [])

  const handleNextStep = async () => {
    try {
      const { ordersAPI } = await import("../../services/api")
      if (step === 0) {
        await ordersAPI.updateStatus(currentOrder.id, "PICKED_UP")
        setCurrentOrder({ ...currentOrder, status: "pickedup" })
        setStep(1)
      } else if (step === 1) {
        await ordersAPI.updateStatus(currentOrder.id, "DELIVERED")
        setCurrentOrder({ ...currentOrder, status: "delivered" })
        setStep(2)
      } else {
        Alert.alert(
          "Livraison confirmée !",
          `Vous avez gagné ${currentOrder.earnings} FCFA pour cette livraison.`,
          [
            {
              text: "Super !",
              onPress: () => {
                completeDelivery()
                navigation.navigate("Home")
              },
            },
          ]
        )
      }
    } catch (e: any) {
      Alert.alert("Erreur", "Impossible de mettre à jour le statut. " + e.message)
    }
  }

  const callCustomer = () => {
    Linking.openURL(`tel:${currentOrder.customerPhone}`)
  }

  const openMaps = (address: string) => {
    const encoded = encodeURIComponent(address)
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encoded}`)
  }

  const stepLabels = ["Récupérer", "Récupéré ✓", "Livré ✓"]
  const btnColors = ["#FF9800", "#6B6BD5", "#4CAF50"]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Map View Actuelle */}
      <View style={styles.mapPlaceholder}>
        {location ? (
          <MapView
            style={styles.mapActual}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* Magasin */}
            <Marker coordinate={{ latitude: location.coords.latitude + 0.01, longitude: location.coords.longitude - 0.005 }} title="Magasin (Point Collecte)" pinColor="orange" />
            {/* Client */}
            <Marker coordinate={{ latitude: location.coords.latitude + 0.02, longitude: location.coords.longitude + 0.01 }} title="Client (Destination)" pinColor="green" />
            {/* Route calculée via LocationIQ Directions API */}
            {routeCoords.length > 0 && (
              <Polyline coordinates={routeCoords} strokeColor="#6B6BD5" strokeWidth={5} lineDashPattern={[0]} />
            )}
          </MapView>
        ) : (
          <View style={styles.mapLoading}>
             <Text style={styles.mapIcon}>🛰️</Text>
             <Text style={styles.mapText}>Recherche du signal GPS...</Text>
          </View>
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        {STEPS.map((s, i) => (
          <View key={s.key} style={styles.progressItem}>
            <View style={[
              styles.progressDot,
              i <= step ? styles.progressDotActive : styles.progressDotInactive
            ]}>
              <Text style={styles.progressDotText}>{i < step ? "✓" : (i + 1).toString()}</Text>
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.progressLine, i < step ? styles.progressLineActive : null]} />
            )}
          </View>
        ))}
      </View>

      {/* Current step info */}
      <View style={styles.stepCard}>
        <Text style={styles.stepIcon}>{STEPS[step].icon}</Text>
        <Text style={styles.stepLabel}>{STEPS[step].label}</Text>
        <Text style={styles.stepDesc}>{STEPS[step].desc}</Text>
      </View>

      {/* Order details */}
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>{currentOrder.id}</Text>
          <Text style={styles.orderEarning}>+{currentOrder.earnings} FCFA</Text>
        </View>

        {/* Pickup */}
        <TouchableOpacity
          style={styles.locationRow}
          onPress={() => openMaps(currentOrder.storeAddress)}
        >
          <View style={[styles.locationDot, { backgroundColor: "#FF9800" }]} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Point de collecte</Text>
            <Text style={styles.locationAddress}>{currentOrder.storeAddress}</Text>
          </View>
          <Text style={styles.mapBtn}>🗺️</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* Delivery */}
        <TouchableOpacity
          style={styles.locationRow}
          onPress={() => openMaps(currentOrder.deliveryAddress)}
        >
          <View style={[styles.locationDot, { backgroundColor: "#6B6BD5" }]} />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Destination</Text>
            <Text style={styles.locationAddress}>{currentOrder.deliveryAddress}</Text>
          </View>
          <Text style={styles.mapBtn}>🗺️</Text>
        </TouchableOpacity>
      </View>

      {/* Customer info */}
      <View style={styles.customerCard}>
        <View style={styles.customerAvatar}>
          <Text style={styles.customerAvatarText}>
            {currentOrder.customerName.charAt(0)}
          </Text>
        </View>
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{currentOrder.customerName}</Text>
          <Text style={styles.customerPhone}>{currentOrder.customerPhone}</Text>
        </View>
        <TouchableOpacity style={styles.callBtn} onPress={callCustomer}>
          <Text style={styles.callBtnText}>📞 Appeler</Text>
        </TouchableOpacity>
      </View>

      {/* Action button */}
      <TouchableOpacity
        style={[styles.actionBtn, { backgroundColor: btnColors[step] }]}
        onPress={handleNextStep}
      >
        <Text style={styles.actionBtnText}>
          {step === 0 ? "📦 Commande récupérée" : step === 1 ? "✅ Confirmer la livraison" : "🎉 Terminer"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5FA" },
  mapPlaceholder: {
    height: Dimensions.get("window").height * 0.35,
    backgroundColor: "#E8EAF6",
    overflow: "hidden",
  },
  mapActual: {
    width: "100%",
    height: "100%",
  },
  mapLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mapIcon: { fontSize: 40 },
  mapText: { fontSize: 14, fontWeight: "600", color: "#666", marginTop: 8 },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: "#fff",
  },
  progressItem: { flexDirection: "row", alignItems: "center", flex: 1 },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  progressDotActive: { backgroundColor: "#6B6BD5" },
  progressDotInactive: { backgroundColor: "#E0E0E0" },
  progressDotText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  progressLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  progressLineActive: { backgroundColor: "#6B6BD5" },
  stepCard: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  stepIcon: { fontSize: 36, marginBottom: 8 },
  stepLabel: { fontSize: 18, fontWeight: "700", color: "#1A1A2E" },
  stepDesc: { fontSize: 13, color: "#888", marginTop: 6 },
  orderCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  orderId: { fontSize: 15, fontWeight: "700", color: "#1A1A2E" },
  orderEarning: { fontSize: 15, fontWeight: "700", color: "#4CAF50" },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  locationInfo: { flex: 1 },
  locationLabel: { fontSize: 11, color: "#888", marginBottom: 2 },
  locationAddress: { fontSize: 13, color: "#333" },
  mapBtn: { fontSize: 20, marginLeft: 8 },
  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 8,
    marginLeft: 24,
  },
  customerCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  customerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#6B6BD5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  customerAvatarText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 15, fontWeight: "600", color: "#1A1A2E" },
  customerPhone: { fontSize: 13, color: "#888", marginTop: 2 },
  callBtn: {
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callBtnText: { color: "#2E7D32", fontSize: 13, fontWeight: "600" },
  actionBtn: {
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  actionBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
})
