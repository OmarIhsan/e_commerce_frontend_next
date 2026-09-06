"use server"

import { cookies } from "next/headers"
import { z } from "zod"
import { apiClient, ApiError } from "@/lib/api-client"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export interface AuthActionResult {
  success: boolean
  error?: string
  customer?: {
    id: string
    name: string
    email: string
  }
}

const COOKIE_NAME = "customer_session_token"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/**
 * Log in customer and set customer_session_token cookie
 */
export async function loginAction(
  prevState: unknown,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = loginSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid credentials format",
    }
  }

  try {
    const res = await apiClient<{
      token?: string
      accessToken?: string
      customer?: { id: string; name: string; email: string }
      user?: { id: string; name: string; email: string }
      message?: string
    }>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    })

    const token = res.token || res.accessToken
    if (!token) {
      return {
        success: false,
        error: "Authentication token missing from server response",
      }
    }

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    })

    const customer = res.customer || res.user

    return {
      success: true,
      customer,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to log in",
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Register new customer and set customer_session_token cookie
 */
export async function registerAction(
  prevState: unknown,
  formData: FormData
): Promise<AuthActionResult> {
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = registerSchema.safeParse(rawData)
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid registration format",
    }
  }

  try {
    const res = await apiClient<{
      token?: string
      accessToken?: string
      customer?: { id: string; name: string; email: string }
      user?: { id: string; name: string; email: string }
      message?: string
    }>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    })

    const token = res.token || res.accessToken
    if (token) {
      const cookieStore = await cookies()
      cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
      })
    }

    const customer = res.customer || res.user

    return {
      success: true,
      customer,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message || "Failed to register account",
      }
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

/**
 * Log out customer by deleting customer_session_token cookie
 */
export async function logoutAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  return { success: true }
}

/**
 * Get current customer profile or session state
 */
export async function getCurrentCustomer(): Promise<{
  isAuthenticated: boolean
  customer?: { id: string; name: string; email: string }
}> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return { isAuthenticated: false }
  }

  try {
    const res = await apiClient<{
      customer?: { id: string; name: string; email: string }
      user?: { id: string; name: string; email: string }
    }>("/api/v1/auth/me", {
      token,
    })

    const customer = res.customer || res.user
    return {
      isAuthenticated: true,
      customer,
    }
  } catch {
    // If /me endpoint fails or offline, return session flag
    return {
      isAuthenticated: true,
      customer: { id: "cust_current", name: "Customer", email: "" },
    }
  }
}
