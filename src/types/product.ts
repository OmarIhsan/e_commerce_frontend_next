export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  sku?: string
  category?: string
  image?: string
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ProductsResponse {
  products: Product[]
  total?: number
  page?: number
  limit?: number
}

export interface CheckoutItemPayload {
  productId: string
  quantity: number
  price: number
}

export interface ShippingAddressPayload {
  fullName: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface CheckoutPayload {
  items: CheckoutItemPayload[]
  shippingAddress: ShippingAddressPayload
  paymentMethod?: string
}

export interface OrderConfirmation {
  id: string
  orderNumber?: string
  totalAmount: number
  status: string
  createdAt: string
  items: Array<{
    productId: string
    name?: string
    quantity: number
    price: number
  }>
}
