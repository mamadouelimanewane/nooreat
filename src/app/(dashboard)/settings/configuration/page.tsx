"use client"

import { useState } from "react"
import { Save, Smartphone, Globe, Wallet, Bell, Trash2, Image, Palette } from "lucide-react"

type Lang = "English" | "Français"
type OnOff = boolean

export default function GeneralConfigurationPage() {
  // Rapport & contact
  const [reportEmail, setReportEmail] = useState("report@NOOR EAT.com")
  const [reportPhone, setReportPhone] = useState("+221 77 000 00 00")

  // Android User App
  const [androidUserMaintenance, setAndroidUserMaintenance] = useState<OnOff>(false)
  const [androidUserVersion, setAndroidUserVersion] = useState("1.0.0")
  const [androidUserMandatory, setAndroidUserMandatory] = useState<OnOff>(false)

  // Android Driver App
  const [androidDriverMaintenance, setAndroidDriverMaintenance] = useState<OnOff>(false)
  const [androidDriverVersion, setAndroidDriverVersion] = useState("1.0.0")
  const [androidDriverMandatory, setAndroidDriverMandatory] = useState<OnOff>(false)

  // iOS User App
  const [iosUserMaintenance, setIosUserMaintenance] = useState<OnOff>(false)
  const [iosUserVersion, setIosUserVersion] = useState("1.0.0")
  const [iosUserMandatory, setIosUserMandatory] = useState<OnOff>(false)

  // iOS Driver App
  const [iosDriverMaintenance, setIosDriverMaintenance] = useState<OnOff>(false)
  const [iosDriverVersion, setIosDriverVersion] = useState("1.0.0")
  const [iosDriverMandatory, setIosDriverMandatory] = useState<OnOff>(false)

  // Android Store App
  const [androidStoreMaintenance, setAndroidStoreMaintenance] = useState<OnOff>(false)
  const [androidStoreVersion, setAndroidStoreVersion] = useState("1.0.0")
  const [androidStoreMandatory, setAndroidStoreMandatory] = useState<OnOff>(false)

  // iOS Store App
  const [iosStoreMaintenance, setIosStoreMaintenance] = useState<OnOff>(false)
  const [iosStoreVersion, setIosStoreVersion] = useState("1.0.0")
  const [iosStoreMandatory, setIosStoreMandatory] = useState<OnOff>(false)

  // Langues
  const [adminLang, setAdminLang] = useState<Lang>("Français")
  const [userLang, setUserLang] = useState<Lang>("Français")
  const [driverLang, setDriverLang] = useState<Lang>("Français")

  // Wallet
  const [userWalletShort, setUserWalletShort] = useState("1k=1 000 FCFA")
  const [driverWalletShort, setDriverWalletShort] = useState("1k=1 000 FCFA")

  // Divers
  const [docExpiryDays, setDocExpiryDays] = useState("30")
  const [apiVersion, setApiVersion] = useState("v1")
  const [handymanEnable, setHandymanEnable] = useState(false)
  const [userDeleteUrl, setUserDeleteUrl] = useState("")
  const [driverDeleteUrl, setDriverDeleteUrl] = useState("")
  const [businessDeleteUrl, setBusinessDeleteUrl] = useState("")
  const [userImageMode, setUserImageMode] = useState<"Optional" | "Mandatory">("Optional")
  const [spBasePrice, setSpBasePrice] = useState("500")
  const [externalHolderColor, setExternalHolderColor] = useState("#3B82F6")
  const [paymentImageConfig, setPaymentImageConfig] = useState("")
  const [paymentImage, setPaymentImage] = useState("")
  const [appTheme, setAppTheme] = useState("#3B82F6")
  const [screen1Text, setScreen1Text] = useState("Livraison rapide et fiable")

  // Composants réutilisables
  const Toggle = ({ val, set }: { val: boolean; set: (v: boolean) => void }) => (
    <div className="flex gap-2">
      <button
        onClick={() => set(true)}
        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${val ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
      >
        On
      </button>
      <button
        onClick={() => set(false)}
        className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${!val ? "bg-red-400 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
      >
        Off
      </button>
    </div>
  )

  const LangToggle = ({ val, set }: { val: Lang; set: (v: Lang) => void }) => (
    <div className="flex gap-2">
      {(["English", "Français"] as Lang[]).map(l => (
        <button
          key={l}
          onClick={() => set(l)}
          className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${val === l ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
        >
          {l}
        </button>
      ))}
    </div>
  )

  const Field = ({ label, value, set, type = "text", required = true }: {
    label: string; value: string; set: (v: string) => void; type?: string; required?: boolean
  }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <label className="text-sm text-gray-600 flex-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => set(e.target.value)}
        className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 w-56"
      />
    </div>
  )

  const ToggleRow = ({ label, val, set, required = true }: {
    label: string; val: boolean; set: (v: boolean) => void; required?: boolean
  }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <label className="text-sm text-gray-600 flex-1">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <Toggle val={val} set={set} />
    </div>
  )

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
        ⚙️ Configuration générale
      </h1>

      {/* Rapport & Contact */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Bell size={15} className="text-orange-500" /> Rapport & Contact
        </h2>
        <Field label="Email de rapport de problème" value={reportEmail} set={setReportEmail} type="email" />
        <Field label="Téléphone de rapport de problème" value={reportPhone} set={setReportPhone} />
      </div>

      {/* Applications mobiles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Android User */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Smartphone size={15} className="text-green-600" /> Application Android — Utilisateur
          </h2>
          <ToggleRow label="Mode maintenance" val={androidUserMaintenance} set={setAndroidUserMaintenance} />
          <Field label="Version de l'application" value={androidUserVersion} set={setAndroidUserVersion} />
          <ToggleRow label="Mise à jour obligatoire" val={androidUserMandatory} set={setAndroidUserMandatory} />
        </div>

        {/* Android Driver */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Smartphone size={15} className="text-blue-600" /> Application Android — Livreur
          </h2>
          <ToggleRow label="Mode maintenance" val={androidDriverMaintenance} set={setAndroidDriverMaintenance} />
          <Field label="Version de l'application" value={androidDriverVersion} set={setAndroidDriverVersion} />
          <ToggleRow label="Mise à jour obligatoire" val={androidDriverMandatory} set={setAndroidDriverMandatory} />
        </div>

        {/* iOS User */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Smartphone size={15} className="text-gray-700" /> Application iOS — Utilisateur
          </h2>
          <ToggleRow label="Mode maintenance" val={iosUserMaintenance} set={setIosUserMaintenance} />
          <Field label="Version de l'application" value={iosUserVersion} set={setIosUserVersion} />
          <ToggleRow label="Mise à jour obligatoire" val={iosUserMandatory} set={setIosUserMandatory} />
        </div>

        {/* iOS Driver */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Smartphone size={15} className="text-purple-600" /> Application iOS — Livreur
          </h2>
          <ToggleRow label="Mode maintenance" val={iosDriverMaintenance} set={setIosDriverMaintenance} />
          <Field label="Version de l'application" value={iosDriverVersion} set={setIosDriverVersion} />
          <ToggleRow label="Mise à jour obligatoire" val={iosDriverMandatory} set={setIosDriverMandatory} />
        </div>

        {/* Android Store */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Smartphone size={15} className="text-orange-500" /> Application Android — Commerce
          </h2>
          <ToggleRow label="Mode maintenance" val={androidStoreMaintenance} set={setAndroidStoreMaintenance} />
          <Field label="Version de l'application" value={androidStoreVersion} set={setAndroidStoreVersion} />
          <ToggleRow label="Mise à jour obligatoire" val={androidStoreMandatory} set={setAndroidStoreMandatory} />
        </div>

        {/* iOS Store */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Smartphone size={15} className="text-pink-600" /> Application iOS — Commerce
          </h2>
          <ToggleRow label="Mode maintenance" val={iosStoreMaintenance} set={setIosStoreMaintenance} />
          <Field label="Version de l'application" value={iosStoreVersion} set={setIosStoreVersion} />
          <ToggleRow label="Mise à jour obligatoire" val={iosStoreMandatory} set={setIosStoreMandatory} />
        </div>
      </div>

      {/* Langues */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Globe size={15} className="text-blue-500" /> Langues par défaut
        </h2>
        <div className="space-y-0">
          {[
            { label: "Langue par défaut — Administration", val: adminLang, set: setAdminLang },
            { label: "Langue par défaut — Application utilisateur", val: userLang, set: setUserLang },
            { label: "Langue par défaut — Application livreur", val: driverLang, set: setDriverLang },
          ].map(({ label, val, set }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <label className="text-sm text-gray-600">{label} <span className="text-red-400">*</span></label>
              <LangToggle val={val as Lang} set={set as (v: Lang) => void} />
            </div>
          ))}
        </div>
      </div>

      {/* Portefeuille */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Wallet size={15} className="text-green-600" /> Portefeuille
        </h2>
        <Field label="Valeurs courtes portefeuille utilisateur" value={userWalletShort} set={setUserWalletShort} />
        <Field label="Valeurs courtes portefeuille livreur" value={driverWalletShort} set={setDriverWalletShort} required={false} />
      </div>

      {/* Paramètres divers */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          ⚙️ Paramètres divers
        </h2>
        <Field label="Rappel expiration documents (jours)" value={docExpiryDays} set={setDocExpiryDays} type="number" />
        <Field label="Version API" value={apiVersion} set={setApiVersion} />
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <label className="text-sm text-gray-600 flex-1">
            ndugalma_food.handyman_provider_start_before_booking_date
          </label>
          <div className="flex gap-2">
            {(["Enable", "Disable"] as const).map(v => (
              <button
                key={v}
                onClick={() => setHandymanEnable(v === "Enable")}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${handymanEnable === (v === "Enable") ? (v === "Enable" ? "bg-green-500 text-white" : "bg-red-400 text-white") : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <Field label="Prix de base SP (FCFA)" value={spBasePrice} set={setSpBasePrice} type="number" />
      </div>

      {/* URLs de suppression de compte */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Trash2 size={15} className="text-red-500" /> URLs de suppression de compte
        </h2>
        <Field label="URL suppression compte utilisateur" value={userDeleteUrl} set={setUserDeleteUrl} required={false} />
        <Field label="URL suppression compte livreur" value={driverDeleteUrl} set={setDriverDeleteUrl} required={false} />
        <Field label="URL suppression compte commerce" value={businessDeleteUrl} set={setBusinessDeleteUrl} required={false} />
        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <label className="text-sm text-gray-600">
            Image utilisateur dans l&apos;app <span className="text-red-400">*</span>
          </label>
          <div className="flex gap-2">
            {(["Optional", "Mandatory"] as const).map(v => (
              <button
                key={v}
                onClick={() => setUserImageMode(v)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${userImageMode === v ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
              >
                {v === "Optional" ? "Optionnel" : "Obligatoire"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Apparence & Thème */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Palette size={15} className="text-purple-500" /> Apparence & Thème
        </h2>

        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <label className="text-sm text-gray-600">Couleur externe (External Holder Color)</label>
          <div className="flex items-center gap-3">
            <input type="color" value={externalHolderColor} onChange={e => setExternalHolderColor(e.target.value)}
              className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
            <input value={externalHolderColor} onChange={e => setExternalHolderColor(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono w-28 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
        </div>

        <div className="flex items-center justify-between py-2.5 border-b border-gray-50">
          <label className="text-sm text-gray-600">Thème de l&apos;application (ndugalma_food.application_theme)</label>
          <div className="flex items-center gap-3">
            <input type="color" value={appTheme} onChange={e => setAppTheme(e.target.value)}
              className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
            <input value={appTheme} onChange={e => setAppTheme(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono w-28 focus:outline-none focus:ring-2 focus:ring-blue-200" />
          </div>
        </div>

        <Field label="ndugalma_food.payment_image_config" value={paymentImageConfig} set={setPaymentImageConfig} required={false} />
        <Field label="ndugalma_food.payment_image" value={paymentImage} set={setPaymentImage} required={false} />
        <Field label="Texte écran 1 (Screen 1 Text)" value={screen1Text} set={setScreen1Text} />
      </div>

      {/* Image de paiement */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-100 flex items-center gap-2">
          <Image size={15} className="text-cyan-500" /> Image de paiement
        </h2>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
          <div className="text-4xl mb-2">🖼️</div>
          <p className="text-sm text-gray-500">Glisser-déposer une image ou</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600">
            Choisir un fichier
          </button>
          <p className="text-xs text-gray-400 mt-2">PNG, JPG — max 2 MB</p>
        </div>
      </div>

      <div className="flex justify-end pb-6">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors">
          <Save size={15} /> Enregistrer la configuration
        </button>
      </div>
    </div>
  )
}
