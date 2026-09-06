import { cookies } from "next/headers"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:3000"

export class ApiError extends Error {
  status: number
  data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>
  token?: string
}

/**
 * Universal API Client for Storefront
 * Automatically attaches customer_session_token from next/headers on the server,
 * or credentials on the client.
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, token, headers = {}, ...customConfig } = options

  // Build full URL with query parameters
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  const reqHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(headers as Record<string, string>),
  }

  // Handle customer_session_token authorization
  if (token) {
    reqHeaders["Authorization"] = `Bearer ${token}`
  } else if (typeof window === "undefined") {
    // Next.js 15 Server-side: read cookies via next/headers
    try {
      const cookieStore = await cookies()
      const sessionToken = cookieStore.get("customer_session_token")?.value
      if (sessionToken) {
        reqHeaders["Authorization"] = `Bearer ${sessionToken}`
      }
    } catch {
      // Not in request context or headers unavailable
    }
  }

  const config: RequestInit = {
    headers: reqHeaders,
    credentials: "include",
    ...customConfig,
  }

  const response = await fetch(url.toString(), config)

  if (!response.ok) {
    let errorData: unknown
    try {
      errorData = await response.json()
    } catch {
      errorData = await response.text()
    }

    const message =
      typeof errorData === "object" && errorData !== null && "message" in errorData
        ? String((errorData as { message: unknown }).message)
        : `Request failed with status ${response.status}: ${response.statusText}`

    throw new ApiError(message, response.status, errorData)
  }

  // Handle empty 204 responses
  if (response.status === 204) {
    return {} as T
  }

  return (await response.json()) as T
}
