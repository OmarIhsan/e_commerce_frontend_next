import { Metadata } from "next"
import { notFound } from "next/navigation"
import { Product } from "@/types/product"
import { ProductDetailClient } from "./pdp-client"

interface PDPPageProps {
  params: Promise<{
    id: string
  }>
}

const API_BASE_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://ecommercebackendbunprisma.vercel.app"

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/products/${id}`, {
      next: { revalidate: 60, tags: [`product-${id}`] },
      headers: { "Content-Type": "application/json" },
    })

    if (!res.ok) {
      return null
    }

    const json = await res.json()
    if (json && json.data) return json.data
    if (json && json.id) return json
    return null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PDPPageProps): Promise<Metadata> {
  const resolved = await params
  const product = await getProduct(resolved.id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at Lumen Store.`,
  }
}

export default async function ProductDetailPage({ params }: PDPPageProps) {
  const resolved = await params
  const product = await getProduct(resolved.id)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product} />
}
