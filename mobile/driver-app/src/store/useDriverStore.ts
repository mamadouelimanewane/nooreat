import { create } from "zustand"

interface Driver {
  id: string
  name: string
  phone: string
  email?: string
  vehicleType?: string
  rating?: number
  totalOrders?: number
  walletBalance?: number
}

interface DriverStore {
  driver: Driver | null
  token: string | null
  isAuthenticated: boolean
  isOnline: boolean
  setDriver: (driver: Driver, token: string) => void
  updateDriver: (patch: Partial<Driver>) => void
  logout: () => void
  setOnline: (online: boolean) => void
}

export const useDriverStore = create<DriverStore>((set, get) => ({
  driver: null,
  token: null,
  isAuthenticated: false,
  isOnline: false,
  setDriver: (driver, token) => set({ driver, token, isAuthenticated: true }),
  updateDriver: (patch) => set({ driver: get().driver ? { ...get().driver, ...patch } as Driver : null }),
  logout: () => set({ driver: null, token: null, isAuthenticated: false, isOnline: false }),
  setOnline: (online) => set({ isOnline: online }),
}))
