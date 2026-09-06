import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  stock: number
  image?: string
  sku?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  hasHydrated: boolean
  setIsOpen: (open: boolean) => void
  toggleCart: () => void
  addItem: (product: Omit<CartItem, "quantity">, quantity?: number) => boolean
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  setHasHydrated: (state: boolean) => void

  // Selectors
  getTotalItems: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      hasHydrated: false,

      setIsOpen: (open) => set({ isOpen: open }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      setHasHydrated: (state) => set({ hasHydrated: state }),

      addItem: (product, quantity = 1) => {
        const { items } = get()
        const existingIndex = items.findIndex((i) => i.productId === product.productId)

        if (existingIndex > -1) {
          const currentItem = items[existingIndex]
          const newQty = currentItem.quantity + quantity

          // Respect available inventory stock
          if (newQty > product.stock) {
            return false
          }

          const updatedItems = [...items]
          updatedItems[existingIndex] = {
            ...currentItem,
            quantity: newQty,
            stock: product.stock, // keep stock updated
          }

          set({ items: updatedItems, isOpen: true })
          return true
        }

        // Verify requested quantity doesn't exceed stock
        if (quantity > product.stock) {
          return false
        }

        set({
          items: [...items, { ...product, quantity }],
          isOpen: true,
        })
        return true
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }))
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.productId === productId) {
              const safeQuantity = Math.min(quantity, item.stock)
              return { ...item, quantity: safeQuantity }
            }
            return item
          }),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: "ecommerce_customer_cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
