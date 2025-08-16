'use client'

import { PricingPlans } from '@/components/pricing-plans'

export default function UpgradePage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Upgrade Your Plan</h1>
        <p className="text-muted-foreground">
          Choose the perfect plan for your agency's needs and unlock powerful features.
        </p>
      </div>
      
      <PricingPlans showHeader={false} showBillingToggle={false} className="" />
    </div>
  )
}