import React, { useCallback, useState } from "react"
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator,
} from "react-native"
import { useFocusEffect } from "@react-navigation/native"
import { notificationsAPI } from "../../services/api"

const COLORS = {
  primary: "#6B6BD5", bg: "#F5F5F5", white: "#FFFFFF",
  text: "#212121", sub: "#757575", border: "#E0E0E0",
}

type Notif = { id: string; title: string; message: string; createdAt: string; read: boolean }

export default function NotificationsScreen({ navigation }: any) {
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [loading, setLoading] = useState(true)
  const unread = notifs.filter((n) => !n.read).length

  useFocusEffect(
    useCallback(() => {
      load()
    }, [])
  )

  async function load() {
    setLoading(true)
    try {
      const res = await notificationsAPI.getAll()
      setNotifs(res.data)
    } catch (e) {
      console.log("Error loading notifications", e)
    } finally {
      setLoading(false)
    }
  }

  const markAllRead = async () => {
    const toMark = notifs.filter((n) => !n.read)
    setNotifs(notifs.map((n) => ({ ...n, read: true })))
    await Promise.all(toMark.map((n) => notificationsAPI.markRead(n.id)))
  }

  const markRead = async (id: string) => {
    setNotifs(notifs.map((n) => (n.id === id ? { ...n, read: true } : n)))
    try {
      await notificationsAPI.markRead(id)
    } catch (e) {
      console.log("Error marking read", e)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications {unread > 0 ? `(${unread})` : ""}</Text>
        {unread > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAll}>Tout lire</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={notifs}
          keyExtractor={(i) => i.id}
          refreshing={loading}
          onRefresh={load}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>🔔</Text>
              <Text style={styles.emptyText}>Aucune notification</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, !item.read && styles.cardUnread]}
              onPress={() => markRead(item.id)}
            >
              <View style={styles.iconWrap}>
                <Text style={{ fontSize: 24 }}>🔔</Text>
              </View>
              <View style={styles.content}>
                <Text style={[styles.notifTitle, !item.read && styles.notifTitleUnread]}>{item.title}</Text>
                <Text style={styles.notifBody} numberOfLines={2}>{item.message}</Text>
                <Text style={styles.notifTime}>
                  {new Date(item.createdAt).toLocaleDateString("fr-FR")} {new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 20,
    paddingVertical: 16, backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { marginRight: 12 },
  backIcon: { fontSize: 22, color: COLORS.text },
  title: { flex: 1, fontSize: 17, fontWeight: "800", color: COLORS.text },
  markAll: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },
  card: {
    flexDirection: "row", backgroundColor: COLORS.white, borderRadius: 14,
    padding: 14, gap: 12, alignItems: "flex-start",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: COLORS.primary, backgroundColor: "#F3F3FB" },
  iconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: "#F0F0F0", alignItems: "center", justifyContent: "center",
  },
  content: { flex: 1 },
  notifTitle: { fontSize: 13, fontWeight: "600", color: COLORS.text },
  notifTitleUnread: { fontWeight: "800", color: COLORS.primary },
  notifBody: { fontSize: 12, color: COLORS.sub, marginTop: 3, lineHeight: 17 },
  notifTime: { fontSize: 11, color: "#9E9E9E", marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginTop: 4 },
  empty: { alignItems: "center", padding: 48, gap: 12 },
  emptyText: { fontSize: 15, color: COLORS.sub },
})
