"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { registerAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Sparkles, ArrowRight, Loader2, AlertCircle } from "lucide-react"

export default function RegisterPage() {
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
    const result = await registerAction(null, formData)

    if (result.success) {
      router.refresh()
      router.push(callbackUrl)
    } else {
      setError(result.error || "Registration failed. Please check your information.")
      setLoading(false)
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
            Create Customer Account
          </CardTitle>
          <CardDescription className="text-xs">
            Join LumenStore for instant express checkout and order history.
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
                Full Name
              </label>
              <Input
                name="name"
                placeholder="Jane Doe"
                required
                autoComplete="name"
              />
            </div>

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
              <label className="text-xs font-semibold text-foreground">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-[10px] text-muted-foreground">
                Must be at least 6 characters.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 font-semibold shadow-xs mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-0 text-center">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="font-semibold text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
