import React, { useState } from "react"
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  SafeAreaView, TextInput, Alert, ActivityIndicator,
  Share,
} from "react-native"
import { COLORS, FONTS, SPACING, RADIUS } from "../../constants/theme"
import { useStore } from "../../store/useStore"
import axios from "axios"

export default function ReferralScreen({ navigation }: any) {
  const user = useStore((s) => s.user)
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const API_URL = process.env.EXPO_PUBLIC_API_URL || "https://ndugumi.vercel.app/api"
  
  // Create a simple custom referral code using ID
  const myReferralCode = user?.referralCode || `NDG-${user?.id?.substring(0,6).toUpperCase()}`

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Rejoins NDUGUMi pour tes courses ! Utilise mon code de parrainage ${myReferralCode} pour gagner 500 FCFA sur ton premier chargement.`,
      })
    } catch (error) {
      console.log("Share err:", error)
    }
  }

  const handleSubmitReferral = async () => {
    if (!user) return Alert.alert("Erreur", "Utilisateur non connecté")
    if (code.length < 5) return Alert.alert("Erreur", "Veuillez entrer un code de parrainage valide.")
    
    setIsLoading(true)
    try {
      const res = await axios.post(`${API_URL}/user/referral`, {
        userId: user.id,
        referralCode: code.toUpperCase()
      })
      Alert.alert("Félicitations 🎉", res.data.message)
      setCode("")
    } catch (error: any) {
      Alert.alert("Oups", error?.response?.data?.message || "Erreur de parrainage.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Parrainage</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: SPACING.lg, alignItems: "center" }}>
        
        <Text style={styles.emojiGiant}>🎁</Text>
        <Text style={styles.mainTitle}>Invitez et Gagnez</Text>
        <Text style={styles.subtitle}>Gagnez 1000 FCFA pour chaque ami(e) inscrit(e) avec votre code. Votre ami(e) gagnera 500 FCFA.</Text>

        <View style={styles.codeContainer}>
          <Text style={styles.codeLabel}>VOTRE CODE DE PARRAINAGE</Text>
          <Text style={styles.myCode}>{myReferralCode}</Text>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
            <Text style={styles.shareBtnText}>Partager le code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Entrer un code reçu</Text>
        <Text style={styles.subtext}>Avez-vous été invité(e) ? Entrez le code parrain pour recevoir 500 FCFA.</Text>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input}
            placeholder="Ex: NDG-12ABC"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity 
            style={[styles.submitBtn, code.length < 4 && { opacity: 0.5 }]} 
            disabled={code.length < 4 || isLoading}
            onPress={handleSubmitReferral}
          >
            {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.submitBtnText}>Valider</Text>}
          </TouchableOpacity>
        </View>

      </ScrollView>
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

  emojiGiant: { fontSize: 64, marginVertical: SPACING.lg },
  mainTitle: { fontSize: 28, fontWeight: "900", color: COLORS.text, textAlign: "center" },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, textAlign: "center", marginTop: SPACING.sm, lineHeight: 22 },

  codeContainer: {
    width: "100%", backgroundColor: COLORS.primary + "15",
    padding: SPACING.xl, borderRadius: RADIUS.xl, marginTop: SPACING.xl,
    alignItems: "center", borderWidth: 1, borderColor: COLORS.primary + "30"
  },
  codeLabel: { fontSize: 12, fontWeight: "700", color: COLORS.primary, marginBottom: SPACING.sm },
  myCode: { fontSize: 32, fontWeight: "900", color: COLORS.primary, letterSpacing: 2 },
  shareBtn: {
    backgroundColor: COLORS.primary, marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: RADIUS.lg
  },
  shareBtnText: { color: COLORS.white, fontWeight: "800", fontSize: 16 },

  divider: { height: 1, backgroundColor: COLORS.grayMedium, width: "100%", marginVertical: 32 },

  sectionTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text, alignSelf: "flex-start" },
  subtext: { fontSize: 14, color: COLORS.textSecondary, alignSelf: "flex-start", marginTop: 4, marginBottom: SPACING.md },
  
  inputContainer: { flexDirection: "row", width: "100%", gap: SPACING.sm },
  input: {
    flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md, fontSize: 18, fontWeight: "700", color: COLORS.text,
    backgroundColor: COLORS.white
  },
  submitBtn: {
    backgroundColor: COLORS.text, paddingHorizontal: SPACING.lg,
    justifyContent: "center", alignItems: "center", borderRadius: RADIUS.md
  },
  submitBtnText: { color: COLORS.white, fontWeight: "800" },
})
