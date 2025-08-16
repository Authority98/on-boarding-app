"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Mail } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await resetPassword(email)
    
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
      toast.success("Password reset email sent! Check your inbox.")
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            {sent ? "Check your email" : "Forgot your password?"}
          </h1>
          <p className="text-muted-foreground">
            {sent 
              ? "We've sent a password reset link to your email address."
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </p>
        </CardHeader>
        
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Enter your email address"
                  className="h-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12" 
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </div>
              <Button 
                onClick={() => {
                  setSent(false)
                  setEmail("")
                }}
                variant="outline"
                className="w-full"
              >
                Try again
              </Button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Link 
              href="/signin" 
              className="inline-flex items-center text-sm text-primary hover:text-primary/80"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}