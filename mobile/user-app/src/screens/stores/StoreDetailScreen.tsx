import React, { useEffect, useState } from "react"
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image,
  ActivityIndicator, Alert
} from "react-native"
import { COLORS, FONTS, SPACING, RADIUS } from "../../constants/theme"
import { storesAPI } from "../../services/api"
import { useStore } from "../../store/useStore"

export default function StoreDetailScreen({ route, navigation }: any) {
  const { store } = route.params
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  
  const cart = useStore((s) => s.cart)
  const addToCart = useStore((s) => s.addToCart)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await storesAPI.getProducts(store.id || store._id)
      setProducts(res.data)
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: any) => {
    const existing = cart.find(c => c.id === product.id || c.id === product._id)
    if (existing) {
      // It's already in cart, just showing a tiny alert or nothing 
      Alert.alert("Panier", "Produit ajouté au panier")
    }

    addToCart({
      id: product.id || product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      storeId: store.id || store._id,
      storeName: store.name,
    })
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeArea}>📍 {store.area || store.location}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id || item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productImagePlaceholder}>
                  <Text style={{ fontSize: 30 }}>{item.emoji || "📦"}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price} FCFA</Text>
              </View>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => handleAddToCart(item)}
              >
                <Text style={styles.addBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.center}>
                <Text style={styles.emptyText}>Aucun produit disponible</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: SPACING.lg, paddingTop: 56, paddingBottom: SPACING.md,
    backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.grayMedium,
  },
  backBtn: { padding: 4, marginRight: SPACING.sm },
  backText: { fontSize: FONTS.sizes.xl, color: COLORS.text },
  storeName: { fontSize: FONTS.sizes.lg, fontWeight: "700", color: COLORS.text },
  storeArea: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary },
  list: { padding: SPACING.lg, gap: SPACING.md },
  productCard: {
    flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white,
    padding: SPACING.md, borderRadius: RADIUS.lg,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  productImagePlaceholder: {
    width: 60, height: 60, backgroundColor: COLORS.grayLight,
    borderRadius: RADIUS.md, alignItems: "center", justifyContent: "center",
    marginRight: SPACING.md,
  },
  productInfo: { flex: 1 },
  productName: { fontSize: FONTS.sizes.md, fontWeight: "600", color: COLORS.text },
  productPrice: { fontSize: FONTS.sizes.sm, fontWeight: "700", color: COLORS.primary, marginTop: 4 },
  addBtn: {
    width: 40, height: 40, backgroundColor: COLORS.primary,
    borderRadius: RADIUS.round, alignItems: "center", justifyContent: "center"
  },
  addBtnText: { color: COLORS.white, fontSize: FONTS.sizes.xl, fontWeight: "600", lineHeight: 40 },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary }
})
