export interface Product {
  id: string
  name: string
  description?: string
  price: number
  stock: number
  sku?: string
  category?: string
  image?: string
  imageUrl?: string
  slug?: string
  images?: Array<{
    id?: string
    url: string
    altText?: string | null
    isPrimary?: boolean
  }>
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  productCount?: number
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
