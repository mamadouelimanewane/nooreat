export type CartItem = { productId: string; name: string; price: number; quantity: number }
export type Cart = { storeId: string; storeName: string; items: CartItem[] }

const CART_KEY = "ne_client_cart"

export function getCart(): Cart | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(CART_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Cart
  } catch {
    return null
  }
}

function saveCart(cart: Cart | null) {
  if (!cart || cart.items.length === 0) {
    localStorage.removeItem(CART_KEY)
  } else {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }
}

export function setItemQuantity(
  storeId: string,
  storeName: string,
  product: { id: string; name: string; price: number },
  quantity: number,
): Cart | null {
  let cart = getCart()
  if (!cart || cart.storeId !== storeId) {
    cart = { storeId, storeName, items: [] }
  }
  const existingIndex = cart.items.findIndex((i) => i.productId === product.id)
  if (quantity <= 0) {
    if (existingIndex >= 0) cart.items.splice(existingIndex, 1)
  } else if (existingIndex >= 0) {
    cart.items[existingIndex].quantity = quantity
  } else {
    cart.items.push({ productId: product.id, name: product.name, price: product.price, quantity })
  }
  saveCart(cart)
  return getCart()
}

export function clearCart() {
  localStorage.removeItem(CART_KEY)
}

export function cartTotal(cart: Cart | null): number {
  if (!cart) return 0
  return cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}

export function cartCount(cart: Cart | null): number {
  if (!cart) return 0
  return cart.items.reduce((sum, i) => sum + i.quantity, 0)
}
