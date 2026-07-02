import React, { useState, useEffect, useRef } from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Animated, Linking } from "react-native"
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"
import { LOCATIONIQ_DIRECTIONS_URL, decodePolyline } from "../../constants/maps"
import { COLORS, FONTS, SPACING, RADIUS } from "../../constants/theme"

export default function ActiveDeliveryScreen({ route, navigation }: any) {
  const { order } = route.params
  const mapRef = useRef<MapView>(null)

  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [storeCoords, setStoreCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [routeCoords, setRouteCoords] = useState<{ latitude: number; longitude: number }[]>([])
  
  // Real-time animated driver position
  const [driverPos, setDriverPos] = useState<{ latitude: number; longitude: number } | null>(null)
  const [driverRotation, setDriverRotation] = useState(0)

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") return

      // Get user location
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      const uCoords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
      setUserCoords(uCoords)

      // Mock store/driver starting coords (close by)
      const sCoords = { latitude: uCoords.latitude + 0.015, longitude: uCoords.longitude + 0.008 }
      setStoreCoords(sCoords)
      // Driver starts at store
      setDriverPos(sCoords)

      // Fetch route from store to user via LocationIQ
      try {
        const url = LOCATIONIQ_DIRECTIONS_URL(sCoords.latitude, sCoords.longitude, uCoords.latitude, uCoords.longitude)
        const res = await fetch(url)
        const data = await res.json()
        
        let pathLine = [sCoords, uCoords] // Fallback
        
        if (data?.routes?.[0]?.geometry) {
          pathLine = decodePolyline(data.routes[0].geometry)
        }
        setRouteCoords(pathLine)
        
        // Start simulation after getting the route
        startDriverSimulation(pathLine)

        // Fit map
        setTimeout(() => {
          mapRef.current?.fitToCoordinates([sCoords, uCoords], {
            edgePadding: { top: 50, right: 50, bottom: 200, left: 50 },
            animated: true
          })
        }, 1000)

      } catch (err) {
        console.error("Map fetch error:", err)
      }
    })()
  }, [])

  // Function to simulate the driver moving along the polyline path
  const startDriverSimulation = (path: { latitude: number; longitude: number }[]) => {
    if (!path || path.length < 2) return

    let currentStep = 0
    let stepCount = path.length

    const interval = setInterval(() => {
      if (currentStep >= stepCount - 1) {
        clearInterval(interval)
        return
      }

      const p1 = path[currentStep]
      const p2 = path[currentStep + 1]

      // Simple angle calculation for rotation
      const angle = getBearing(p1, p2)
      setDriverRotation(angle)

      // Move marker
      setDriverPos(p2)
      currentStep++
      
      // Keep map centered on driver dynamically
      if (mapRef.current && currentStep % 2 === 0) {
          mapRef.current.animateCamera({ center: p2, pitch: 45, heading: angle }, { duration: 1500 })
      }
      
    }, 2000) // move every 2 seconds
  }

  // Calculate bearing for driver rotation
  const getBearing = (start: any, end: any) => {
    const startLat = start.latitude * Math.PI / 180
    const startLng = start.longitude * Math.PI / 180
    const endLat = end.latitude * Math.PI / 180
    const endLng = end.longitude * Math.PI / 180

    const dLong = endLng - startLng
    const dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0))
    let brng = Math.atan2(dLong, dPhi) * 180 / Math.PI
    return (brng + 360) % 360
  }

  return (
    <SafeAreaView style={styles.container}>
      {userCoords && storeCoords ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: (userCoords.latitude + storeCoords.latitude) / 2,
            longitude: (userCoords.longitude + storeCoords.longitude) / 2,
            latitudeDelta: 0.04,
            longitudeDelta: 0.04,
          }}
          showsCompass={false}
          showsMyLocationButton={true}
        >
          {/* Store */}
          <Marker coordinate={storeCoords} title="Magasin">
            <View style={styles.storeMarker}><Text style={{fontSize: 20}}>🏪</Text></View>
          </Marker>

          {/* User Home */}
          <Marker coordinate={userCoords} title="Vous">
            <View style={styles.homeMarker}><Text style={{fontSize: 20}}>🏠</Text></View>
          </Marker>

          {/* Route path */}
          {routeCoords.length > 0 && (
            <Polyline coordinates={routeCoords} strokeColor={COLORS.primary} strokeWidth={5} lineCap="round" lineJoin="round" />
          )}

          {/* Animated Driver Marker */}
          {driverPos && (
             <Marker coordinate={driverPos} anchor={{ x: 0.5, y: 0.5 }}>
               <View style={[styles.driverCircle, { transform: [{ rotate: `${driverRotation}deg` }] }]}>
                 <Text style={{fontSize: 26}}>🛵</Text>
               </View>
             </Marker>
          )}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={{fontSize: 40}}>📡</Text>
          <Text style={styles.loadingText}>Recherche du signal GPS...</Text>
        </View>
      )}

      {/* Driver Information Card Overlay */}
      <View style={styles.overlayCard}>
         <View style={styles.cardHandle}></View>
         <Text style={styles.statusText}>Le livreur est en route !</Text>
         <Text style={styles.etaText}>Arrivée d'ici <Text style={{color: COLORS.primary}}>10-15 min</Text></Text>

         {order?.driver && (
            <View style={styles.driverRow}>
               <View style={styles.driverAvatar}><Text style={{fontSize: 30}}>👨🏾‍🚀</Text></View>
               <View style={styles.driverInfo}>
                 <Text style={styles.driverName}>{order.driver.name}</Text>
                 <Text style={styles.driverVehicle}>{order.driver.vehicle} - ⭐ {order.driver.rating}</Text>
               </View>
               <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${order.driver.phone}`)}>
                 <Text style={{fontSize: 20}}>📞</Text>
               </TouchableOpacity>
            </View>
         )}
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Fermer la carte</Text>
         </TouchableOpacity>
      </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  map: { width: Dimensions.get('window').width, height: Dimensions.get('window').height },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: 10, fontWeight: "600" },
  
  storeMarker: { backgroundColor: "#FFF8E1", padding: 8, borderRadius: 20, borderWidth: 2, borderColor: "#FFB300", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 4 },
  homeMarker: { backgroundColor: "#E3F2FD", padding: 8, borderRadius: 20, borderWidth: 2, borderColor: "#1E88E5", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 4 },
  driverCircle: { backgroundColor: COLORS.white, padding: 6, borderRadius: 30, borderWidth: 3, borderColor: COLORS.secondary, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 6 },
  
  overlayCard: { 
    position: "absolute", bottom: 0, left: 0, right: 0, 
    backgroundColor: COLORS.white, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, 
    padding: SPACING.xl, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 15 
  },
  cardHandle: { width: 40, height: 5, backgroundColor: COLORS.grayMedium, borderRadius: 3, alignSelf: "center", marginBottom: SPACING.md },
  statusText: { fontSize: 22, fontWeight: "900", color: COLORS.text },
  etaText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, fontWeight: "600", marginTop: 4, marginBottom: SPACING.lg },
  
  driverRow: { flexDirection: "row", alignItems: "center", paddingBottom: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.grayLight, marginBottom: SPACING.md },
  driverAvatar: { width: 60, height: 60, backgroundColor: COLORS.grayLight, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  driverInfo: { flex: 1, marginLeft: SPACING.md },
  driverName: { fontSize: FONTS.sizes.lg, fontWeight: "800", color: COLORS.text },
  driverVehicle: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2, fontWeight: "500" },
  
  callBtn: { width: 50, height: 50, backgroundColor: "#E8F5E9", borderRadius: 25, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: COLORS.success },
  backButton: { backgroundColor: COLORS.grayLight, padding: SPACING.md, borderRadius: RADIUS.md, alignItems: "center" },
  backButtonText: { fontSize: FONTS.sizes.md, fontWeight: "700", color: COLORS.text },
})
