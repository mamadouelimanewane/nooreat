"use client"

import { useState } from "react"
import { Plus, Download, Info, Edit, Trash2, Bell, CreditCard, FileText, Eye, MapPin, Smartphone, LogOut, Settings, RefreshCw } from "lucide-react"
import StatusBadge from "@/components/ui/StatusBadge"
import Link from "next/link"

interface User {
  id: string;
  userId: number;
  name: string;
  phone: string | null;
  email: string;
  walletMoney: number;
  userType: string;
  signupType: string;
  signupFrom: string;
  status: string;
  createdAt: Date;
}

interface UsersTableProps {
  users: User[];
  totalCount: number;
  currentPage: number;
  perPage: number;
  totalPages: number;
}

type ModalType = "notification" | "addMoney" | "deviceDetails" | "walletHistory" | null

export default function UsersTable({ users, totalCount, currentPage, perPage, totalPages }: UsersTableProps) {
  const [modal, setModal] = useState<ModalType>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [notif, setNotif] = useState({ title: "", message: "", image: "", promo: false, expireDate: "", url: "" })
  const [money, setMoney] = useState({ method: "Cash", type: "Credit", amount: "", receipt: "", description: "" })

  const openModal = (type: ModalType, user: User) => {
    setSelectedUser(user)
    setModal(type)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
      <div className="p-3 border-b border-gray-50 flex justify-between items-center gap-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <span>Sortie : {perPage} entrées</span>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {["N°", "ID", "Détails", "Solde (FCFA)", "Inscription", "Date", "Statut", "Action"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user, i) => (
            <tr key={user.id} className="hover:bg-gray-50/80">
              <td className="px-4 py-3 text-gray-500">{(currentPage - 1) * perPage + i + 1}</td>
              <td className="px-4 py-3 text-blue-600 font-medium">#{user.userId}</td>
              <td className="px-4 py-3 text-left">
                <div className="font-medium text-gray-800">{user.name}</div>
                <div className="text-gray-500 text-xs">{user.phone}</div>
                <div className="text-gray-400 text-xs">{user.email}</div>
              </td>
              <td className="px-4 py-3 text-cyan-600 font-medium">{user.walletMoney.toLocaleString()}</td>
              <td className="px-4 py-3 text-xs text-gray-500">
                <div>Type : {user.userType}</div>
                <div>Source : {user.signupFrom}</div>
              </td>
              <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 flex-wrap min-w-[200px]">
                  <button onClick={() => openModal("notification", user)} title="Notification" className="p-1 bg-orange-500 text-white rounded"><Bell size={12} /></button>
                  <button onClick={() => openModal("addMoney", user)} title="Argent" className="p-1 bg-cyan-500 text-white rounded"><CreditCard size={12} /></button>
                  <button title="Modifier" className="p-1 bg-blue-500 text-white rounded"><Edit size={12} /></button>
                  <button title="Supprimer" className="p-1 bg-red-500 text-white rounded"><Trash2 size={12} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="p-3 border-t flex items-center justify-between text-xs text-gray-500">
        <span>Affichage de {users.length} sur {totalCount} entrées</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link key={p} href={`/users?page=${p}`}
              className={`px-2.5 py-1 rounded border ${currentPage === p ? "bg-blue-500 text-white" : "border-gray-200"}`}>
              {p}
            </Link>
          ))}
        </div>
      </div>

      {/* Basic Modals logic kept for UI integrity */}
      {modal === "notification" && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h2 className="font-bold mb-4">Envoyer notification à {selectedUser.name}</h2>
              <textarea className="w-full border p-2 rounded mb-4" rows={4} placeholder="Message..." />
              <div className="flex justify-end gap-2">
                <button onClick={() => setModal(null)} className="px-4 py-2 border rounded">Annuler</button>
                <button className="px-4 py-2 bg-orange-500 text-white rounded">Envoyer</button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
