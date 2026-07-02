"use client"

import { useState } from "react"
import { Save } from "lucide-react"

export default function AppUrlPage() {
  const [config, setConfig] = useState({
    androidUserApp: "https://play.google.com/store/apps/details?id=com.NOOR EAT.user",
    iosUserApp: "https://apps.apple.com/app/NOOR EAT/id123456789",
    androidDriverApp: "https://play.google.com/store/apps/details?id=com.NOOR EAT.driver",
    iosDriverApp: "https://apps.apple.com/app/NOOR EAT-driver/id987654321",
    androidStoreApp: "https://play.google.com/store/apps/details?id=com.NOOR EAT.store",
    iosStoreApp: "",
    websiteUrl: "https://NOOR EAT.com",
    adminPanelUrl: "https://admin.NOOR EAT.com",
    apiBaseUrl: "https://api.NOOR EAT.com/v1",
  })

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6">⚙️ URLs de l'application</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            title: "Application utilisateur",
            fields: [
              { label: "Android (Play Store)", key: "androidUserApp" },
              { label: "iOS (App Store)", key: "iosUserApp" },
            ]
          },
          {
            title: "Application livreur",
            fields: [
              { label: "Android (Play Store)", key: "androidDriverApp" },
              { label: "iOS (App Store)", key: "iosDriverApp" },
            ]
          },
          {
            title: "Application magasin",
            fields: [
              { label: "Android (Play Store)", key: "androidStoreApp" },
              { label: "iOS (App Store)", key: "iosStoreApp" },
            ]
          },
          {
            title: "Liens web",
            fields: [
              { label: "Site web", key: "websiteUrl" },
              { label: "Panneau admin", key: "adminPanelUrl" },
              { label: "API Base URL", key: "apiBaseUrl" },
            ]
          },
        ].map(({ title, fields }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-semibold text-gray-700 pb-2 border-b border-gray-100">{title}</h2>
            {fields.map(({ label, key }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 block mb-1">{label}</label>
                <input value={(config as any)[key]} placeholder="https://"
                  onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <button className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg">
          <Save size={16} /> Enregistrer
        </button>
      </div>
    </div>
  )
}
