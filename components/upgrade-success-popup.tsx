'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles, Zap, Users, BarChart3, Headphones, Shield } from 'lucide-react'

interface UpgradeSuccessPopupProps {
  isOpen: boolean
  onClose: () => void
  planName: string
}

const planFeatures = {
  'Startup': {
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    displayName: 'Startup Plan',
    features: [
      { icon: Users, text: 'Unlimited clients' },
      { icon: BarChart3, text: 'Advanced analytics' },
      { icon: Headphones, text: 'Priority support' },
      { icon: Check, text: 'Team collaboration' },
      { icon: Check, text: 'Custom integrations' }
    ]
  },
  'Agency': {
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    displayName: 'Agency Plan',
    features: [
      { icon: Check, text: 'Everything in Startup' },
      { icon: Shield, text: 'White-label solutions' },
      { icon: BarChart3, text: 'Advanced reporting' },
      { icon: Headphones, text: 'Dedicated account manager' },
      { icon: Check, text: 'Custom development' },
      { icon: Check, text: 'SLA guarantee' }
    ]
  }
}

export function UpgradeSuccessPopup({ isOpen, onClose, planName }: UpgradeSuccessPopupProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  // Normalize plan name by removing " Plan" suffix if present
  const normalizedPlanName = planName.replace(/ Plan$/, '')
  const plan = planFeatures[normalizedPlanName as keyof typeof planFeatures]
  const PlanIcon = plan?.icon || Sparkles

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      const timer = setTimeout(() => setShowConfetti(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!plan) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 relative">
            <div className={`w-16 h-16 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto`}>
              <PlanIcon className={`w-8 h-8 ${plan.color}`} />
            </div>
            {showConfetti && (
              <div className="absolute -top-2 -right-2">
                <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
              </div>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            🎉 Welcome to {plan.displayName}!
          </DialogTitle>
          <p className="text-muted-foreground mt-2">
            Your upgrade was successful! Here's what you've unlocked:
          </p>
        </DialogHeader>
        
        <div className="space-y-4 mt-6">
          <div className="space-y-3">
            {plan.features.map((feature, index) => {
              const FeatureIcon = feature.icon
              return (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                    <FeatureIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    NEW
                  </Badge>
                </div>
              )
            })}
          </div>
          
          <div className="pt-4 border-t">
            <Button onClick={onClose} className="w-full">
              Start Exploring
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}