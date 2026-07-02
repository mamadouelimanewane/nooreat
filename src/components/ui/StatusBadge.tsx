import { cn } from "@/lib/utils"

export default function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase()
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        s === "active" || s === "online" || s === "approved" || s === "completed"
          ? "bg-green-100 text-green-700"
          : s === "inactive" || s === "rejected" || s === "cancelled"
          ? "bg-red-100 text-red-700"
          : s === "pending"
          ? "bg-yellow-100 text-yellow-700"
          : s === "offline"
          ? "bg-gray-100 text-gray-600"
          : s === "processing"
          ? "bg-blue-100 text-blue-700"
          : "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  )
}
