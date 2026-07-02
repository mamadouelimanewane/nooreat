"use client"

import { useState } from "react"
import { Edit, Eye, Trash2, Bell, CreditCard, FileText, MapPin, Smartphone, LogOut, Phone, PhoneOff, Star, ToggleLeft } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"
import Link from "next/link"

interface Driver {
  id: string;
  driverId: number;
  name: string;
  phone: string | null;
  email: string;
  serviceArea: string | null;
  totalOrders: number;
  rating: number;
  earning: number;
  walletMoney: number;
  status: string;
  approvalStatus: string;
  createdAt: Date;
}

interface DriversTableProps {
  drivers: Driver[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

type DriverModal = "notification" | "addMoney" | "deviceDetails" | "walletHistory" | "documents" | null

export default function DriversTable({ drivers, totalCount, currentPage, perPage, totalPages }: DriversTableProps) {
  const [modal, setModal] = useState<DriverModal>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)

  const openModal = (type: DriverModal, driver: Driver) => {
    setSelectedDriver(driver)
    setModal(type)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {["N°", "ID", "Zone", "Livreur", "Stats", "Finance", "Date", "Statut", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {drivers.map((d, i) => (
            <tr key={d.id} className="hover:bg-gray-50/80">
              <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * perPage + i + 1}</td>
              <td className="px-4 py-3 text-blue-600 font-semibold cursor-pointer hover:underline">#{d.driverId}</td>
              <td className="px-4 py-3 text-gray-700">{d.serviceArea || "—"}</td>
              <td className="px-4 py-3">
                <div className="font-medium text-gray-800">{d.name}</div>
                <div className="text-gray-500 text-xs">{d.phone}</div>
                <div className="text-gray-400 text-xs">{d.email}</div>
              </td>
              <td className="px-4 py-3 text-xs">
                <div className="text-green-600 font-medium">Orders: {d.totalOrders}</div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Star size={10} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-gray-500">{d.rating}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs">
                <div>Gains: {d.earning.toLocaleString()} F</div>
                <div className="font-medium text-cyan-600">Wallet: {d.walletMoney.toLocaleString()} F</div>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(d.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 flex-wrap min-w-[180px]">
                  <button onClick={() => openModal("notification", d)} title="Notif" className="p-1 bg-orange-500 text-white rounded"><Bell size={12} /></button>
                  <button onClick={() => openModal("addMoney", d)} title="Argent" className="p-1 bg-cyan-500 text-white rounded"><CreditCard size={12} /></button>
                  <button title="Profil" className="p-1 bg-green-500 text-white rounded"><Eye size={12} /></button>
                  <button title="Modifier" className="p-1 bg-blue-500 text-white rounded"><Edit size={12} /></button>
                  <button title="Détails" className="p-1 bg-gray-500 text-white rounded"><Smartphone size={12} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="p-3 border-t flex items-center justify-between text-xs text-gray-500">
        <span>Affichage de {drivers.length} sur {totalCount} livreurs</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`/drivers?page=${p}`}
              className={`px-2.5 py-1 rounded border ${currentPage === p ? "bg-blue-500 text-white" : "border-gray-200"}`}>
              {p}
            </Link>
          ))}
        </div>
      </div>

       {/* Simple modals placeholder for UI */}
       {modal && selectedDriver && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="font-bold mb-4">{modal === 'notification' ? 'Notifier' : 'Gérer'} {selectedDriver.name}</h2>
              <div className="text-sm text-gray-600 mb-6">Mode interactif requis pour cette action (Prisma create).</div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setModal(null)} className="px-4 py-2 border rounded">Fermer</button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
