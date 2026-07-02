"use client"

import { useState } from "react"
import { Save } from "lucide-react"

export default function EmailConfigPage() {
  const [config, setConfig] = useState({
    driver: "smtp",
    host: "smtp.gmail.com",
    port: "587",
    username: "noreply@NOOR EAT.com",
    password: "••••••••••",
    encryption: "TLS",
    fromName: "NOOR EAT",
    fromEmail: "noreply@NOOR EAT.com",
  })

  return (
    <div>
      <h1 className="text-lg font-semibold text-gray-700 mb-6">⚙️ Configuration Email</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-2xl">
        <h2 className="font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-100">Paramètres SMTP</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Driver d'envoi</label>
            <select value={config.driver} onChange={(e) => setConfig({ ...config, driver: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option value="smtp">SMTP</option>
              <option value="mailgun">Mailgun</option>
              <option value="sendgrid">SendGrid</option>
              <option value="ses">Amazon SES</option>
            </select>
          </div>

          {[
            { label: "Hôte SMTP", key: "host", placeholder: "smtp.example.com" },
            { label: "Port", key: "port", placeholder: "587" },
            { label: "Nom d'utilisateur", key: "username", placeholder: "user@example.com" },
            { label: "Mot de passe", key: "password", type: "password" },
            { label: "Nom de l'expéditeur", key: "fromName", placeholder: "NOOR EAT" },
            { label: "Email de l'expéditeur", key: "fromEmail", placeholder: "noreply@NOOR EAT.com" },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 block mb-1">{label}</label>
              <input type={type ?? "text"} value={(config as any)[key]} placeholder={placeholder}
                onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          ))}

          <div>
            <label className="text-xs text-gray-500 block mb-1">Chiffrement</label>
            <select value={config.encryption} onChange={(e) => setConfig({ ...config, encryption: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
              <option>TLS</option>
              <option>SSL</option>
              <option>None</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg">
            <Save size={16} /> Enregistrer
          </button>
          <button className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">
            Tester la connexion
          </button>
        </div>
      </div>
    </div>
  )
}
