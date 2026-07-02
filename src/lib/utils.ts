import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "FCFA") {
  return `${amount.toLocaleString("fr-FR")} ${currency}`
}

export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

export function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "active":
    case "approved":
    case "completed":
    case "online":
      return "bg-green-100 text-green-700"
    case "inactive":
    case "rejected":
    case "cancelled":
      return "bg-red-100 text-red-700"
    case "pending":
    case "offline":
      return "bg-gray-100 text-gray-600"
    case "processing":
      return "bg-blue-100 text-blue-700"
    default:
      return "bg-gray-100 text-gray-600"
  }
}
