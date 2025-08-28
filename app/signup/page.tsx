"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Calendar, ArrowLeft, Eye, EyeOff, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signUp } = useAuth()
  const router = useRouter()

  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agencyName: "",
    agencyUrl: "",
    website: "",
    phone: "",
    billingAddress: "",
    city: "",
    postalCode: ""
  })

  // Function to convert agency name to URL-friendly format
  const slugify = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .replace(/-+/g, '-') // Replace multiple consecutive hyphens with single hyphen
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const updatedData = { ...prev, [field]: value }
      
      // Auto-fill agency URL when agency name changes
      if (field === 'agencyName') {
        updatedData.agencyUrl = slugify(value)
      }
      
      return updatedData
    })
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    
    setStep(2)
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { error } = await signUp(formData.email, formData.password, {
      first_name: formData.firstName,
      last_name: formData.lastName,
      agency_name: formData.agencyName,
      agency_url: formData.agencyUrl,
      website: formData.website,
      phone: formData.phone,
      billing_address: formData.billingAddress,
      city: formData.city,
      postal_code: formData.postalCode
    })
    
    if (error) {
      setError(error.message)
    } else {
      router.push("/dashboard")
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-6xl mx-auto">
        <Link href="/pricing" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to pricing
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>

        <h1 className="text-center text-3xl font-bold text-foreground mb-2">Create Your Account</h1>
        <p className="text-center text-muted-foreground mb-8">Get started with PlankPort Free plan</p>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === 1
                          ? "bg-primary text-primary-foreground"
                          : step > 1
                            ? "bg-green-600 dark:bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                    </div>
                    <span className={`font-medium ${step === 1 ? "text-foreground" : "text-muted-foreground"}`}>Personal Info</span>
                  </div>

                  <div className="flex-1 mx-6">
                    <div className="h-px bg-border"></div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step === 2
                          ? "bg-primary text-primary-foreground"
                          : step > 2
                            ? "bg-green-600 dark:bg-green-500 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      2
                    </div>
                    <span className={`font-medium ${step === 2 ? "text-foreground" : "text-muted-foreground"}`}>Agency Info</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {step === 1 && (
                  <form className="space-y-6" onSubmit={handleStep1Submit}>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          placeholder="First Name"
                          className="h-12"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          placeholder="Last Name"
                          className="h-12"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Email Address"
                        className="h-12"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Password (at least 8 characters)"
                          className="h-12 pr-10"
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          placeholder="Confirm Password"
                          className="h-12 pr-10"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm text-center">
                        {error}
                      </div>
                    )}

                    <Button type="submit" className="w-full h-12 text-base">
                      Continue
                    </Button>
                  </form>
                )}

                {step === 2 && (
                  <form className="space-y-6" onSubmit={handleStep2Submit}>
                    <div>
                      <Input
                        id="agencyName"
                        name="agencyName"
                        type="text"
                        required
                        placeholder="Agency Name"
                        className="h-12"
                        value={formData.agencyName}
                        onChange={(e) => handleInputChange("agencyName", e.target.value)}
                      />
                    </div>

                    <div>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                          plankport.com/
                        </span>
                        <Input
                          id="agencyUrl"
                          name="agencyUrl"
                          type="text"
                          required
                          placeholder="your-agency"
                          className="h-12 rounded-l-none"
                          value={formData.agencyUrl}
                          onChange={(e) => handleInputChange("agencyUrl", e.target.value)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        This will be your agency's unique URL for client access
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input 
                          id="website" 
                          name="website" 
                          type="url" 
                          placeholder="Website URL" 
                          className="h-12" 
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                        />
                      </div>
                      <div>
                        <Input 
                          id="phone" 
                          name="phone" 
                          type="tel" 
                          placeholder="Phone Number" 
                          className="h-12" 
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Input
                        id="billingAddress"
                        name="billingAddress"
                        type="text"
                        placeholder="Billing Address"
                        className="h-12"
                        value={formData.billingAddress}
                        onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input 
                          id="city" 
                          name="city" 
                          type="text" 
                          placeholder="City" 
                          className="h-12" 
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </div>
                      <div>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          placeholder="Postal Code"
                          className="h-12"
                          value={formData.postalCode}
                          onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm text-center">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-transparent"
                        onClick={() => setStep(1)}
                        disabled={loading}
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 h-12 text-base" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pricing Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">
                    Free Plan
                  </Badge>
                  <div className="text-3xl font-bold">
                    $0<span className="text-base font-normal text-muted-foreground">/forever</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Employees:</span>
                    <span className="font-medium">1 employee (You)</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Clients:</span>
                    <span className="font-medium">3 clients</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Included features:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>Basic task management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>Client portal</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span>Email notifications</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Already have an account?</p>
                  <Link href="/signin" className="text-primary hover:text-primary/80 font-medium">
                    Sign In
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
