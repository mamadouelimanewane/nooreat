"use client"

import { useState } from "react"
import { Search, RefreshCw, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, row: T, index: number) => React.ReactNode
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  searchable?: boolean
  onRefresh?: () => void
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchable = true,
  onRefresh,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const filtered = data.filter((row) =>
    searchable
      ? Object.values(row).some((v) =>
          String(v).toLowerCase().includes(search.toLowerCase())
        )
      : true
  )

  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const av = a[sortKey]
        const bv = b[sortKey]
        const cmp = av < bv ? -1 : av > bv ? 1 : 0
        return sortDir === "asc" ? cmp : -cmp
      })
    : filtered

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortKey(key); setSortDir("asc") }
  }

  return (
    <div>
      {searchable && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Rechercher :</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-48"
              placeholder="Rechercher..."
            />
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold text-gray-600 whitespace-nowrap",
                    col.sortable && "cursor-pointer hover:bg-gray-100 select-none"
                  )}
                  onClick={() => col.sortable && toggleSort(String(col.key))}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && (
                      <span className="text-gray-300">
                        {sortKey === String(col.key) ? (
                          sortDir === "asc" ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : (
                          <ChevronUp size={12} className="opacity-40" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-gray-400 text-sm">
                  Aucun résultat trouvé
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-4 py-3 text-gray-700">
                      {col.render
                        ? col.render(row[col.key as string], row, i)
                        : row[col.key as string]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-gray-400">
        Affichage de {sorted.length} sur {data.length} entrées
      </div>
    </div>
  )
}
