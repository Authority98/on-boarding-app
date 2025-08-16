'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check, Zap, Rocket, Building, ArrowUpRight } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { StripePopup } from '@/components/stripe-popup'
import { getPlanDisplayName } from '@/lib/subscription'

interface PricingPlansProps {
  showHeader?: boolean
  showBillingToggle?: boolean
  className?: string
}

export function PricingPlans({ showHeader = true, showBillingToggle = true, className = '' }: PricingPlansProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [showStripePopup, setShowStripePopup] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    priceId: string;
    price: string;
  } | null>(null)
  const { user, subscription, subscriptionLoading } = useAuth()

  const getPrice = (monthlyPrice: number) => {
    return billingPeriod === 'annual' ? Math.round(monthlyPrice * 0.8) : monthlyPrice
  }

  // Helper function to check if user is on a specific plan and billing period
  const isCurrentPlan = (planType: 'free' | 'startup' | 'agency') => {
    if (!subscription) {
      return planType === 'free'
    }
    
    const currentPlan = subscription.plan_name?.toLowerCase() || ''
    const currentBillingPeriod = subscription.billing_period || 'monthly'
    
    switch (planType) {
      case 'free':
        return currentPlan === 'free' || currentPlan === '' || !subscription.plan_name || subscription.id === 'free-plan'
      case 'startup':
        return currentPlan.includes('startup') && currentBillingPeriod === billingPeriod
      case 'agency':
        return currentPlan.includes('agency') && currentBillingPeriod === billingPeriod
      default:
        return false
    }
  }
  
  // Helper function to check if user can upgrade billing period for same plan
  const canUpgradeBillingPeriod = (planType: 'startup' | 'agency') => {
    if (!subscription) return false
    
    const currentPlan = subscription.plan_name?.toLowerCase() || ''
    const currentBillingPeriod = subscription.billing_period || 'monthly'
    
    // Can upgrade if on same plan type but different billing period
    const isOnSamePlanType = planType === 'startup' ? currentPlan.includes('startup') : currentPlan.includes('agency')
    const isDifferentBillingPeriod = currentBillingPeriod !== billingPeriod
    
    return isOnSamePlanType && isDifferentBillingPeriod
  }

  // Handle downgrade functionality
  const handleDowngrade = async (targetPlan: 'free' | 'startup') => {
    if (!user) return
    
    try {
      const response = await fetch('/api/stripe/downgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetPlan,
          userId: user.id
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        alert(data.message || 'Downgrade successful!')
        // Refresh the page to update subscription status
        window.location.reload()
      } else {
        alert(data.error || 'Downgrade failed')
      }
    } catch (error) {
      // Handle downgrade error
      alert('An error occurred during downgrade')
    }
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
              <Button 
                variant="outline" 
                className="w-full mt-6 bg-transparent cursor-pointer" 
                disabled={isCurrentPlan('free')}
                onClick={() => {
                  if (!isCurrentPlan('free')) {
                    if (confirm('Are you sure you want to downgrade to the Free plan? This will cancel your current subscription at the end of the billing period.')) {
                      handleDowngrade('free')
                    }
                  }
                }}
              >
                {isCurrentPlan('free') ? 'Current Plan' : 'Downgrade to Free'}
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
              ${getPrice(29)}{" "}
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
              variant="outline" 
              className="w-full mt-6 bg-transparent cursor-pointer"
              onClick={() => {
                if (isCurrentPlan('startup')) {
                  return // Already on this exact plan and billing period
                }
                
                // If user can upgrade billing period for same plan
                if (canUpgradeBillingPeriod('startup')) {
                  setSelectedPlan({
                    name: 'Startup Plan',
                    priceId: billingPeriod === 'monthly' ? 'price_1RwJoKJqCJQV0KJvtvIAiMJp' : 'price_1RwJoLJqCJQV0KJvytdq2XPq',
                    price: `$${getPrice(29)}/${billingPeriod === 'monthly' ? 'month' : 'year'}`
                  })
                  setShowStripePopup(true)
                  return
                }
                
                // If user is on Agency plan, handle downgrade
                if (isCurrentPlan('agency')) {
                  if (confirm('Are you sure you want to downgrade to the Startup plan?')) {
                    handleDowngrade('startup')
                  }
                  return
                }
                
                // Otherwise, handle upgrade
                setSelectedPlan({
                  name: 'Startup Plan',
                  priceId: billingPeriod === 'monthly' ? 'price_1RwJoKJqCJQV0KJvtvIAiMJp' : 'price_1RwJoLJqCJQV0KJvytdq2XPq',
                  price: `$${getPrice(29)}/${billingPeriod === 'monthly' ? 'month' : 'year'}`
                })
                setShowStripePopup(true)
              }}
              disabled={isCurrentPlan('startup')}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              {isCurrentPlan('startup') ? 'Current Plan' : (user ? (isCurrentPlan('agency') ? 'Downgrade' : 'Upgrade Now') : "Get Started")}
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
              onClick={() => {
                if (isCurrentPlan('agency')) {
                  return // Already on this exact plan and billing period
                }
                
                // If user can upgrade billing period for same plan
                if (canUpgradeBillingPeriod('agency')) {
                  setSelectedPlan({
                    name: 'Agency Plan',
                    priceId: billingPeriod === 'monthly' ? 'price_1RwJoMJqCJQV0KJvwV3HyyIu' : 'price_1RwJoMJqCJQV0KJvhEd3P4vk',
                    price: `$${getPrice(299)}/${billingPeriod === 'monthly' ? 'month' : 'year'}`
                  })
                  setShowStripePopup(true)
                  return
                }
                
                setSelectedPlan({
                  name: 'Agency Plan',
                  priceId: billingPeriod === 'monthly' ? 'price_1RwJoMJqCJQV0KJvwV3HyyIu' : 'price_1RwJoMJqCJQV0KJvhEd3P4vk',
                  price: `$${getPrice(299)}/${billingPeriod === 'monthly' ? 'month' : 'year'}`
                })
                setShowStripePopup(true)
              }}
              disabled={isCurrentPlan('agency') && !canUpgradeBillingPeriod('agency')}
            >
              <ArrowUpRight className="w-4 h-4 mr-2" />
              {isCurrentPlan('agency') ? 'Current Plan' : (user ? "Upgrade Now" : "Get Started")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {selectedPlan && (
        <StripePopup 
          isOpen={showStripePopup} 
          onClose={() => {
            setShowStripePopup(false)
            setSelectedPlan(null)
          }}
          planName={selectedPlan.name}
          priceId={selectedPlan.priceId}
          price={selectedPlan.price}
        />
      )}
    </div>
  )
}