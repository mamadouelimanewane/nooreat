import React from "react"
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native"
import { COLORS, FONTS, SPACING, RADIUS } from "../constants/theme"

export default function ComingSoonScreen({ navigation, route }: any) {
  const title = route?.params?.title || "Bientôt disponible"

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.emoji}>🚧</Text>
        <Text style={styles.heading}>Cette fonctionnalité est en cours de développement</Text>
        <Text style={styles.subtext}>
          Nous travaillons dur pour vous offrir la meilleure expérience possible. Revenez très bientôt !
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Retour</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md, backgroundColor: COLORS.white,
    borderBottomWidth: 1, borderBottomColor: COLORS.grayMedium,
  },
  backBtn: { marginRight: SPACING.md },
  backIcon: { fontSize: 22, color: COLORS.text },
  title: { fontSize: FONTS.sizes.lg, fontWeight: "800", color: COLORS.text },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: SPACING.xl },
  emoji: { fontSize: 80, marginBottom: SPACING.lg },
  heading: { fontSize: FONTS.sizes.lg, fontWeight: "800", color: COLORS.text, textAlign: "center", marginBottom: SPACING.md },
  subtext: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: "center", lineHeight: 24, marginBottom: SPACING.xl },
  btn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.round },
  btnText: { color: COLORS.white, fontWeight: "700", fontSize: FONTS.sizes.md },
})
