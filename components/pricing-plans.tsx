'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Rocket, Building, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { StripePopup } from '@/components/stripe-popup'

interface PricingPlansProps {
  showHeader?: boolean
  showBillingToggle?: boolean
  className?: string
}

export function PricingPlans({ showHeader = true, showBillingToggle = true, className = '' }: PricingPlansProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [showStripePopup, setShowStripePopup] = useState(false)
  const { user } = useAuth()

  const getPrice = (monthlyPrice: number) => {
    return billingPeriod === 'annual' ? Math.round(monthlyPrice * 0.8) : monthlyPrice
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground mb-8">Upgrade your account to unlock more features</p>
        </div>
      )}

      {showBillingToggle && (
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={billingPeriod === "monthly" ? "default" : "outline"}
              className="rounded-full cursor-pointer"
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billingPeriod === "annual" ? "default" : "outline"}
              className="rounded-full cursor-pointer"
              onClick={() => setBillingPeriod("annual")}
            >
              Annual{" "}
              <Badge variant="secondary" className="ml-2">
                Save 20%
              </Badge>
            </Button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <Card className="relative">
          <CardHeader className="text-center pb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl mb-2">Free Plan</CardTitle>
            <p className="text-muted-foreground mb-4">Perfect for getting started</p>
            <div className="text-4xl font-bold">Free</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Basic project management</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Up to 3 projects</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Email support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Basic analytics</span>
              </div>
            </div>
            {user ? (
              <Button variant="outline" className="w-full mt-6 bg-transparent cursor-pointer">
                Current Plan
              </Button>
            ) : (
              <Button asChild variant="outline" className="w-full mt-6 cursor-pointer">
                <Link href="/signup">Get Started</Link>
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Startup Plan */}
        <Card className="relative border-blue-200 shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl mb-2">Startup Plan</CardTitle>
            <p className="text-muted-foreground mb-4">Great for growing businesses</p>
            <div className="text-4xl font-bold">
              ${getPrice(99)}{" "}
              <span className="text-base font-normal text-muted-foreground">
                /{billingPeriod === "monthly" ? "month" : "year"}
              </span>
            </div>
            {billingPeriod === "annual" && <p className="text-sm text-green-600 mt-1">Save $238 per year</p>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Everything in Free</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Unlimited projects</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Priority support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Advanced analytics</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Team collaboration</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Custom integrations</span>
              </div>
            </div>
            <Button 
              className="w-full mt-6 cursor-pointer"
              onClick={() => setShowStripePopup(true)}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              {user ? "Upgrade Now" : "Get Started"}
            </Button>
          </CardContent>
        </Card>

        {/* Agency Plan */}
        <Card className="relative">
          <CardHeader className="text-center pb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl mb-2">Agency Plan</CardTitle>
            <p className="text-gray-600 mb-4">For established agencies</p>
            <div className="text-4xl font-bold">
              ${getPrice(299)}{" "}
              <span className="text-base font-normal text-gray-600">
                /{billingPeriod === "monthly" ? "month" : "year"}
              </span>
            </div>
            {billingPeriod === "annual" && <p className="text-sm text-green-600 mt-1">Save $717 per year</p>}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Everything in Startup</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">White-label solutions</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Advanced reporting</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Dedicated account manager</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">Custom development</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-sm">SLA guarantee</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-6 bg-transparent cursor-pointer"
              onClick={() => setShowStripePopup(true)}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              {user ? "Upgrade Now" : "Get Started"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <StripePopup 
        isOpen={showStripePopup} 
        onClose={() => setShowStripePopup(false)} 
      />
    </div>
  )
}