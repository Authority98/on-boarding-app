"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, ArrowLeft, Eye, Check } from "lucide-react"

export default function SignUpPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/pricing" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to pricing
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
        <p className="text-center text-gray-600 mb-8">Get started with PlankPort Free plan</p>

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 1
                        ? "bg-blue-600 text-white"
                        : step > 1
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                  </div>
                  <span className={`font-medium ${step === 1 ? "text-gray-900" : "text-gray-500"}`}>Personal Info</span>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === 2
                        ? "bg-blue-600 text-white"
                        : step > 2
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    2
                  </div>
                  <span className={`font-medium ${step === 2 ? "text-gray-900" : "text-gray-500"}`}>Agency Info</span>
                </div>
              </CardHeader>

              <CardContent>
                {step === 1 && (
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          placeholder="First Name"
                          className="h-12"
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
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
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
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    <Button type="button" className="w-full h-12 text-base" onClick={() => setStep(2)}>
                      Continue
                    </Button>
                  </form>
                )}

                {step === 2 && (
                  <form className="space-y-6">
                    <div>
                      <Input
                        id="agencyName"
                        name="agencyName"
                        type="text"
                        required
                        placeholder="Agency Name"
                        className="h-12"
                      />
                    </div>

                    <div>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          plankport.com/
                        </span>
                        <Input
                          id="agencyUrl"
                          name="agencyUrl"
                          type="text"
                          required
                          placeholder="your-agency"
                          className="h-12 rounded-l-none"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        This will be your agency's unique URL for client access
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input id="website" name="website" type="url" placeholder="Website URL" className="h-12" />
                      </div>
                      <div>
                        <Input id="phone" name="phone" type="tel" placeholder="Phone Number" className="h-12" />
                      </div>
                    </div>

                    <div>
                      <Input
                        id="billingAddress"
                        name="billingAddress"
                        type="text"
                        placeholder="Billing Address"
                        className="h-12"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Input id="city" name="city" type="text" placeholder="City" className="h-12" />
                      </div>
                      <div>
                        <Input
                          id="postalCode"
                          name="postalCode"
                          type="text"
                          placeholder="Postal Code"
                          className="h-12"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-12 bg-transparent"
                        onClick={() => setStep(1)}
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 h-12 text-base">
                        Create Account
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
                    $0<span className="text-base font-normal text-gray-600">/forever</span>
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
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Basic task management</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Client portal</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Email notifications</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
                  <Link href="/signin" className="text-blue-600 hover:text-blue-500 font-medium">
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
