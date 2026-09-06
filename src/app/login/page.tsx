"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { loginAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sparkles, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/products"

  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await loginAction(null, formData)

    if (result.success) {
      router.refresh()
      router.push(callbackUrl)
    } else {
      setError(result.error || "Authentication failed. Please verify credentials.")
      setLoading(false)
    }
  }

  // Quick dev login simulation to easily test /checkout protected routes
  const handleQuickDemo = async () => {
    setLoading(true)
    setError(null)
    const formData = new FormData()
    formData.append("email", "customer@lumenstore.dev")
    formData.append("password", "password123")

    const result = await loginAction(null, formData)
    if (result.success) {
      router.refresh()
      router.push(callbackUrl)
    } else {
      // If backend offline, set cookie client-side for dev testing
      document.cookie = `customer_session_token=demo_jwt_token_${Date.now()}; path=/; max-age=86400; SameSite=Lax`
      router.refresh()
      router.push(callbackUrl)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg border-border/80">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center mb-1">
            <Sparkles className="w-5 h-5" />
          </div>
          <CardTitle className="text-2xl font-heading font-black tracking-tight">
            Customer Sign In
          </CardTitle>
          <CardDescription className="text-xs">
            Enter your credentials to access your account and complete checkout.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Email Address
              </label>
              <Input
                name="email"
                type="email"
                placeholder="customer@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Password
                </label>
                <span className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 font-semibold shadow-xs mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-card px-2 text-muted-foreground font-mono">
                  Development Mode
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleQuickDemo}
              disabled={loading}
              className="w-full h-9 text-xs border-dashed text-primary hover:bg-primary/5"
            >
              <Lock className="w-3.5 h-3.5 mr-1.5" />
              <span>1-Click Test Customer Sign In</span>
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-0 text-center">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link
                href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="font-semibold text-primary hover:underline"
              >
                Create Account
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
