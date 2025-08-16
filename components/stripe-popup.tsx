'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { CreditCard, X } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface StripePopupProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  priceId: string
  price: string
}

export function StripePopup({ isOpen, onClose, planName, priceId, price }: StripePopupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  if (!isOpen) return null

  const handleCheckout = async () => {
    if (!user) {
      alert('Please sign in to continue')
      return
    }

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          planName,
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      // Handle error silently
      alert('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Subscribe to {planName}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            You're about to subscribe to the {planName} plan
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-6">{price}</p>
          
          <div className="space-y-3">
            <LoadingButton
              onClick={handleCheckout}
              loading={isLoading}
              className="w-full"
            >
              Continue to Payment
            </LoadingButton>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}